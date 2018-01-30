#include <avr/wdt.h>
#include <EEPROM.h>
#include "Adafruit_WS2801.h"
#include "SPI.h"

#define DEBUG_SERIAL 1

Adafruit_WS2801 strip = Adafruit_WS2801(300);
unsigned long DURATION_ANIMATION_MS = 30000;
int NUM_ANIMATIONS = 3;
unsigned long last_animation_switch = 0;
int current_animation = 0;
boolean isGame = false;
char sens_tableau = '3';


/***************************************************************** OUTILS DE CONVERSION *******************************************************/

// Create a 24 bit color value from R,G,B
uint32_t ColorToInt(byte r, byte g, byte b)
{
  uint32_t c;
  c = r;
  c <<= 8;
  c |= g;
  c <<= 8;
  c |= b;
  return c;
}

// Returns R, G, B from Integer
uint8_t IntToColorR(uint32_t color){
  uint8_t red = color >> 16;
  return red;
}

uint8_t IntToColorG(uint32_t color){
  uint8_t green = color >> 8;
  return green;
}

uint8_t IntToColorB(uint32_t color){
  uint8_t blue = color;
  return blue;
}

uint32_t hueToRGB(float h, float s=1.0, float v=1.0) {
  int i = h*6;
  float f = (h*6.0) - i;

  uint8_t p = 255*v*(1.0 - s);
  uint8_t q = 255*v*(1.0 - s*f);
  uint8_t t = 255*v*(1.0 - s*(1.0-f));
  uint8_t w = 255*v;
  i = i%6;

  if(s < 0.001)
    return ColorToInt(w, w, w);

  switch(i) {
  case 0:
    return ColorToInt(w, t, p);
  case 1:
    return ColorToInt(q, w, p);
  case 2:
    return ColorToInt(p, w, t);
  case 3:
    return ColorToInt(p, q, w);
  case 4:
    return ColorToInt(t, p, w);
  case 5:
    return ColorToInt(w, p, q);
  }
  return ColorToInt(0, 0, 0);
}

void fadeOut() {
#if DEBUG_SERIAL
  Serial.println("Fading out");
#endif
  for(int step=100; step>0; --step) {
    for (int i = 0; i < strip.numPixels(); ++i)
    {
      uint32_t color = strip.getPixelColor(i);
      uint8_t red = IntToColorR(color)*step/100.0;
      uint8_t green = IntToColorG(color)*step/100.0;
      uint8_t blue = IntToColorB(color)*step/100.0;
      color = ColorToInt(red, green, blue);    
      strip.setPixelColor(i, color); 
    }
  
    strip.show();
    delay(10);
  }
}


int calculer(int ligne, int colonne) {
    switch(sens_tableau){
    case '0' :
        if(ligne % 2 == 0){
            return ligne * 20 + (19 - colonne);
        } else{
            return ligne * 20 + colonne;
        }
        break;
    case '1' :
        if(ligne % 2 == 0){
            return ligne * 20 + colonne;
        } else{
            return ligne * 20 + (19 - colonne);
        }
        break;
    case '2' :
        if(ligne % 2 == 0){
            return (14 - ligne) * 20 +  colonne;
        } else{
            return (14 - ligne) * 20 + (19 - colonne);
        }
        break;
    case '3' :
        if(ligne % 2 == 0){
            return (14 - ligne) * 20 + (19 - colonne);
        } else{
            return (14 -ligne) * 20 + colonne;
        }
        break;

    }
}


/******************* Lecture/écriture EEPROM ******************/
void write_int_EEPROM(int addr, unsigned long value) {
  byte b[4];
  memcpy(b, &value, sizeof value);
  for(int i=0; i<4; ++i) EEPROM.write(i+addr, b[i]);
}

unsigned long read_int_EEPROM(int addr) {
  byte b[4];
  for(int i=0; i<4; ++i) b[i] = EEPROM.read(i+addr);
  unsigned long output;
  memcpy(&output, b, sizeof output);
  return output;
}

void increment_int_EEPROM(int addr) {
   unsigned long i = read_int_EEPROM(addr);
   write_int_EEPROM(addr, i+1);
}

/***************************************************************** ROUE DES COULEURS *******************************************************/

float *hue; 

