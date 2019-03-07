#include <NeoPixelBrightnessBus.h>
#include <NeoPixelAnimator.h>
#include <NeoPixelBus.h>
#include <Ticker.h>
#include <EEPROM.h>
#include <list>

#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define DEBUG_SERIAL 1
#define PROTOCOL_VERSION 1
#define NUM_VERSION 1

#define NUM_PIXELS 150
#define NUM_PIN 23

NeoPixelBus<NeoGrbFeature, Neo800KbpsMethod> strip(NUM_PIXELS, NUM_PIN);

const unsigned long DURATION_ANIMATION_MS = 120000UL;
const unsigned long LIVE_TIMEOUT_MS = 5000UL;
int NUM_ANIMATIONS = 4;

unsigned long last_animation_switch = 0;
unsigned long lastKeyPressed = millis();
unsigned long lastLiveFrameReceived = 0;
int current_animation = 0;
boolean isGame = false;
boolean isLiveControl = false;
char sens_tableau = '4';

//  Matrix Definition
#define cols         10
#define rows         15
#define leftLimit    0
#define rightLimit   7
#define topLimit     0
#define bottomLimit 14

int currentMatrix[rows][cols];


/***************************************** USB *****************************************/

#define CMD_UPDATE 'U'
#define CMD_BEACON 'B'
#define CMD_HELLO 'H'

const int Size_max = 455;//(3(rgb)*150(pixels))+5(RBA1U)
byte liveR, liveG, liveB, FrameId;
int pixelAdd;
byte buffer[Size_max];
char header[3];
int firstByte;
int nbByteRead;


bool readCommand() {
  Serial.setTimeout(10);
  nbByteRead = Serial.readBytes(buffer,Size_max);
  if(nbByteRead != Size_max){// check if the trame is complete
    return false;
  }
  memcpy(header, buffer, 3); // copy 3 first character of buffer in header
  if(strncmp("RBA", header, 3) == 0){// check if the buffer contains
    if(buffer[3] == NUM_VERSION){// check the number of version
      switch(buffer[4]){
        case CMD_HELLO :
          break;
        case CMD_BEACON :
          break;
        case CMD_UPDATE :
          int j = 5;
          for (int i = 0; i < NUM_PIXELS; ++i){
            liveR = buffer[j++];
            liveG = buffer[j++];
            liveB = buffer[j++];
            strip.SetPixelColor(i, RgbColor(liveR,liveG,liveB));
          }
          strip.Show();
          return true;
          break;
      }
    }
  return false;
  }
}
/*
int pin_num = 0;
int nbColumn = 0;
int nbRow = 0;

boolean handshake() {
  Serial.write(CMD_HELLO);
  if(Serial.read()!=CMD_HELLO) return false;
  Serial.write(PROTOCOL_VERSION);
  pin_num = Serial.read();    // default: 12
  if(pin_num==0) return false;
  nbColumn = Serial.read();  // default: 150
  if(nbColumn==0) return false;
  nbRow = Serial.read(); // default: 0 (off)
  if(nbRow==0) return false;

  write_int_EEPROM(0, pin_num);
  write_int_EEPROM(1, nbColumn);
  write_int_EEPROM(2, nbRow);
  
  return true;
}*/
/***************************************************************** CONVERSION TOOLS *******************************************************/


void fadeOut() {
#if DEBUG_SERIAL
  Serial.println("Fading out");
#endif
  for(int stepp=100; stepp>0; --stepp) {
    for (int i = 0; i < NUM_PIXELS; ++i)
    {
      RgbColor colorRGB = strip.GetPixelColor(i);
      colorRGB.R = colorRGB.R*stepp/100.0;
      colorRGB.G = colorRGB.G*stepp/100.0;
      colorRGB.B = colorRGB.B*stepp/100.0;
      strip.SetPixelColor(i, colorRGB);
    }
  
    strip.Show();
  }
}

