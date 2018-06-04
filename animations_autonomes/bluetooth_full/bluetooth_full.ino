/******************* Lecture/écriture EEPROM ******************/

#include <EEPROM.h>

void write_int_EEPROM(int addr, unsigned long value) {
  byte b[4];
  memcpy(b, &value, sizeof value);
  for(int i=0; i<4; ++i) EEPROM.write(i+addr, b[i]);
}

void setup() 
{
    // HC-06 default is 9600 bauds, switch to 115200 at first init 

    Serial.println("Overwriting EEPROM address 0 to 0...");
    write_int_EEPROM(0, 0);
    
    Serial.begin(9600); // Warning: this is USB, not Bluetooth
    Serial1.begin(9600);  // 115200L or 9600L
    
    Serial.println("Starting HC-06 config!");
    Serial.println("Setting PIN 1234...");
    Serial1.print("AT+PIN1234");
    delay(200);
    Serial.println(Serial1.readString());
    delay(200);
    Serial.println("Setting NAME...");
    Serial1.print("AT+NAMEARBALET_SAINT_JEAN");
    delay(200);
    Serial.println(Serial1.readString());
    delay(200);
    Serial.println("Setting BAUDRATE to 8...");
    Serial1.print("AT+BAUD8");
    delay(200);
    Serial.println(Serial1.readString());
    delay(200);
    
    Serial1.begin(115200L);
    Serial.println("You can type AT commands...");

}

void loop()
{
  if (Serial1.available())
    Serial.write(Serial1.read());
  
  if (Serial.available())
    Serial1.write(Serial.read());
}
