import {addCallback, setCurrentSceneCollection, sceneCollections, currentSceneCollection} from "./state";

const element = document.getElementById('scene-collection-dropdown');

element.onchange = (e) => {
    setCurrentSceneCollection(e.target.value);
};

const renderOptions = () => {
    element.innerHTML = '';
    sceneCollections.forEach(({name}) => {
        const option = document.createElement('option');
        option.value = name;
        option.selected = name === currentSceneCollection.name;
        option.innerHTML = name;
        element.appendChild(option);
    });
};

addCallback(renderOptions);
renderOptions();