int map(int ligne, int colonne) {
  switch(sens_tableau){
    case '0' :
        if(ligne % 2 == 0){
            return ligne * cols + ((cols-1) - colonne);
        }else{
            return ligne * cols + colonne;
        }
        break;
    case '1' :
        if(ligne % 2 == 0){
            return ligne * cols + colonne;
        }else{
            return ligne * cols + ((cols-1) - colonne);
        }
        break;
    case '2' :
        if(ligne % 2 == 0){
            return ((rows-1) - ligne) * cols +  colonne;
        }else{
            return ((rows-1) - ligne) * cols + ((cols-1) - colonne);
        }
        break;
    case '3' :
        if(ligne % 2 == 0){
            return ((rows-1) - ligne) * cols + ((cols-1) - colonne);
        }else{
            return ((rows-1) - ligne) * cols +  colonne;
        }
        break;
    case '4' :
        if(colonne % 2 == 0){
            return colonne * rows + ligne;
        }else{
            return colonne * rows + ((rows-1) - ligne);
        }
        break;
  }
}

/******************* Read/Write EEPROM ******************/
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

/***************************************************************** COLOR WHEEL *******************************************************/

float *hue; 

void fadeInRoueDesCouleurs() {
  for(int value=0; value<100; value++) {
    for (int i = 0; i < NUM_PIXELS; i++)
    {
      HsbColor hsb(hue[i], 1.0, value/100.0);
      strip.SetPixelColor(i, hsb); 
    }
  
    strip.Show();
    delay(10);
  }
}

void setupRoueDesCouleurs()  {
    hue = (float*)malloc(NUM_PIXELS*sizeof(float));
    
    for (int i = 0; i < NUM_PIXELS; i++)
      {
        hue[i] = random(0,72)/360.0;
      }
    fadeInRoueDesCouleurs();
}

void loopRoueDesCouleurs()
{
  for (int i = 0; i < NUM_PIXELS; i++)
  {
    hue[i] += 0.001;
    if (hue[i] >= 1)
    {
      hue[i] = 0;
    }
  }

  for (int i = 0; i < NUM_PIXELS; i++)
  {
    HsbColor hsb(hue[i], 1.0, 1.);
    strip.SetPixelColor(i, hsb);
  }

  strip.Show();
  delay(50);
}

void destroyRoueDesCouleurs() {
    free(hue);
}


/***************************************************************** Lineaire *******************************************************/
int *value;
int *sens;
float *hue_expos;

float hue1, hue2;

void setupLineaire(){
  value = (int*)malloc(NUM_PIXELS*sizeof(int));
  sens = (int*)malloc(NUM_PIXELS*sizeof(int));
  hue_expos = (float*)malloc(NUM_PIXELS*sizeof(float));
  
  hue1 = random(0, 10)/10.0;
  hue2 = random(0, 10)/10.0;
  
  for(int i = 0; i < NUM_PIXELS; ++i){
      value[i] = random(0, 256);
      sens[i] = random(0, 2) == 0 ? 1 : -1;
      hue_expos[i] = random(0, 2) == 0? hue1 : hue2;
      HsbColor hsb(hue_expos[i], 1.0,  value[i]);
      strip.SetPixelColor(i, hsb);
  }
  fadeInLineaire();
}

void fadeInLineaire() {
  for(int step = 0; step<100; ++step) {
    for(int i = 0; i < NUM_PIXELS; ++i){
      int fade_value = value[i]*step/100;
      HsbColor hsb(hue_expos[i], 1.0,  fade_value/255.0);
      strip.SetPixelColor(i, hsb);
    }
    strip.Show();
    delay(20);
  }
}

