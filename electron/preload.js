const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    'updatePresence': (data) => { ipcRenderer.invoke('updatePresence', data) },
    'send': async (channel, data) => {
        // Whitelist channels
        const validChannels = ['loadDatabase', 'updatePresence']

        if (validChannels.includes(channel)) {
            return await ipcRenderer.invoke(channel, data)
        }
    },
    'receive': (channel, func) => {

    }
})