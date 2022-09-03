const path = require("path");

const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const rpc = require('discord-rich-presence')('1010070024997851137')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

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
        window.loadFile(path.join(__dirname, '../dist', 'index.html'));
    }
}

// Set application name
app.setName("Swesence")

app.whenReady()
    .then(() => {
        // IPC Handlers
        ipcMain.handle('loadDatabase', async () => {
            const pathToDatabase = path.join(__dirname, '../public', 'games.json')
            const raw = fs.readFileSync(pathToDatabase)

            return JSON.parse(raw.toString())
        })

        ipcMain.handle('updatePresence', async (event, args) => {
            rpc.updatePresence({
                details: args.game,
                state: args.activity,
                startTimestamp: Date.now(),
                largeImageKey: args.image
            })

            return { success: true }
        });

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