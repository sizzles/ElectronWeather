'use strict';
const app = require('app')	// Module to control application life.
const BrowserWindow = require('browser-window')	// Module to create native browser window.

// report crashes to the Electron project
//require('crash-reporter').start()

// adds debug features like hotkeys for triggering dev tools and reload
//require('electron-debug')()

// prevent window being garbage collected
let mainWindow

function onClosed() {
	// Dereference the window object, usually you would store windows
	// in an array if your app supports multi windows, this is the time
	// when you should delete the corresponding element.
	mainWindow = null
}

function createMainWindow() {
	// Create the browser window.
	const win = new BrowserWindow({
		width: 680,
		height: 389,
		'min-width': 500,
		'min-height': 200,
		'accept-first-mouse': true,
		'title-bar-style': 'hidden'
	})

	// and load the index.html of the app.
	win.loadUrl(`file://${__dirname}/index.html`)

	// Open the DevTools.
	//mainWindow.openDevTools()

	// Emitted when the window is closed.
	win.on('closed', onClosed)

	return win
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
});

app.on('activate-with-no-open-windows', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow()
	}
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {
	mainWindow = createMainWindow()
})