void fadeInRoueDesCouleurs() {
  for(int value=0; value<100; value++) {
    for (int i = 0; i < strip.numPixels(); i++)
    {
      strip.setPixelColor(i, hueToRGB(hue[i], 1.0, value/100.0)); 
    }
  
    strip.show();
    delay(10);
  }
}

void setupRoueDesCouleurs()  {
    hue = (float*)malloc(300*sizeof(float));
    
    for (int i = 0; i < strip.numPixels(); i++)
      {
        hue[i] = random(0,72)/360.0;
      }
    fadeInRoueDesCouleurs();
}

void loopRoueDesCouleurs()
{
  for (int i = 0; i < strip.numPixels(); i++)
  {
    hue[i] += 0.001;
    if (hue[i] >= 1)
    {
      hue[i] = 0;
    }
  }

  for (int i = 0; i < strip.numPixels(); i++)
  {
    strip.setPixelColor(i, hueToRGB(hue[i])); 
  }

  strip.show();
  delay(50);
}

void destroyRoueDesCouleurs() {
    free(hue);
}


/***************************************************************** ALLUMAGE AU HASARD *******************************************************/

void fadeInAuHasard() {
  for(int value=0; value<100; value++) {
    for (int i = 0; i < strip.numPixels(); i++)
    {
      strip.setPixelColor(i, hueToRGB(hue[i], 1.0, value/100.0)); 
    }
    strip.show();
    delay(50);
  }
}

void setupAuHasard()  {
    hue = (float*)malloc(300*sizeof(float));
   for (int i = 0; i < strip.numPixels(); i++)  //Initialise tout le mur dans une meme couleur pour que toutes les leds soient allumées
    {
      hue[i]=random(250,300)/360.0;
     strip.setPixelColor(i, hueToRGB(hue[i])); //bleu    
    }
    strip.show();   
   
}

void loopAuHasard()  //fonction qui doit piocher au hasard une led et l'allumer d'une couleur au hasard // version actuelle a des defauts, toutes les leds s'allume d'un coup et non une a une
{
  int i;
  for (int j = 0; j < 4; j++) //j=le nombre de pixels a changer en meme temps
    {
    i = random(0,strip.numPixels());
    hue[i]=random(0,100)/360.0;
    strip.setPixelColor(i, hueToRGB(hue[i]));    //choisi une led au hasard et la change dans une couleur au hasard
    }
    strip.show();
    delay(100); //rapidité du changement de couleur
      
}

void destroyAuHasard() {
    free(hue);
}

/***************************************************************** Lineaire *******************************************************/
int *value;
int *sens;
float *hue_expos;

float hue1, hue2;

void setupLineaire(){
  value = (int*)malloc(300*sizeof(int));
  sens = (int*)malloc(300*sizeof(int));
  hue_expos = (float*)malloc(300*sizeof(float));
  
  hue1 = random(0, 10)/10.0;
  hue2 = random(0, 10)/10.0;
  
  for(int i = 0; i < strip.numPixels(); ++i){
      value[i] = random(0, 256);
      sens[i] = random(0, 2) == 0 ? 1 : -1;
      hue_expos[i] = random(0, 2) == 0? hue1 : hue2;
      strip.setPixelColor(i, hueToRGB(hue_expos[i], 1.0, value[i]));
  }
  fadeInLineaire();
}

void fadeInLineaire() {
  for(int step = 0; step<100; ++step) {
    for(int i = 0; i < strip.numPixels(); ++i){
      int fade_value = value[i]*step/100;
      strip.setPixelColor(i, hueToRGB(hue_expos[i], 1.0, fade_value/255.0));
    }
    strip.show();
    delay(20);
  }
}

void loopLineaire(){
  for(int i = 0; i < strip.numPixels(); ++i){
    value[i] = min(255, max(0, value[i] + sens[i]));
    if(value[i] == 0) {
        sens[i] = 1;
        hue_expos[i] = random(0, 2) == 0? hue1 : hue2;
    }
    else if(value[i] == 255) {
      sens[i] = -1;
    }
    strip.setPixelColor(i, hueToRGB(hue_expos[i], 1.0, value[i]/255.0));
  }
  strip.show();
  delay(20);
}

void destroyLineaire() {
  free(value); 
  free(sens);
  free(hue_expos);
}


/***************************************************************** TETRIS ************************************************************/

