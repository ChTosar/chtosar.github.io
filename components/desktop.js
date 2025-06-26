import './cv.js';
import './bgWaves.js';

const container = document.querySelector('.main');
/*TODO something more...*/
container.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  const contextMenu = document.createElement('div');
  contextMenu.classList.add('context-menu');
  contextMenu.innerHTML = `<span>Config</span>`;
  contextMenu.style.left = `${e.clientX}px`;
  contextMenu.style.top = `${e.clientY}px`;
  contextMenu.style.position = 'absolute';
  contextMenu.style.zIndex = 9999;
  document.body.appendChild(contextMenu);

  contextMenu.addEventListener('click', () => {
    contextMenu.remove();
  });
  contextMenu.addEventListener('mouseleave', () => {
    contextMenu.remove();
  });
  contextMenu.addEventListener('dragover', (e) => {
    e.preventDefault();
  });
});
