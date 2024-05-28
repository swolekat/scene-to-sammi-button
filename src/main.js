// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from "path";
import {app, Menu, ipcMain} from "electron";
import appMenuTemplate from "./menu/app_menu_template";
import devMenuTemplate from "./menu/dev_menu_template";
import fs from "fs";
import {init} from './main-window';

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from "env";

const PATH_TO_OBS_SCENES = path.join(process.env.APPDATA, '../Roaming/obs-studio/basic/scenes/');

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== "production") {
    const userDataPath = app.getPath("userData");
    app.setPath("userData", `${userDataPath} (${env.name})`);
}

const setApplicationMenu = () => {
    const menus = [appMenuTemplate];
    if (env.name !== "production") {
        menus.push(devMenuTemplate);
    }
    Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// We can communicate with our window (the renderer process) via messages.
const initIpc = () => {
    ipcMain.on("need-obs-data", (event) => {
        if(!fs.existsSync(PATH_TO_OBS_SCENES)){
            // todo check for running obs process. Assume they are portable and get the scenes that way.
            return;
        }
        const sceneCollections = fs.readdirSync(PATH_TO_OBS_SCENES)
            .filter(f => !f.includes('.bak'));
        const sceneCollectionData = sceneCollections.reduce((sum, sceneCollectionFileName) => {
            const contents = JSON.parse(`${fs.readFileSync(path.join(PATH_TO_OBS_SCENES, sceneCollectionFileName))}`);
            return [
                ...sum,
                {
                    name: sceneCollectionFileName.replace('.json', ''),
                    contents: contents,
                }
            ]
        }, []);
        event.reply("obs-data", {
            sceneCollectionData,
        });
    });
    ipcMain.on("process-files", (event, files) => {
        const sceneCollectionData = files.reduce((sum, sceneCollectionFileName) => {
            const contents = JSON.parse(`${fs.readFileSync(sceneCollectionFileName)}`);
            const name = path.normalize(sceneCollectionFileName).split('\\').pop();
            return [
                ...sum,
                {
                    name: name.replace('.json', ''),
                    contents: contents,
                }
            ]
        }, []);
        event.reply("obs-data", {
            sceneCollectionData,
        });
    });
};


app.on("ready", () => {
    setApplicationMenu();
    initIpc();
    init();
});

app.on("window-all-closed", () => {
    app.quit();
});
