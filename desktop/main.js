// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')

let path = require('path');

require('electron-reload')(__dirname);
let ipParser = require('ip6addr');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Create the express server
let express = require('express');
let expressServer = express();
let http = require('http').Server(expressServer);
let port = 3000;
let io = require('socket.io')(http);

let clientsLogged = new Map();

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 400,
    height: 400,
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
  expressServer.use(express.static('public'));
  expressServer.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
  expressServer.use('/rgbconverter', express.static( __dirname + '/node_modules/rgb-hex-converter'));

  // Start the express server
  http.listen(port, function () {
    console.log('Server listening on ' + port);
  });
}

function initSocket() {
  // Define the events to listen on a new socket
  io.on('connection', function (socket) {

    // When the user logs in
    socket.on('login', function (login) {
      if (!clientsLogged.has(socket.handshake.session.id)) {
        clientsLogged.set(socket.handshake.session.id, {
          socket: socket,
          id: socket.handshake.session.id,
          login: login,
          ip: getIPV4(socket.handshake.address)
        });
        mainWindow.webContents.send('addUser', clientsLogged.get(socket.handshake.session.id));
      }
    });

    // When the user logs out
    socket.on('logout', function () {
      console.log('destroy user');
      mainWindow.webContents.send('removeUser', socket.handshake.session.id);
      clientsLogged.delete(socket.handshake.session.id);

    })
  });
}

function initEvents() {
  ipcMain.on('grantUser', function (event, arg) {

    clientsLogged.get(arg).socket.emit('granted');
    clientsLogged.get(arg).socket.broadcast.emit('ungranted');
  });

  ipcMain.on('ungrantUser', function(event,arg){
    clientsLogged.get(arg).socket.emit('ungranted');
  })

  ipcMain.on('disconnectUser', function(event,arg){
    clientsLogged.get(arg).socket.emit('disconnectUser');
    console.log(clientsLogged)
    clientsLogged.delete(arg)
    console.log(clientsLogged)
  })
}

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
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function getIPV4(ip) {
  if (ip == '::1') {
    return '127.0.0.1';
  } else {
    return ipParser.parse(ip).toString({
      format: 'v4'
    });
  }
}