# Firmware (Sequence)

An extension of the initial project [Arbalet Lava](https://github.com/arbalet-project/arbadoc/wiki). This project aims to replace the pair (Arduino + Raspberry pi) by an ESP32, tested on a ESP-32S (NodeMCU).

## Libraries

Install these libs in your `$HOME/Arduino/libraries` or $HOME/sketchbook/libraries
```
https://github.com/Makuna/NeoPixelBus
```

## The purpose

The purpose of this firmware is to implement several interactions on the table Arbalet Lava (equipped with an ESP32 instead of the combination Arduino + Raspberry pi) from a computer connected via the serial port.

## How it works

Using the Arduino IDE application, upload sequence.Ino to an ESP32, by the USB port and install it on the table.

## What works

USB Serial :
	- update : stable
	- handshake : not tested

Receipt of the data by ESP32 on the Serial port is as follows:
	- first 4 letters (ARBA ) that allow to check that we have the beginning of the frame
	- a version number of the software
	- a capital letter indicating the command
	- and a series of numbers that correspond to the R(0 to 255) G(0 to 255) B(0 to 255) of each pixel

example : {A,R,B,A,1,U,52,68,9,87,116,53,3,46,218,98,76,5,43,3,45,6,78,98,76,67,89,...,213}

CONVERSION TOOLS :
fadeOut() : stable
map() : to improve

fadeout() has been modified to match the new library ( NeoPixelBus ).
map() has been modified to introduce the rows and cols variables.

EEPROM : not tested

COLOR WHEEL : stable and adapted to the new library.

Lineaire : stable and adapted to the new library.

Bluetooth : not tested and not adapted for the ESP32.

Tetris : to be improved because the display is bad.

Snake : to be improved because the display is bad.

## Problems

Electrical on the test table slowed down the project and some functionality could not be tested and improved as a result.



