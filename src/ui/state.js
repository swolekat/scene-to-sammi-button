import {ipcRenderer} from "electron";

let callbacks = [];
export const addCallback = (cb) => {
  callbacks.push(cb);
};

const notifySubscribers = () => {
    callbacks.forEach(cb => cb());
}

export let currentSceneCollection = undefined;
export let sceneCollections = [];
export let scenes = [];
export const setCurrentSceneCollection = (sceneCollectionName) => {
    currentSceneCollection = sceneCollections.find(sc => sc.name === sceneCollectionName);
    scenes = currentSceneCollection.contents.scene_order.map(s => s.name);
    notifySubscribers();
};
export const getScene = (sceneName) => {
    // todo build up object that is { name, sources }
};


// We can communicate with main process through messages.
ipcRenderer.on("obs-data", (event, data) => {
    sceneCollections = data.sceneCollectionData;
    setCurrentSceneCollection(sceneCollections[0].name);
});
ipcRenderer.send("need-obs-data");