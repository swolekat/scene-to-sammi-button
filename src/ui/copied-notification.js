const element = document.getElementById('copied-notification');

let myTimeout;

export const showNotification = (name) => {
    if(myTimeout){
        clearTimeout(myTimeout);
        myTimeout = undefined;
    }
    element.innerHTML = `Copied ${name} to clipboard!`;
    element.className = 'in';
    setTimeout(() => {
        element.className = '';
        myTimeout = undefined;
    }, 10000);
};