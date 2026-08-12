import { app, BrowserWindow } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 400,
    minHeight: 600,
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