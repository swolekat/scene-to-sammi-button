import {addCallback, scenes, getScene} from "./state";
import {showNotification} from "./copied-notification";
import {convertSceneToSammiButton} from "./convert-scene-to-sammi-button";

const element = document.getElementById('scene-list');


const renderButtons = () => {
    element.innerHTML = '';
    scenes.forEach((name) => {
        const button = document.createElement('button');
        button.className = 'scene-button';
        button.innerHTML = name;
        button.onclick = () => {
            const scene = getScene(name);
            const sammiButton = convertSceneToSammiButton(scene);
            // todo don't pretty print
            navigator.clipboard.writeText(JSON.stringify(sammiButton, null, 2));
            showNotification(name);
        };
        element.appendChild(button);
    });
};

addCallback(renderButtons);
renderButtons();