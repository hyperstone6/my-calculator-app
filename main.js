const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

let win;

function createWindow() {
  
  //Create browser window

  win = new BrowserWindow({
    width: 800,
    height: 500,
    icon: __dirname + "/favicon.ico",
    autoHideMenuBar: true,
    resizable: false
  });
  
  win.webContents.openDevTools()

  //Load index.html

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file",
      slashes: true,
    })
  );

  win.on("closed", () => {
    win = null;
  });
}

app.on("ready", createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})