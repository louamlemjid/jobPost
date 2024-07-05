import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { client } from './dbClient'
import mysql from 'mysql'
const fs = require('fs');
const pg = require('pg');
const url = require('url');

function dateToString(date){
  return `${date.getDate()}-${date.getMonth()}-${date.getYear()}`
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    icon:join(__dirname,"../../resources/cat.jpeg"),
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  
    //::::::::::::::::::
    
    //§:::::::::::::::::::
  
    
    // IPC handler for 'add-poste' event
  ipcMain.on('add-poste', (event, data) => {
    const { company, poste, coverLetter } = data;

    client.query('INSERT INTO companies (name, poste, coverletter,posteDate) VALUES ($1, $2, $3,$4) RETURNING *;'
      , [company, poste, coverLetter,new Date()])
      .then(result => {
        console.log('Inserted:', result.rows[0]);
        // Optionally, send a response back to the renderer process
        // event.sender.send('poste-added', result.rows[0]);
      })
      .catch(err => {
        console.error('Error inserting:', err.stack);
        // Optionally, send an error response back to the renderer process
        // event.sender.send('poste-add-error', err.message);
      });
  });

  // IPC handler for 'jobs' event
  ipcMain.on('jobs', (event, data) => {
    // Example of handling jobs request
    const company2Pattern = `%${data.company2}%`;
    const poste2Pattern = `%${data.poste2}%`;
    // Replace with your actual database query logic using dbClient
    client.query('SELECT * FROM companies WHERE name LIKE $1 AND poste LIKE $2;',
    [company2Pattern, poste2Pattern],)
      .then(result => {
        console.log('Fetched jobs:', result.rows);
        // Send the result back to the renderer process
        event.sender.send('jobs', result.rows);
      })
      .catch(err => {
        console.error('Error fetching jobs:', err.stack);
        // Optionally, send an error response back to the renderer process
        // event.sender.send('jobs-error', err.message);
      });
  });


    
    ipcMain.on('update-poste', (event, data) => {
      console.log('Updating:', data);
      // Implement update logic using client.query() as shown above
    });
    
    ipcMain.on('delete-poste', (event, jobPosteId) => {
      console.log('Deleting:', jobPosteId);
      // Implement delete logic using client.query() as shown above
    });
    
      
    createWindow()
})
  
    
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
