const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

let win

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadFile('index.html')

    win.webContents.openDevTools()

    win.on('closed', () => {
        win = null
    })

    win.on('resize', (e) => {
        let [width, height] = win.getContentSize()
    })
}

app.on('ready', createWindow)

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