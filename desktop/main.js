// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow
} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Create the express server
let expressServer = require('express')();
let http = require('http').Server(expressServer);
let port = 3000;
let io = require('socket.io')(http);

let clientsLogged= new Map();

// Init the session system
let session = require('express-session')({
  secret:'my-secret',
  resave: true,
  saveUninitialized: true
});

let sharedsession = require('express-socket.io-session');
expressServer.use(session);
io.use(sharedsession(session,{
  autoSave: true
}));



function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })

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
  // Routes
  expressServer.get('/', function (req, res) {
    res.sendFile(__dirname + '/clientPages/index.html');
  });

  // Start the express server
  http.listen(port, function () {
    console.log('Server listening on ' + port);
  });
}

function initSocket() {
  io.on('connection', function (socket) {
    console.log('new user connected: ' + socket.handshake.session.id);

    socket.on('login',function(login){
      clientsLogged.set(socket.handshake.session.id,{
        login: login,
        ip: socket.handshake.address
      });
      console.log(clientsLogged);
    });

    socket.on('logout',function(){
      console.log('destroy user');
      clientsLogged.delete(socket.handshake.session.id);
      console.log(clientsLogged);
    })

    socket.on('disconnect',function(reason){
      console.log(reason);
    });
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  createWindow();
  initServer();
  initSocket();
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