//  Matrix Definition
#define cols         20
#define rows        15
#define leftLimit    0
#define rightLimit   7
#define topLimit     0
#define bottomLimit 14

int currentMatrix[rows][cols];


/************************* Bluetooth ************************************/
String list[10];
boolean commands[10] = {false, false, false, false, false, false, false, false, false, false};

void setupBluetooth() {
  Serial1.begin(115200);
  Serial1.setTimeout(10);
  
  list[0] = "Right_u";
  list[1] = "Left_u";
  list[2] = "Up_u";
  list[3] = "Down_u";
  list[4] = "Btn1_u";
  list[5] = "Btn2_u";
  list[6] = "Btn3_u";
  list[7] = "Btn4_u";
  list[8] = "Select_u";
  list[9] = "Start_u"; 
}

void resetBluetoothCommands() {
   for(int i=0; i<10; ++i) {
      commands[i] = false;
  } 
}

boolean AnyButtonPressed() {
   for(int i=0; i<10; ++i) {
      if(commands[i]) return true;
  }
  return false;
}

boolean ResetButtonPressed() {
 return commands[8];
}

boolean NextGameButtonPressed() {
 return commands[9];
}

void updateBluetoothCommands() {
  if(Serial1.available()) {
    String s = Serial1.readString();
    if(s.length() > 0) {
      for(int i=0; i<10; ++i) {
        if(s.startsWith(list[i])) {
          commands[i] = true;
          return;
        }
      }
    } 
  }
}

/******************************* Tetris lui-meme ****************************/
#include "tetris_letters.h"
#include "tetris_pieces.h"

// TODO Store the constants below in Flash memory
const byte pieces[19][4][4] = {O1, Z1,Z2, S1,S2, I1,I2, J1,J2,J3,J4, L1,L2,L3,L4, T1,T2,T3,T4};
const byte piecesGenerated[7][4][4] = {O1, Z1, S1, I1, J1, L1, T1};

byte currentPieceIndex;        // stores current piece index: from 0 to 18
byte currentPieceRotatedIndex; // stores the index of the rotated version of the current piece
byte currentPiece[4][4];       // stores the current piece matrix

//the top left corner of the current piece is tracked
int currentPieceRow;           // stores the row position of currentPiece[0][0]
int currentPieceCol;           // stores the col position of currentPiece[0][0]
int currentPieceMovedRow;      // stores the row position of currentPiece[0][0] after a certain move
int currentPieceMovedCol;      // stores the col position of currentPiece[0][0] after a certain move

byte numberOfLinesCleared;
boolean disableMove;
boolean pieceDropping;
byte textColor;
boolean gameRunning;
boolean fastDrop;

unsigned long lastButtonPressTime=millis();
unsigned long time= millis();

//  used in the main loop to calculate the time interval between moves
unsigned long lastMoveTime=millis();
unsigned long currentMoveTime=millis();

unsigned long lastLandedTime=millis();
unsigned long currentLandedTime=millis();

void clearTrace() {
  for (int i=0;i<4;i++) {
    for (int j=0;j<4;j++) {
      if ((currentPieceRow+j>-1 && currentPieceRow+j<rows) && (currentPieceCol+i>-1 && currentPieceCol+i<cols)) {
        if (currentMatrix[currentPieceRow+j][currentPieceCol+i]>0) currentMatrix[currentPieceRow+j][currentPieceCol+i]=0;
      }
    }
  }
}

void updateCurrentMatrix() {
  for (int i=0;i<4;i++) {
    for (int j=0;j<4;j++) {
      if ((currentPieceRow+j>-1 && currentPieceRow+j<rows) && (currentPieceCol+i>-1 && currentPieceCol+i<cols)) {
        if (currentPiece[j][i]!=0) currentMatrix[currentPieceRow+j][currentPieceCol+i]=currentPiece[j][i];
      }
    }
  }
}

void move(int moveDirection) {
  if (moveDirection==2) {
    currentPieceMovedRow=currentPieceRow+1;
    currentPieceMovedCol=currentPieceCol;
  }
  else if (moveDirection==3) {
    currentPieceMovedRow=currentPieceRow;
    currentPieceMovedCol=currentPieceCol-1;
  }
  else if (moveDirection==4) {
    currentPieceMovedRow=currentPieceRow;
    currentPieceMovedCol=currentPieceCol+1;
  }
  // check if move is valid
  if (!checkOverlapAndOutOfBoundary(currentPieceIndex)) {
    clearTrace();
    currentPieceRow=currentPieceMovedRow;
    currentPieceCol=currentPieceMovedCol;
    updateCurrentMatrix();
  }
}

