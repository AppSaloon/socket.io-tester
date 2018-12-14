const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

const createMenu = require('./menu')
const checkVersion = require('./checkVersion')

let win

function createWindow () {
    win = new BrowserWindow({
        width: 1000,
        height: 620,
        minWidth: 1000,
        minHeight: 620
    })

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    win.on('closed', () => {
        win = null
    })

    if ( process.env.NODE_ENV === 'development' )
        win.webContents.openDevTools()

    win.webContents.once('did-finish-load', () => {
        win.isReady = true
    })
}

app.on('ready', () => {
    createWindow()
    createMenu()
    checkVersion(win)
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})
