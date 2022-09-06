const path = require("path");
const url = require("url");

const { app, BrowserWindow, ipcMain, shell } = require("electron");
const fs = require("fs");
const rpc = require('discord-rich-presence')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

// Get path to Game Database
const pathToDatabase = path.join(__dirname, '../public', 'games.json')
const pathToSettings = path.join(__dirname, '../public', 'config.json')

const isDev = process.env.IS_DEV === 'true'

// Best Practice
let window;

function createWindow() {
    window = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true, // Hide toolbar
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    if (isDev) {
        // Load Vite dev server
        window.loadURL('http://localhost:3000')
        window.webContents.openDevTools()
    } else {
        // Load production build
        // TODO: Use a different format method
        window.loadURL(url.format({
          pathname: path.join(__dirname, '../dist', 'index.html'),
          protocol: 'file:',
          slashes: true
        }))
    }

    // Listen for new-window event
    window.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' }
    })
}

// Set application name
app.setName("Swesence")

app.whenReady()
    .then(() => {
        // IPC Handlers
        ipcMain.handle('loadDatabase', async () => {
            const raw = fs.readFileSync(pathToDatabase)

            return JSON.parse(raw.toString())
        })

        ipcMain.handle('updateDatabase', async (event, args) => {
            try {
                fs.writeFileSync(pathToDatabase, JSON.stringify(args, null, 2), 'utf8')

                return { success: true }
            } catch (error) {
                console.log("An error occurred while updating the game database: " + error);

                return { success: false }
            }
        })

        ipcMain.handle('updatePresence', async (event, args) => {
            const settingsFile = fs.readFileSync(pathToSettings)
            const settings = JSON.parse(settingsFile.toString())

            rpc(settings.applicationId).updatePresence({
                details: args.game,
                state: args.activity,
                startTimestamp: Date.now(),
                largeImageKey: args.image
            })

            return { success: true }
        });

        ipcMain.handle('fetchSettings', async () => {
            const pathToSettings = path.join(__dirname, '../public', 'config.json')
            const raw = fs.readFileSync(pathToSettings)

            return JSON.parse(raw.toString())
        })

        ipcMain.handle('updateSettings', async (event, args) => {
            try {
                fs.writeFileSync(pathToSettings, JSON.stringify(args, null, 2), 'utf8')

                return { success: true }
            } catch (error) {
                console.log("An error occurred while updating your settings: " + error);

                return { success: false }
            }
        })

        // Create Windows
        createWindow();

        app.on('activate', () => {
            // macOS specific
            // Windows on macOS are handled differently, this recreates windows when needed
            if (BrowserWindow.getAllWindows().length === 0) createWindow();
        })
    })

// Quitting the app when no windows are open on non-macOS platforms
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})