boolean checkOverlapAndOutOfBoundary(byte pieceIndex) {
  int row=currentPieceMovedRow;
  int col=currentPieceMovedCol;
  for (int i=0;i<4;i++) {
    for (int j=0; j<4;j++) {
      if (pieces[pieceIndex][j][i]>0) {   // (row+j>-1 && row+j<rows)
        if (!( row+j<rows && (col+i>-1 && col+i<cols))) return true;  // checks out of boundary
        else if (currentMatrix[row+j][col+i]<0) return true;  // checks overlap
      }
    }
  }
  return false;
}

void rotate() {
  if (currentPieceIndex==0) return;
  else if (currentPieceIndex<3) currentPieceRotatedIndex=3-currentPieceIndex;
  else if (currentPieceIndex<5) currentPieceRotatedIndex=7-currentPieceIndex;
  else if (currentPieceIndex<7) currentPieceRotatedIndex=11-currentPieceIndex;
  else if ((currentPieceIndex % 4)==2) currentPieceRotatedIndex=currentPieceIndex-3;
  else currentPieceRotatedIndex=currentPieceIndex+1;
  
  currentPieceMovedRow=currentPieceRow;
  currentPieceMovedCol=currentPieceCol;
    
  // check if the rotation is valid 
  if (!checkOverlapAndOutOfBoundary(currentPieceRotatedIndex)) {
    clearTrace();
    currentPieceIndex=currentPieceRotatedIndex;
    for (int i=0;i<4;i++) {
      for (int j=0;j<4;j++) {
        currentPiece[j][i]=pieces[currentPieceRotatedIndex][j][i];
      }
    }
    updateCurrentMatrix();
  }
}

boolean checkIfLanded() {
  for (int i=0;i<4;i++) {
    for (int j=0; j<4;j++) {
      if ((currentPieceRow+j>-1 && currentPieceRow+j<rows) && (currentPieceCol+i>-1 && currentPieceCol+i<cols)) {
        if (currentMatrix[currentPieceRow+j][currentPieceCol+i]>0) {
          if (currentPieceRow+j==bottomLimit) return true;            // if the piece has dropped on the bottom
          else if (currentMatrix[currentPieceRow+j+1][currentPieceCol+i]<0) return true;  //if there is any deadblock just below the piece
        }
      }
    }
  }
  return false;
}

boolean generatePiece() {
  byte pieceIndex=random(7);
  for (int i=0; i<4; i++) {
    for (int j=0; j<4; j++) {
      currentPiece[j][i]=piecesGenerated[pieceIndex][j][i];
    }
  }
  for (int i=0; i<4; i++) {
    for (int j=0; j<2; j++) {
      if (piecesGenerated[pieceIndex][j+2][i]>0) {
        if (currentMatrix[j][i+8]<0) return false;
      }
    }
  }
  for (int i=0; i<4; i++) {
    for (int j=0; j<2; j++) {
      if (piecesGenerated[pieceIndex][j+2][i]>0) {
        currentMatrix[j][i+8]=piecesGenerated[pieceIndex][j+2][i];
      }
    }
  }
  currentPieceRow = -2;
  currentPieceCol = 8;
  switch (pieceIndex) {
    case 0:
      currentPieceIndex=0;
      break;
    case 1:
      currentPieceIndex=1;
      break;
    case 2:
      currentPieceIndex=3;
      break;
    case 3:
      currentPieceIndex=5;
      break;
    case 4:
      currentPieceIndex=7;
      break;
    case 5:
      currentPieceIndex=11;
      break;
    case 6:
      currentPieceIndex=15;
      break;
  }
  return true;
}

void convertToDeadBlock() {
  for (int i=0;i<cols;i++) {
    for (int j=0;j<rows;j++) {
      if (currentMatrix[j][i]>0) {
        currentMatrix[j][i]=-currentMatrix[j][i];
      }
    }
  }
}