void loopLineaire(){
  for(int i = 0; i < NUM_PIXELS; ++i){
    value[i] = value[i] + sens[i];
    value[i] = value[i]>255? 255 : value[i]<0? 0: value[i];
    //value[i] = min(255, max(0, ));
    if(value[i] == 0) {
        sens[i] = 1;
        hue_expos[i] = random(0, 2) == 0? hue1 : hue2;
    }
    else if(value[i] == 255) {
      sens[i] = -1;
    }
    HsbColor hsb(hue_expos[i], 1.0,  value[i]/255.0);
    strip.SetPixelColor(i, hsb);
  }
  strip.Show();
  delay(20);
}

void destroyLineaire() {
  free(value); 
  free(sens);
  free(hue_expos);
}

/********************************** Bluetooth ************************************/
String list[10];
boolean commands[10] = {false, false, false, false, false, false, false, false, false, false};

void setupBluetooth() {
  Serial1.begin(115200);
  Serial1.setTimeout(10);
  
  list[0] = "Right";
  list[1] = "Left";
  list[2] = "Up";
  list[3] = "Down";
  list[4] = "Btn1";
  list[5] = "Btn2";
  list[6] = "Btn3";
  list[7] = "Btn4";
  list[8] = "Select";
  list[9] = "Start"; 
}

void resetBluetoothCommands() {
   for(int i=0; i<10; ++i) {
      commands[i] = false;
  } 
}

void FlushBluetooth() {
  int l = Serial1.available();
  for(int i=0; i<l; ++i) Serial1.read();
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
    String s = Serial1.readStringUntil('\n');
    if(s.length() > 0) {
      s.remove(s.length()-1);  // Eliminate CR \r
      for(int i=0; i<10; ++i) {
        if(s.equals(list[i])) {
          //Serial.println(s); Serial.println("---");
          commands[i] = true;
          if (lastKeyPressed + 120000UL < millis())
          {
            increment_int_EEPROM(0);
          }
          lastKeyPressed = millis();
          return;
        }
      }
    } 
  }
}

/***************************************** Tetris **************************************/

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
unsigned long time1= millis();

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
  time1= millis(); 
  if ((commands[2]==true || commands[4]==true || commands[5]==true || commands[6]==true || commands[7]==true)
      && time1-lastButtonPressTime>110 && disableMove==false) {
    rotate();
    lastButtonPressTime=millis();
  }
}

void startDropping() {
  time1 = millis();
  if (commands[3]==true && time1-lastButtonPressTime>110 && disableMove==false) {
    pieceDropping=true;
    lastButtonPressTime=millis();
  }
}

void checkLeft()  {
  time1= millis();
  if (commands[1]==true && time1-lastButtonPressTime>110 && disableMove==false) {
    move(3);
    lastButtonPressTime=millis();
  }
}

void checkRight() {  
  time1= millis();
  if (commands[0]==true && time1-lastButtonPressTime>110 && disableMove==false) {
    move(4);
    lastButtonPressTime=millis();
  }
}

void checkDrop() {  
  time1= millis();
  if (commands[3]==true && time1-lastButtonPressTime>110 && disableMove==false) {
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
        gameRunning = false;
        //displayTextOverlay(0);
      }
      else disableMove=false;
    }
  }
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
          strip.SetPixelColor(map(j, i), RgbColor(0, 0, 0)); 
          break;
        case 1:
          strip.SetPixelColor(map(j, i), RgbColor(0, 255, 255)); 
          break;
        case 2:
          strip.SetPixelColor(map(j, i), RgbColor(255, 0, 255)); 
          break;
        case 3:
          strip.SetPixelColor(map(j, i), RgbColor(255, 255, 0)); 
          break; 
        case 4:
          strip.SetPixelColor(map(j, i), RgbColor(0, 0, 255)); 
          break; 
        case 5:
          strip.SetPixelColor(map(j, i), RgbColor(255, 0, 0)); 
          break; 
        case 6:
          strip.SetPixelColor(map(j, i), RgbColor(0, 255, 0)); 
          break; 
        case 7:
          strip.SetPixelColor(map(j, i), RgbColor(0, 0, 255)); 
          break;
        default:
          strip.SetPixelColor(map(j, i), RgbColor(255, 50, 50));
      }
    }
  }
  strip.Show();
}
/***************************************************************** SNAKE **************************************************************/

