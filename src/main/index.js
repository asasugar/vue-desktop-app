import {
  app,
  BrowserWindow,
  ipcMain
} from 'electron'
const startOnBoot = require('./startOnBoot.js')

// if (require('electron-squirrel-startup')) return;
const exeName = 'vue-desktop-app'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    // kiosk: true, // kiosk模式
    // closable: false, // 不可关闭
    // frame: false, // 设置无边框
    webPreferences: {
      devTools: true // 是否F12开启调试模式
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  // 尝试更新
  updateHandle()
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */


import {
  autoUpdater
} from 'electron-updater'

const uploadUrl = "http://img3.oteao.com/download/"

// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
function updateHandle() {
  let message = {
    error: '检查更新出错',
    checking: '正在检查更新……',
    updateAva: '检测到新版本，正在下载……',
    updateNotAva: '现在使用的就是最新版本，不用更新',
  };
  const os = require('os');

  autoUpdater.setFeedURL(uploadUrl);
  autoUpdater.on('error', function (error) {
    sendUpdateMessage(message.error)
  });
  autoUpdater.on('checking-for-update', function () {
    sendUpdateMessage(message.checking)
  });
  autoUpdater.on('update-available', function (info) {
    sendUpdateMessage(message.updateAva)
  });
  autoUpdater.on('update-not-available', function (info) {
    sendUpdateMessage(message.updateNotAva)
  });

  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    mainWindow.webContents.send('downloadProgress', progressObj)
  })
  autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {

    ipcMain.on('isUpdateNow', (e, arg) => {
      console.log(arguments);
      console.log("开始更新");
      //some code here to handle event
      autoUpdater.quitAndInstall();
    });

    mainWindow.webContents.send('isUpdateNow')
  });

  ipcMain.on("checkForUpdate", () => {
    //执行自动更新检查
    autoUpdater.checkForUpdates();
  })
}

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
  mainWindow.webContents.send('message', text)
}


// 开机自动启动
// startOnBoot.enableAutoStart(exeName, process.execPath)