void checkLinesCleared() {
  byte lineErased[rows];
  byte rowCounter=0;
  for (int j=0;j<rows;j++) {
    byte colCounter=0;
    for (int i=0;i<cols;i++) {
      if (currentMatrix[j][i]==0) {
        lineErased[j]=0;
        break;
      }
      else colCounter+=1;
    }
    if (colCounter==cols) {
      lineErased[j]=1;
      rowCounter+=1;
    }  
  }
  
  if (rowCounter==0) return;  // if no lines are cleared
  
  int tempMatrix[rows-rowCounter][cols];
  byte rowCounter2=0;
  for (int j=0;j<rows;j++) {
    if (lineErased[j]==0) {
      for (int i=0;i<cols;i++) tempMatrix[rowCounter2][i]=currentMatrix[j][i]+0;
      rowCounter2+=1;
    }
  }
  for (int j=0;j<rowCounter;j++) {
    for (int i=0;i<cols;i++) {
      currentMatrix[j][i]=0;
    }
  }
  for (int j=0;j<rows-rowCounter;j++) {
    for (int i=0;i<cols;i++) {
      currentMatrix[j+rowCounter][i]=tempMatrix[j][i];
    }
  }
  numberOfLinesCleared+=rowCounter;
}

void resetTetris() {
    for (int i=0;i<cols;i++) {
      for (int j=0; j<rows; j++)
        currentMatrix[j][i] = 0;
    }
    textColor = random(7)+1;
    numberOfLinesCleared = 0;
    
    // reinitilize variables
    disableMove = false;
    pieceDropping = false;
    fastDrop = false;
}

void checkRotate() {
  time= millis(); 
  if ((commands[2]==true || commands[4]==true || commands[5]==true || commands[6]==true || commands[7]==true)
      && time-lastButtonPressTime>110 && disableMove==false) {
    rotate();
    lastButtonPressTime=millis();
  }
}

void startDropping() {
  time = millis();
  if (commands[3]==true && time-lastButtonPressTime>110 && disableMove==false) {
    pieceDropping=true;
    lastButtonPressTime=millis();
  }
}

void checkLeft()  {
  time= millis();
  if (commands[1]==true && time-lastButtonPressTime>110 && disableMove==false) {
    move(3);
    lastButtonPressTime=millis();
  }
}

void checkRight() {  
  time= millis();
  if (commands[0]==true && time-lastButtonPressTime>110 && disableMove==false) {
    move(4);
    lastButtonPressTime=millis();
  }
}

void checkDrop() {  
  time= millis();
  if (commands[3]==true && time-lastButtonPressTime>110 && disableMove==false) {
    fastDrop=true;
    lastButtonPressTime=millis();
  }
}

void setupTetris() {

  //  random seed for color selection, direction selection, and food+snakehead generation  
  byte rand1=random(7);
  rand1=random(7);
  rand1=random(7);
  
  //initialize variables
  numberOfLinesCleared=0;
  isGame = true;
  gameRunning = true;
  disableMove = false;
  fastDrop= false;
  generatePiece();
   
}

void destroyTetris() {
  resetTetris();
  isGame = false;
}

void loopTetris() {
  checkRight();
  checkLeft();
  checkRotate();
  checkDrop();
  
  displayFrame();
  currentMoveTime=millis();
  if (fastDrop==true) {
    while (!checkIfLanded()) move(2);
    displayFrame();
    fastDrop=false;
  }
  if (commands[3]==true) pieceDropping=false;
  int timeInterval;
  if (!pieceDropping) timeInterval = 800-numberOfLinesCleared*10;
  else timeInterval= 120;
  if (!checkIfLanded() && currentMoveTime-lastMoveTime>timeInterval) {
    move(2);
    lastMoveTime=millis();
  }
  else if (checkIfLanded()) {
    lastLandedTime=millis();
    while (currentLandedTime<lastLandedTime+400) {
      currentLandedTime=millis();
      displayFrame();
    }
    if (!checkIfLanded()) return;
    else {
      disableMove = true;
      convertToDeadBlock();
      checkLinesCleared();
      if (generatePiece()==false) {
        gameOverFunc();
        //displayTextOverlay(0);
      }
      else disableMove=false;
    }
  }
}

void gameOverFunc() {
  gameRunning = false;
}