#define LARGEUR 14
#define HAUTEUR 9
#define T_HAUT 8
#define T_BAS 2
#define T_GAUCHE 4
#define T_DROITE 6

bool gameSnakeIntro;
unsigned long lastSnakeMoveTime;
unsigned long lastSnakeFakeMoveTime;

void color_that_case(int ligne, int colonne, int r, int g, int b){
    strip.SetPixelColor(map(ligne,colonne), RgbColor(r, g, b));
}

class Position {
    private:
         int m_x, m_y;

    public:
		Position(int x, int y)
		  :m_x(x),m_y(y){

		}
		void draw(){
			color_that_case(m_x, m_y, 255, 10, 0);
		}

		void eteindreCase(){
			color_that_case(m_x, m_y, 0, 0, 0);
		}
		int getX(){
			return m_x;
		}
		int getY(){
			return m_y;
		}

};

int directionSnake;
char* positionspossibles;
std::list <Position*> snakeUtil;
unsigned int compteur;

void nouveauFruit(){
    int alea = random(NUM_PIXELS - snakeUtil.size());
    int i = 0;
    int compteurNew = 0;
    boolean fini = false;
    while(compteurNew <= alea && i < NUM_PIXELS && !fini){
      if(positionspossibles[i] == 's'){
        i++;
      }else if(compteurNew == alea){
        positionspossibles[i] = 'f';
        strip.SetPixelColor(i,RgbColor(0, 255, 0));
        fini = true;
      }
      else{
        i++;
        compteurNew ++;
      }
      
    }
    
}
void tourner_couleur(){
  for(int i = 0; i < NUM_PIXELS; i++){
    if(positionspossibles[i] == 's'){
      strip.SetPixelColor(i,RgbColor(0, 0, 0));
      strip.Show();
    }
  }
  
}
void tourner_rouge(){
  for(int j = 0; j < NUM_PIXELS; j++){
    if(positionspossibles[j] == 's'){
      strip.SetPixelColor(j, RgbColor(255, 25, 0));
      strip.Show();
    }
  }
}
void end_snake(){

  for(int k = 0; k < 5; k++){
    tourner_couleur();
    delay(120);
    tourner_rouge();
    
  }
  
  
}


void decaler(int directionSnake){
  
  unsigned char x_front = snakeUtil.front()->getX();
  unsigned char y_front = snakeUtil.front()->getY();
  unsigned char x_back =  snakeUtil.back()->getX();
  unsigned char y_back = snakeUtil.back()->getY();
  color_that_case(x_front,y_front,255,25,0);
  
  
  switch(directionSnake){
        case 0://gauche
          snakeUtil.push_front(new Position(x_front,(y_front+1)%(LARGEUR+1)));
          break;
          
        case 1: //droite
          if(y_front-1 < 0)
          {
            snakeUtil.push_front(new Position(x_front,LARGEUR));
          }
          else{
            snakeUtil.push_front(new Position(x_front,y_front-1));
          }
          break;
        case 2://haut
          snakeUtil.push_front(new Position((x_front+1)%(HAUTEUR+1),y_front));
          break;
          
        case 3://bas
          if(x_front-1 < 0)
          {
            snakeUtil.push_front(new Position(HAUTEUR,y_front));
          }
          else{
            snakeUtil.push_front(new Position(x_front-1,y_front));
          }
          
          break;
      }
    
    x_front = snakeUtil.front()->getX();
    y_front = snakeUtil.front()->getY();
    
    
    if(positionspossibles[map(x_front,y_front)] == 'f'){
      positionspossibles[map(x_front,y_front)] = 's';
      
      
      strip.SetPixelColor(map(x_front,y_front), RgbColor(0,0,0));
      color_that_case(x_front,y_front,255,0,0);
      
      
      nouveauFruit();
      
      if (compteur > 100){
        compteur= compteur -10;
      }
    }
    else if(positionspossibles[map(x_front,y_front)] == 's'){
      end_snake();
      gameRunning = false;
    }

    else{
      color_that_case(x_back,y_back,0,0,0);
      positionspossibles[map(x_back,y_back)] = 'r';
      color_that_case(x_front,y_front,100,50,0);
      free(snakeUtil.back());
      snakeUtil.pop_back();
      color_that_case(x_front,y_front,255,0,0);
      positionspossibles[map(x_front,y_front)] = 's';
      }
    
      
}

