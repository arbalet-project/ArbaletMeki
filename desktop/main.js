// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron');

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const path = require('path');
const ipParser = require('ip6addr');
const express = require('express');
const expressServer = express();
const http = require('http').Server(expressServer);
const port = 3000;
const io = require('socket.io')(http);
const ReadWriteLock = require('rwlock');

let mainWindow;
let clientsLogged = new Map();
let grantedUser;
let boardConnected = false;

var serialport = null;
var lock = new ReadWriteLock();

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  createWindow();
  initServer();
  initSocket();
  initEvents();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});

/**
 * Create the main window
 */
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 1000,
    minHeight: 700,
    icon: path.join(__dirname, '/asset/images/logo.png')
  })
  mainWindow.maximize() // Window Fullscreen

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

/**
 * Launch the Express Server and listen on the specified port
 * The different routes are defined in this function
 */
function initServer() {

  // Init the session system
  let session = require('express-session')({
    secret: 'my-secret',
    resave: true,
    saveUninitialized: true
  });

  let sharedsession = require('express-socket.io-session');
  expressServer.use(session);
  io.use(sharedsession(session, {
    autoSave: true
  }));
  // Routes
  expressServer.get('/blocklyLanguage',function(req,res){
    if(app.getLocale() == 'fr'){
      res.sendFile(__dirname + '/public/blockly/msg/js/fr.js');
    }
    else {
      res.sendFile(__dirname + '/public/blockly/msg/js/en.js');
    }
  })
  expressServer.use(express.static( __dirname + '/public'));
  expressServer.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));

  // Start the express server
  http.listen(port, function () {
    console.log('Server listening on ' + port);
  });
}

/**
 * Define the behaviour of sockets and the different messages the server can handle
 */
function initSocket() {
  // Define the events to listen on a new socket
  io.on('connection', function (socket) {
    // If the user is already logged in we send him/her the related informations
    if(clientsLogged.has(socket.handshake.session.id)){
      let client = clientsLogged.get(socket.handshake.session.id);
      socket.emit('logged',{name: client.login, ip: client.ip});
      client.socket = socket;
      if(client == grantedUser){
        socket.emit('granted');
      }
    }

    // When the user logs in (enter his/her name)
    socket.on('login', function (login) {
      if (!clientsLogged.has(socket.handshake.session.id)) {
        clientsLogged.set(socket.handshake.session.id, {
          socket: socket,
          id: socket.handshake.session.id,
          login: login,
          ip: getIPV4(socket.handshake.address)
        });
        let client = clientsLogged.get(socket.handshake.session.id);
        socket.emit('logged', {name: client.login, ip: client.ip});
        mainWindow.webContents.send('addUser', clientsLogged.get(socket.handshake.session.id));
      }
    });
    
    socket.on('updateGrid',function(pixelsToUpdate){
      if(serialport !== null && boardConnected && (grantedUser === clientsLogged.get(socket.handshake.session.id))){
        pixelsToUpdate.forEach(function(currentPixel){
          let data = Buffer.allocUnsafe(6);  // Frames are 6 Byte-long e.g. F00RGB
          data.write("F", 0);
          data.writeUInt16LE(coordToIndex(currentPixel), 1);
          var bigint = parseInt(currentPixel.color.substring(1), 16);
          var r = (bigint >> 16) & 255;
          var g = (bigint >> 8) & 255;
          var b = bigint & 255;
          console.log(coordToIndex(currentPixel), currentPixel.color.substring(1), parseInt(currentPixel.color.substring(1), 16), r, g, b);
          data.writeUInt8(r, 3);
          data.writeUInt8(g, 4);
          data.writeUInt8(b, 5);
          lock.writeLock(function (release) {
              serialport.write(data);
              release();
          });
        });
      }
    });
  });
}
/**
 * Define the events messages received by the rendering JS process
 */
function initEvents() {

  ipcMain.on('grantUser', function (event, arg) {
    grantedUser = clientsLogged.get(arg);
    grantedUser.socket.emit('granted');
    grantedUser.socket.broadcast.emit('ungranted');
    
  });

  ipcMain.on('ungrantUser', function(event,arg){
    clientsLogged.get(arg).socket.emit('ungranted');
    grantedUser = '';
  });

  ipcMain.on('connectBoard',function(event,pin){
    initBoard(pin);
  });

}

function sendHeartbeat() {
  if(serialport !== null && boardConnected) {
      let data = Buffer.allocUnsafe(1);  // Frames are 1 Byte-long e.g. L
      data.write("L");
      lock.writeLock(function (release) {
          serialport.write(data);
          release();
      });
   }
}

/**
 * Init the connection with Arduino
 */
function initBoard(stripPin){
  try{
    serialport = new SerialPort("/dev/ttyACM0", {
      baudRate: 57600
    });

    const parser = serialport.pipe(new Readline({ delimiter: '\r\n' }));
    parser.on('data', processSerialInput);

    setInterval(sendHeartbeat, 5000);
    /*board.on("ready", function() {
      strip = new pixel.Strip({
          board: this,
          controller: "FIRMATA",
          strips: [{pin: stripPin, length: 150}]
      });
      boardConnected = true;
      mainWindow.webContents.send('boardReady');
    });
    board.on("fail",function(){
      mainWindow.webContents.send('boardFailed');
    });*/
  }
  catch(e){
    mainWindow.webContents.send('boardFailed'); 
  }
}

/**
 * Process the input serial data
 * @param {String} data 
 */
function processSerialInput(data) {
   boardConnected = true;
   mainWindow.webContents.send('boardReady');
   console.log(data);
}

/**
 * Format the given ip adress to the ipv4 format
 * @param {Object} ip 
 * @returns {String} The formated ip
 */
function getIPV4(ip) {
  if (ip == '::1') {
    return '127.0.0.1';
  } else {
    return ipParser.parse(ip).toString({
      format: 'v4'
    });
  }
}

/**
 * Take the pixel position on grid and returns the pixel index on led strip
 * Works only for a 15*10 grid
 * 
 * @param {Object} pixel The pixel position on grid (row and column)
 * @returns {Number} The corresponding index of the pixel in the LED strip
 */
function coordToIndex(pixel){
  let index;
    // If even
    if(pixel.rowX % 2 == 0){
      index = index = (14-pixel.rowX)*20 + 19 - pixel.columnY; //(15 - pixel.rowX)*20 - pixel.rowX - 1; 
    }
    else {
      index = (14-pixel.rowX)*20 + pixel.columnY;
    }
  
    return index;
  }