void displayFrame() {
  byte color;
  for (int i=0; i<cols; i++) {
    for (int j=0; j<rows; j++) {
      if (currentMatrix[j][i]==0) color=0;
      else if (currentMatrix[j][i]<0) color=-currentMatrix[j][i];
      else if (currentMatrix[j][i]==129) color=textColor;
      else color=currentMatrix[j][i];
      switch (color) {
        case 0:
          strip.setPixelColor(calculer(j, i), 0, 0, 0); 
          break;
        case 1:
          strip.setPixelColor(calculer(j, i), 0, 255, 255); 
          break;
        case 2:
          strip.setPixelColor(calculer(j, i), 255, 0, 255); 
          break;
        case 3:
          strip.setPixelColor(calculer(j, i), 255, 255, 0); 
          break; 
        case 4:
          strip.setPixelColor(calculer(j, i), 0, 0, 255); 
          break; 
        case 5:
          strip.setPixelColor(calculer(j, i), 255, 0, 0); 
          break; 
        case 6:
          strip.setPixelColor(calculer(j, i), 0, 255, 0); 
          break; 
        case 7:
          strip.setPixelColor(calculer(j, i), 0, 0, 255); 
          break;
        default:
          strip.setPixelColor(calculer(j, i), 255, 50, 50); 
      }
    }
  }
  strip.show();
}


/***************************************************************** ENTRY POINT *******************************************************/

void setup() {
  strip.begin();
  strip.show();
  randomSeed(analogRead(0));

#if DEBUG_SERIAL
  while(!Serial);
  Serial.begin(9600);
  Serial.println("Booting");
#endif

  setupBluetooth();
  setupAnimation(0);
}

void setupAnimation(int animation) {
#if DEBUG_SERIAL
  Serial.print("Setting up animation ");
  Serial.println(animation);
  Serial.print("Walltime = ");
  Serial.println(millis());
#endif
  switch(animation) {
    case 2:
      setupTetris();
      break;
    case 1:
      setupLineaire();
      break;
    case 0:
      setupRoueDesCouleurs();
      break;
  }
}

void loopAnimation(int animation) {
  switch(animation) {
    case 2:
      loopTetris();
      break;
    case 1:
      loopLineaire();
      break;
    case 0:
      loopRoueDesCouleurs();
      break;
  }
}

void destroyAnimation(int animation) {
#if DEBUG_SERIAL
  Serial.print("Destroying animation ");
  Serial.println(animation);
#endif
  switch(animation) {
    case 2:
      destroyTetris();
      break;
    case 1:
      destroyLineaire();
      break;
    case 0:
      destroyRoueDesCouleurs();
      break;
  }
}

void initiateAnimationSwitch() {
  last_animation_switch = millis();
  fadeOut();
  destroyAnimation(current_animation);
}

void loop() {
  if(millis() > 4300000) {
    // Gérer le cas improbable où l'exécution dure plus de 50 jours
    // Overflow de millis()
    // Rebooter par déclenchement du chien de garde
    fadeOut();
    wdt_enable(WDTO_15MS);
    while(1);
  }
    
  // Changer d'animation quand le jeu est fini si c'est un jeu ou au bout de DURATION_ANIMATION sinon
  if(isGame == false) {
    if(millis() > last_animation_switch + DURATION_ANIMATION_MS) {
      initiateAnimationSwitch();
      current_animation = (current_animation + 1)%NUM_ANIMATIONS;
      setupAnimation(current_animation);
    }
    else if(AnyButtonPressed()) {
      initiateAnimationSwitch();
      // Drop them to some game
      current_animation = 2;
      setupAnimation(current_animation);
    }
  }
  else { // isGame == true
    if(gameRunning == false) {
      // They've lost
      initiateAnimationSwitch();
      current_animation = (current_animation + 1)%NUM_ANIMATIONS;
      setupAnimation(current_animation);
    }
    else if(NextGameButtonPressed()) {
      initiateAnimationSwitch();
      current_animation = (current_animation + 1)%NUM_ANIMATIONS;
      setupAnimation(current_animation);
    }
    else if(ResetButtonPressed()) {
      initiateAnimationSwitch();
      setupAnimation(current_animation);
    }
  }
 
  resetBluetoothCommands();
  updateBluetoothCommands();
  loopAnimation(current_animation);
}
