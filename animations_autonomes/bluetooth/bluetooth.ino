
void setup() 
{
    Serial.begin(9600); // Warning: this is USB, not Bluetooth
    Serial.setTimeout(-1);
    Serial1.begin(115200);  // or 9600 if not configured
    Serial1.setTimeout(500);
    Serial.println("Serial1 started! Type commands...");
}

/*

AT+PIN1234
AT+NAMEARBALET_ST_JEAN
AT+BAUD8

*/

void loop()
{
  if (Serial1.available())
    Serial.write(Serial1.read());
  
  if (Serial.available())
    Serial1.write(Serial.read());
    
}
