import i18n from '../utils/lang.js';

const lang = i18n.translations;

const cv = document.querySelector('.des.icon.mycv');
cv.addEventListener('dblclick', () => {
  if (document.querySelector('custom-window[name="cv"]')) {
    document
      .querySelector('custom-window[name="cv"]')
      .classList.add('selected');
    return;
  }
  const icon = document.querySelector('.leftBar .icon.cv');
  const win = document.createElement('custom-window');

  win.innerHTML = `<div class="pdfContent"><iframe src="./docs/CVCH${
    i18n.lang == 'es-ES' ? '' : '_ING'
  }.pdf" frameborder="0" width="100%" height="100%"></iframe></div>`;

  win.title = lang.pdfReader;
  win.setAttribute('width', '840px');
  win.setAttribute('height', '90%');
  win.setAttribute('name', 'cv');
  cv.classList.remove('selected');

  document.querySelector('container').appendChild(win);
  win.center();
  icon.style.display = 'block';
  setTimeout(() => {
    icon.classList.remove('hidden');
  }, 100);
  icon.classList.add('selected');

  win.onClose = () => {
    icon.classList.add('hidden');
    icon.classList.remove('selected');
  };

  const iframe = win.querySelector('iframe');

  const activeIframe = () => {
    iframe.style.pointerEvents = 'auto';
    iframe.click();
    iframe.addEventListener('mouseleave', () => {
      iframe.style.pointerEvents = 'none';
    });
  };

  win.querySelector('.pdfContent').addEventListener('wheel', activeIframe);
  win.querySelector('.pdfContent').addEventListener('click', activeIframe);
});

cv.addEventListener('click', (e) => {
  e.stopPropagation();
  cv.classList.add('selected');
});

const draggable = document.querySelector('.des.icon.mycv');
const container = document.querySelector('.main');
const emptyImage = new Image();
emptyImage.src =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
let offsetX, offsetY;
const position = localStorage.getItem('mycvPosition');
if (position) {
  const [left, top] = position.split(',').map(Number);
  draggable.style.position = 'absolute';
  draggable.style.left = `${left}px`;
  draggable.style.top = `${top}px`;
}
draggable.addEventListener('dragstart', (e) => {
  draggable.classList.add('dragging');
  e.dataTransfer.setDragImage(emptyImage, 0, 0);
  const rect = draggable.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;
});

draggable.addEventListener('dragend', () => {
  draggable.classList.remove('dragging');
});

container.addEventListener('dragover', (e) => {
  e.preventDefault();
  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left - offsetX;
  const y = e.clientY - rect.top - offsetY;
  draggable.style.position = 'absolute';
  draggable.style.left = `${x}px`;
  draggable.style.top = `${y}px`;
  localStorage.setItem('mycvPosition', `${x},${y}`);
});

container.addEventListener('contextmenu', (e) => {
  console.log('right click');
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
