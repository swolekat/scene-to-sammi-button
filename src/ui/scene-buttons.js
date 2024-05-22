import {addCallback, scenes, getScene} from "./state";
import {showNotification} from "./copied-notification";

const element = document.getElementById('scene-list');


const renderButtons = () => {
    element.innerHTML = '';
    scenes.forEach((name) => {
        const button = document.createElement('button');
        button.className = 'scene-button';
        button.innerHTML = name;
        button.onclick = () => {
            showNotification(name);
            // todo copy to clipboard here
        };
        element.appendChild(button);
    });
};

addCallback(renderButtons);
renderButtons();