void deplacer()
{
  updateBluetoothCommands();
  
  if(commands[0] == true && directionSnake != 1){
    lastSnakeMoveTime = millis();
    directionSnake = 0;
    gameSnakeIntro = false;
  }
  
  else if(commands[1] == true && directionSnake != 0){
    lastSnakeMoveTime = millis();
    directionSnake = 1;
    gameSnakeIntro = false;
  }
  
  else if(commands[2] == true && directionSnake != 2){
    lastSnakeMoveTime = millis();
    directionSnake = 3;
    gameSnakeIntro = false;
  }
  
  else if(commands[3] == true && directionSnake != 3) {
    lastSnakeMoveTime = millis();
    directionSnake = 2;
    gameSnakeIntro = false;
  }
  
  decaler(directionSnake);

}


void setupSnake()  
{  
  isGame = true;
  positionspossibles = (char*)malloc(NUM_PIXELS);
  compteur = 500;
  gameRunning = true;
  gameSnakeIntro = true;
  
  for (int i=0;i<NUM_PIXELS;i++)
  {
    strip.SetPixelColor(i,RgbColor(0,0,0));
  }
  for(int i = 0; i < NUM_PIXELS; i++){
    positionspossibles[i] = 'r';
  }
  
  positionspossibles[map(HAUTEUR/2,5)] = 'f';
  strip.SetPixelColor(map(HAUTEUR/2,5), RgbColor(0,255,0));

  lastSnakeMoveTime = millis();
  lastSnakeFakeMoveTime = millis();
  directionSnake = 2;
  Position* p1 = new Position(HAUTEUR/2-2,LARGEUR/2-1);
  Position* p2 = new Position(HAUTEUR/2-1,LARGEUR/2-1);
  Position* p3 = new Position(HAUTEUR/2,LARGEUR/2-1);
  
  snakeUtil.push_front(p1);
  snakeUtil.front()->draw();
  snakeUtil.push_front(p2);
  color_that_case(snakeUtil.front()->getX(),snakeUtil.front()->getY(),100,50,0);
  snakeUtil.push_front(p3);
  color_that_case(snakeUtil.front()->getX(),snakeUtil.front()->getY(),100,50,0);
  positionspossibles[map(p1->getX(),p1->getY())] = 's';
  
  positionspossibles[map(p2->getX(),p2->getY())] = 's';
  positionspossibles[map(p3->getX(),p3->getY())] = 's';

  
}

void destroySnake()
{
  

  while(snakeUtil.size() > 0)
  {
    free(snakeUtil.back());
    snakeUtil.pop_back();
  }
  lastSnakeMoveTime = 0;
  compteur =0;
  
  free(positionspossibles);
  isGame = false;

}


void loopSnake()  
{  
    if(millis() - lastSnakeMoveTime > 30000) {
      // No user command for 30sec, timeout
      gameRunning = false;
      return;
    }
    else if(gameSnakeIntro && millis() - lastSnakeFakeMoveTime > 3000){
      // Introduction mode, moving randomly every 3sec
      switch(directionSnake) {
        case 0: directionSnake = 2; break;
        case 2: directionSnake = 1; break;
        case 1: directionSnake = 3; break;
        case 3: directionSnake = 0; break;
      }
      lastSnakeFakeMoveTime = millis();
   }
   deplacer();
   strip.Show();
   delay(compteur);
}   


