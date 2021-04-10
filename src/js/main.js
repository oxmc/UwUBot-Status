const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const notifier = require('node-notifier');
const url = require('url');
const path = require('path');

var appdir = path.join(__dirname, '/src')
var icondir = appdir + "/icons"

let mainWindow;
function updateavil() {
notifier.notify ({
               title: 'Update availible',
               message: 'There is a new version of this app availible, click here to update.',
               icon: icondir + "update.png"
               sound: true,  // Only Notification Center or Windows Toasters
               wait: true    // Wait with callback, until user action is taken 
               against notification
            
            }, function (err, response) {
               // Response is response from notification
            });

            notifier.on('click', function (notifierObject, options) {
               console.log("User clicked on the notification, updating app.")
            });

            notifier.on('timeout', function (notifierObject, options) {
               console.log("Notification timed out!")
            });
}
let trayIcon = new Tray()

         const trayMenuTemplate = [
            {
               label: 'UwUBot Status',
               enabled: false
            },
            
            {
               label: 'Settings',
               click: function () {
                  console.log("Clicked on settings")
               }
            },
            
            {
               label: 'Help',
               click: function () {
                  console.log("Clicked on Help")
               }
            }
         ]
         
         let trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
         trayIcon.setContextMenu(trayMenu)

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile('./src/view/index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});
