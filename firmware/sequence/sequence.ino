#include <avr/wdt.h>
#include <EEPROM.h>
#include "Adafruit_NeoPixel.h"
#include "SPI.h"
#include <Ethernet.h>
#include <EthernetUdp.h>
#include <StandardCplusplus.h>
#include <list>

#define DEBUG_SERIAL 1      
#define PROTOCOL_VERSION 2  // Protocol version over UDP
#define NUM_PIXELS 150

Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_PIXELS, 23);

const unsigned long DURATION_ANIMATION_MS = 120000UL;
const unsigned long LIVE_TIMEOUT_MS = 5000UL;
int NUM_ANIMATIONS = 4;

unsigned long last_animation_switch = 0;
unsigned long lastKeyPressed = millis();
unsigned long lastLiveFrameReceived = 0;
int current_animation = 0;
boolean isGame = false;
boolean isLiveControl = false;
char sens_tableau = '3';


/*********************************************************************** ETHERNET *************************************************************/

#define UDP_DGRAM_SIZE 470        // Lower than 508 https://stackoverflow.com/questions/14993000/the-most-reliable-and-efficient-udp-packet-size
#define NUM_PIXELS_PER_DGRAM 150  // Sending 150*(r, g, b) = 450 Bytes in each datagram
#define PROTOCOL_RECEIVE_FRAME 'F'
#define PROTOCOL_SEND_DISCOVERY 'H'

byte mac[] = {0xDE, 0xAD, 0xBE, 0x0, 0x33, 0x47};
IPAddress ip(192, 168, 1, 50);
unsigned int localPort = 33407;

byte packetBuffer[UDP_DGRAM_SIZE];
byte liveR, liveG, liveB, subFrameId;
EthernetUDP Udp;

int readUDPFrame() {
  int packetSize = Udp.parsePacket();
  if (packetSize) {
    Udp.read(packetBuffer, UDP_DGRAM_SIZE);

    const byte HEADER_SIZE = 6;
    byte header[HEADER_SIZE] = {'A', 'R', 'B', 'A', (char)PROTOCOL_VERSION, (char)PROTOCOL_RECEIVE_FRAME};
    for (int i = 0; i < HEADER_SIZE; ++i) {
      if(header[i] != packetBuffer[i]) {
        #if DEBUG_SERIAL
        Serial.println("Ignoring LIVE pixel: Incorrect header or protocol version");
        #endif
        return 0;
      }
    }
    
    if(isLiveControl) { // No need to parse the rest of the datagram if we're not in live mode
      byte packet_index = HEADER_SIZE;
      subFrameId = packetBuffer[packet_index++];
      int offset = subFrameId == 0? 0:NUM_PIXELS_PER_DGRAM;
  
      for (int i = 0; i < NUM_PIXELS_PER_DGRAM; ++i) {
        liveR = packetBuffer[packet_index++];
        liveG = packetBuffer[packet_index++];
        liveB = packetBuffer[packet_index++];
        strip.setPixelColor(i + offset, liveR, liveG, liveB);
        #if DEBUG_SERIAL
          //Serial.print(i + offset); Serial.print(" ");
          //Serial.print(liveR); Serial.print(" ");
          //Serial.print(liveG); Serial.print(" ");
          //Serial.println(liveB);
        #endif
      }
      if(subFrameId > 0) strip.show();
    }
  }
  return packetSize;
}

void setupEthernet() {
  Ethernet.begin(mac, ip);
  Udp.begin(localPort);
}

/***************************************************************** CONVERSION TOOLS *******************************************************/

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
    for (int i = 0; i < strip.numPixels(); i++)
    {
      strip.setPixelColor(i, hueToRGB(hue[i], 1.0, value/100.0)); 
    }
  
    strip.show();
    delay(10);
  }
}

void setupRoueDesCouleurs()  {
    hue = (float*)malloc(NUM_PIXELS*sizeof(float));
    
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

/******************************* Tetris ****************************/
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
    strip.setPixelColor(calculer(ligne,colonne), r, g, b);
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
        strip.setPixelColor(i, 0, 255, 0);
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
      strip.setPixelColor(i, 0, 0, 0);
      strip.show();
    }
  }
  
}
void tourner_rouge(){
  for(int j = 0; j < NUM_PIXELS; j++){
    if(positionspossibles[j] == 's'){
      strip.setPixelColor(j, 255, 25, 0);
      strip.show();
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
    
    
    if(positionspossibles[calculer(x_front,y_front)] == 'f'){
      positionspossibles[calculer(x_front,y_front)] = 's';
      
      
      
      
      strip.setPixelColor(calculer(x_front,y_front), 0, 0, 0);
      color_that_case(x_front,y_front,255,0,0);
      
      
      nouveauFruit();
      
      if (compteur > 100){
        compteur= compteur -10;
      }
    }
    else if(positionspossibles[calculer(x_front,y_front)] == 's'){
      end_snake();
      gameRunning = false;
    }

    else{
      color_that_case(x_back,y_back,0,0,0);
      positionspossibles[calculer(x_back,y_back)] = 'r';
      color_that_case(x_front,y_front,100,50,0);
      free(snakeUtil.back());
      snakeUtil.pop_back();
      color_that_case(x_front,y_front,255,0,0);
      positionspossibles[calculer(x_front,y_front)] = 's';
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
    strip.setPixelColor(i,0,0,0);
  }
  for(int i = 0; i < NUM_PIXELS; i++){
    positionspossibles[i] = 'r';
  }
  
  positionspossibles[calculer(HAUTEUR/2,5)] = 'f';
  strip.setPixelColor(calculer(HAUTEUR/2,5), 0, 255, 0);

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
  positionspossibles[calculer(p1->getX(),p1->getY())] = 's';
  
  positionspossibles[calculer(p2->getX(),p2->getY())] = 's';
  positionspossibles[calculer(p3->getX(),p3->getY())] = 's';

  
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
    else if(gameSnakeIntro && millis() - lastSnakeFakeMoveTime > 3000) {
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
   strip.show();  
   delay(compteur);
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
  Serial.print("Nombre d'utilisateurs: ");
  Serial.println(read_int_EEPROM(0));
#endif
  setupBluetooth();
  setupEthernet();
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
    wdt_enable(WDTO_15MS);
    while(1);
  }

  // Check LIVE Control first
  // During live control, the sequenced animation is not destroyed
  int udp_frame_size = readUDPFrame();

  if(isLiveControl && millis() > lastLiveFrameReceived + LIVE_TIMEOUT_MS) {
    // Leaving LIVE Control mode
    #if DEBUG_SERIAL
    Serial.println("Live control timeout, switching back to default animations");
    #endif
    isLiveControl = false;
    last_animation_switch = 0; // Force animation switch
    isGame = false;
  }
  else if(udp_frame_size > 0) {
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
    isLiveControl = true;
    lastLiveFrameReceived = millis();
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
