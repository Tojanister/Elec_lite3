//const electron = require('electron');
const {app, BrowserWindow, Menu, ipcMain, globalShortcut} = require('electron');
const url = require('url');
const path = require('path');

let mainWindow;
let addWindow;

//listen on app to be ready
app.on('ready', () => {

    //Ha használatban van egy shortcut GlobalShortcut-tal lehet felülírni
    //globalShortcut.register('Ctrl+A', () => createAddWindow());

    // create new window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    }); 
    //load html into window | mainWindow.loadFile('mainWindow.html')
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    //mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        app.quit();
    })

    //Build menu from tempalte
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert menu
    Menu.setApplicationMenu(mainMenu);
});

function createAddWindow(){
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        Title: 'Add Shopping List Item',
        webPreferences: {
            nodeIntegration: true
        }
    }); 
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    addWindow.removeMenu();

    //Garage collection
    addWindow.on('close',() => {
        addWindow = null;
    })
}

//app.allowRendererProcessReuse = true;

//catch item:add
ipcMain.on('item:add', (e, item) =>{
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
})

//create menu tempalte
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add item',
                accelerator: process.platform=='darwin' ? 'Command+Space' : 'Ctrl+Space',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Clear items',
                click(){
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform=='darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

//if Mac add empty object to Menu
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

//Add developer tools item if not prod mode
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer tools',
        submenu : [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform=='darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    //focusedWindow.webContents.openDevTools()
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}