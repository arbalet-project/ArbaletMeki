// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')

let path = require('path');

//require('electron-reload')(__dirname);
let ipParser = require('ip6addr');
let mainWindow;
let express = require('express');
let expressServer = express();
let http = require('http').Server(expressServer);
let port = 3000;
let io = require('socket.io')(http);

let clientsLogged = new Map();
let grantedUser;


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
  expressServer.use('/rgbconverter', express.static( __dirname + '/node_modules/rgb-hex-converter'));

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

    // When the user logs out
    socket.on('logout', function () {
      console.log('destroy user');
      mainWindow.webContents.send('removeUser', socket.handshake.session.id);
      clientsLogged.delete(socket.handshake.session.id);

    })
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
  })

}


/**
 * Format the given ip adress to the ipv4 format
 * @param {Object} ip 
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