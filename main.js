//const electron = require('electron');
const {app, BrowserWindow, Menu, ipcMain, globalShortcut} = require('electron');
const url = require('url');
const path = require('path');

let mainWindow;
let addWindow;

//listen on app to be ready
app.on('ready', initLandingPage);

function initLandingPage(){

    //Ha használatban van egy shortcut GlobalShortcut-tal lehet felülírni
    //globalShortcut.register('Ctrl+A', () => createAddWindow());

    // create new window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        backgroundColor: '#202123',
        autoHideMenuBar: true
        //darkTheme: true
    }); 
    //load html into window | mainWindow.loadFile('mainWindow.html')
    mainWindow.loadURL(url.format({
        //pathname: path.join(__dirname, 'mainWindow.html'),
        pathname: path.join(__dirname, 'landingWindow.html'),
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
}


function createAddWindow(){
    addWindow = new BrowserWindow({
        width: 784,
        height: 450,
        Title: 'Alkalmazott hozzáadása',
        webPreferences: {
            nodeIntegration: true
        }
    }); 

    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addEmployeeWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    //addWindow.removeMenu();

    //Garage collection
    addWindow.on('close',() => {
        addWindow = null;
    })
}

//-------------------------------------------------------------------------------------
//CATCH IPCs

ipcMain.on('employee:add', (e, personalData) =>{
    mainWindow.webContents.send('employee:add', personalData);
    addWindow.close();
})

ipcMain.on('employee:edit', (e, personalData) =>{
    mainWindow.webContents.send('employee:edit', personalData);
    addWindow.close();
})

ipcMain.on('routing:addWindow', (e) =>{
    createAddWindow();
})

ipcMain.on('routing:editPage', (e, allDataEditable) =>{
    createAddWindow();

    addWindow.webContents.once('dom-ready', () => {
        addWindow.webContents.send('routing:editPage', allDataEditable);
    })

})

ipcMain.on('routing:workers', (e) =>{

    //Build menu from tempalte
    const workerMainMenu = Menu.buildFromTemplate(workersMenuTemplate);
    //Insert menu
    Menu.setApplicationMenu(workerMainMenu);
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.show();
    });  

})

ipcMain.on('routing:landing', (e) =>{

    //Build menu from tempalte
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert menu
    Menu.setApplicationMenu(mainMenu);

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'landingWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

})
//-------------------------------------------------------------------------------------

//create menu tempalte
const workersMenuTemplate = [
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
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
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
    workersMenuTemplate.unshift({});
}

//Add developer tools item if not prod mode
if(process.env.NODE_ENV !== 'production'){
    const devTool = {
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
    };
    
    workersMenuTemplate.push(devTool);
    mainMenuTemplate.push(devTool);
}