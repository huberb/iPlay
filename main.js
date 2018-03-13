const {app, BrowserWindow, ipcMain, Tray, nativeImage} = require('electron')
const path = require('path')

const assetsDir = path.join(__dirname, 'assets')

let tray = undefined
let window = undefined

// This method is called once Electron is ready to run our code
// It is effectively the main method of our Electron app
app.on('ready', () => {
  // Setup the menubar with an icon
  let icon = nativeImage.createFromDataURL(base64Icon)
  tray = new Tray(icon)

  // Add a click handler so that when the user clicks on the menubar icon, it shows
  // our popup window
  tray.on('click', function(event) {
    toggleWindow();

    // Show devtools when command clicked
    if (window.isVisible() && process.defaultApp && event.metaKey) {
      window.openDevTools({mode: 'detach'})
    }
  })


  // Make the popup window for the menubar
  window = new BrowserWindow({
    width: 420,
    height: 315,
    show: false,
    frame: false,
    resizable: false,
    alwaysOnTop: true
  })
  window.setSkipTaskbar(true);
  window.setVisibleOnAllWorkspaces(true);

  // Tell the popup window to load our index.html file
  window.loadURL(`file://${path.join(__dirname, 'index.html')}`)

  // Only close the window on blur if dev tools isn't opened
  /*
  window.on('blur', () => {
    if(!window.webContents.isDevToolsOpened()) {
      window.hide()
    }
  })
  */
  showWindow();
})

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide()
  } else {
    showWindow()
  }
}

const showWindow = () => {
  const trayPos = tray.getBounds()
  const windowPos = window.getBounds()
  let x, y = 0
  if (process.platform == 'darwin') {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
    y = Math.round(trayPos.y + trayPos.height)
  } else {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
    y = Math.round(trayPos.y + trayPos.height * 10)
  }


  window.setPosition(x, y, false)
  window.show()
  window.focus()
}

ipcMain.on('show-window', () => {
  showWindow()
})

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.dock.hide()

// Tray Icon as Base64 so tutorial has less overhead
let base64Icon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABcUlEQVQ4T2M8IyH3n4ECwDh4DBBwd2UQCg5kYBEQYGDi4mJgZGVhYGBmhnju71+G/7//MPz79o3hz/v3DG/XrGP4uHsvWArsBVZxMQbdM8cZGFlYiAqNv79+MRzQM2EQ+PgRYgC/mwuDysK5KJo/3n/AwK+ogNPADaERDOwHj0AMEA4PZVCY0IOieG9+EcPHhw8ZHDrbGITU1TEM2pmexXBj9RqIAaKx0QxyXW0YBlxZvISBiZWVwSAtlcG8vISBjYcHrmZPXiHD1SVLCRvAzM7GYJybw2BaVMDAwsGB3QBcXvj89CmDQ2c7g4CyEn4vYAvET48eM/DJyeIOxJBwhof79kOjUUyUQefMcbB/iQF/f/5imKOty/Dj3XuIASBN/+1sGLgD/Bg4hIUYWDk5GZjZ2RkYWZgZGP4zMPz/+5fh78+fDL+/f2f4+eEjw/UVKxkeHTiISEgwW1/9/ctw688vYhwBV4ORmUg1BGtuJMUQAAIxpg2U2DAVAAAAAElFTkSuQmCC`