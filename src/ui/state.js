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
    const sceneObject = currentSceneCollection.contents.sources.find(source => source.name === sceneName);
    const sourceNames = sceneObject.settings.items.map(i => i.name);
    const sceneSources = currentSceneCollection.contents.sources.filter(source => sourceNames.includes(source.name));
    const mappedSources = sceneSources.map(source => {
        const matchingItem = sceneObject.settings.items.find(i => i.name === source.name);
        return {
            ...source,
            ...matchingItem,
        }
    })
    return {
        name: sceneName,
        sources: mappedSources,
    }
};

const setData = (sceneCollectionData) => {
    if(sceneCollectionData.length === 0){
        clearData();
        return;
    }
    sceneCollections = sceneCollectionData;
    setCurrentSceneCollection(sceneCollections[0].name);
    const hasDataContentElement = document.getElementById('has-data-content');
    const noDataContentElement = document.getElementById('no-data-content');
    noDataContentElement.style.display = 'none';
    hasDataContentElement.style.display = '';
}

const clearData = () => {
    const hasDataContentElement = document.getElementById('has-data-content');
    const noDataContentElement = document.getElementById('no-data-content');
    noDataContentElement.style.display = '';
    hasDataContentElement.style.display = 'none';
};


// We can communicate with main process through messages.
ipcRenderer.on("obs-data", (event, data) => {
    setData(data.sceneCollectionData);
});
ipcRenderer.send("need-obs-data");

// need to wait for the element to exist
setTimeout(() => {
    const noDataContentElement = document.getElementById('no-data-content');
    noDataContentElement.addEventListener('drop',   (event) => {
        event.stopPropagation();
        event.preventDefault();
        const files = [...event.dataTransfer.files];
        const filteredFiles = files.filter(file => file.path.endsWith('.json')).map(f => f.path);
        ipcRenderer.send('process-files', filteredFiles);
    });
    noDataContentElement.addEventListener('dragover',   (event) => {
        event.stopPropagation();
        event.preventDefault();
    });
    const loadButtonElement = document.getElementById('load-json-button');
    loadButtonElement.addEventListener('click', clearData);
}, 100);