/***************************************************************** ENTRY POINT *******************************************************/

void setup() {
  strip.Begin();
  strip.Show();
  randomSeed(analogRead(0));
  


#if DEBUG_SERIAL
  while(!Serial);
  Serial.begin(9600);
  Serial.println("Booting");
  Serial.print("Nombre d'utilisateurs: ");
  Serial.println(read_int_EEPROM(0));
#endif
  //setupBluetooth();
  setupAnimation(0);
}

void setupAnimation(int animation) {
#if DEBUG_SERIAL
  Serial.print("Setting up animation ");
  Serial.println(animation);
  Serial.print("Walltime = ");
  Serial.println(millis());
#endif
  FlushBluetooth();
  switch(animation) {
    case 3:
      setupSnake();
      break;
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
    case 3:
      loopSnake();
      break;
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
    case 3:
      destroySnake();
      break;
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
  #if DEBUG_SERIAL
  Serial.print("Nombre d'utilisateurs: ");
  Serial.println(read_int_EEPROM(0));
  #endif
}

void loop() {
  if(millis() > 4300000UL) {
    // In case program runs more than 50 days, which is very unlikely...
    // ... millis() function will overflow
    // ... Reboot by triggering the watchdog manually
    fadeOut();
    //wdt_enable(WDTO_15MS);
    while(1);
  }

  // Check LIVE Control first
  // During live control, the sequenced animation is not destroyed
  //Serial.write("Hello");

  if(isLiveControl && millis() > lastLiveFrameReceived + LIVE_TIMEOUT_MS) {
    // Leaving LIVE Control mode
    #if DEBUG_SERIAL
    Serial.println("Live control timeout, switching back to default animations");
    #endif
    isLiveControl = false;
    last_animation_switch = 0; // Force animation switch
    isGame = false;
  }
  else if(Serial.available() > 0) {
    firstByte = Serial.read();
    if((char)firstByte == 'A'){
      if(!isLiveControl) {
      // Entering LIVE Control mode
      #if DEBUG_SERIAL
      Serial.println("Received Live Control request...");
      #endif
      fadeOut();
      #if DEBUG_SERIAL
      Serial.println("Switching mode to LIVE now");
      #endif
      }
      readCommand();
      isLiveControl = true;
      lastLiveFrameReceived = millis();
    }
  }

  // Regular animation management
  if(!isLiveControl) {
    // Is the current animation a game?
    if(isGame == false) {
      // If not, switch to next animation when DURATION_ANIMATION secs have passed
      if(millis() > last_animation_switch + DURATION_ANIMATION_MS) {
        initiateAnimationSwitch();
        current_animation = (current_animation + 1)%NUM_ANIMATIONS;
        setupAnimation(current_animation);
      }
      // If not, any button pressed meanwhile a non-game animation will drop the user to a game
      else if(AnyButtonPressed()) {
        initiateAnimationSwitch();
        // Drop them to some game
        current_animation = 2;
        setupAnimation(current_animation);
      }
    }
    // The current animation is a game
    else {
      // If game is over, switch to next animation
      if(gameRunning == false) {
        initiateAnimationSwitch();
        current_animation = (current_animation + 1)%NUM_ANIMATIONS;
        setupAnimation(current_animation);
      }
      // "Next" button will switch to next animation 
      else if(NextGameButtonPressed()) {
        initiateAnimationSwitch();
        current_animation = (current_animation + 1)%NUM_ANIMATIONS;
        setupAnimation(current_animation);
      }
      // "Reset" button will re-initialize the current animation
      else if(ResetButtonPressed()) {
        initiateAnimationSwitch();
        setupAnimation(current_animation);
      }
    }
    
    // Run actual animation loop if any
    resetBluetoothCommands();
    updateBluetoothCommands();
    loopAnimation(current_animation);
    }
}
