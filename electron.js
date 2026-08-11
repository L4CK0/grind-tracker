const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 400,
    minHeight: 600,
    icon: path.join(__dirname, 'public', 'logo.png'),
    title: 'GRIND',
    backgroundColor: '#09090b',
    webPreferences: {
      nodeIntegration: false
    }
  })
  win.loadFile(path.join(__dirname, 'dist', 'index.html'))
  win.setMenu(null)
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => app.quit())