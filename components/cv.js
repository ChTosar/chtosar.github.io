import i18n from '../utils/lang.js';

export class CvWindowController {
  constructor(cvSelector) {
    this.cvIcon = document.querySelector(cvSelector);
    this.lang = i18n.lang;
    this.translations = i18n.translations;
    this.init();
  }

  init() {
    this.cvIcon?.addEventListener('dblclick', () => this.openCvWindow());
    this.cvIcon?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.cvIcon.classList.add('selected');
    });
  }

  openCvWindow() {
    if (document.querySelector('custom-window[name="cv"]')) {
      document
        .querySelector('custom-window[name="cv"]')
        .classList.add('selected');
      return;
    }

    const win = document.createElement('custom-window');
    const icon = document.querySelector('.leftBar .icon.cv');
    const pdfFile = this.lang === 'es-ES' ? 'CVCH.pdf' : 'CVCH_ING.pdf';

    /*html*/
    win.innerHTML = `
      <div class="pdfContent">
        <iframe src="./docs/${pdfFile}" frameborder="0" width="100%" height="100%"></iframe>
      </div>`;

    win.title = this.translations.pdfReader;
    win.setAttribute('width', '840px');
    win.setAttribute('height', '90%');
    win.setAttribute('name', 'cv');

    document.querySelector('container')?.appendChild(win);
    win.center?.();

    icon.style.display = 'block';
    icon.classList.add('selected');
    setTimeout(() => icon.classList.remove('hidden'), 100);

    win.onClose = () => {
      icon.classList.add('hidden');
      icon.classList.remove('selected');
    };

    const iframe = win.querySelector('iframe');
    const activateIframe = () => {
      iframe.style.pointerEvents = 'auto';
      iframe.click();
      iframe.addEventListener(
        'mouseleave',
        () => {
          iframe.style.pointerEvents = 'none';
        },
        { once: true }
      );
    };

    win.querySelector('.pdfContent').addEventListener('wheel', activateIframe);
    win.querySelector('.pdfContent').addEventListener('click', activateIframe);
  }
}

export class DraggableIcon {
  constructor(selector, containerSelector, localStorageKey) {
    this.el = document.querySelector(selector);
    this.container = document.querySelector(containerSelector);
    this.key = localStorageKey;
    this.emptyImage = new Image();
    this.emptyImage.src =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    this.init();
  }

  init() {
    this.restorePosition();
    this.el?.addEventListener('dragstart', (e) => this.onDragStart(e));
    this.el?.addEventListener('dragend', () =>
      this.el.classList.remove('dragging')
    );
    this.container?.addEventListener('dragover', (e) => this.onDragOver(e));
  }

  restorePosition() {
    const position = localStorage.getItem(this.key);
    if (position) {
      const [left, top] = position.split(',').map(Number);
      this.el.style.position = 'absolute';
      this.el.style.left = `${left}px`;
      this.el.style.top = `${top}px`;
    }
  }

  onDragStart(e) {
    this.el.classList.add('dragging');
    e.dataTransfer.setDragImage(this.emptyImage, 0, 0);
    const rect = this.el.getBoundingClientRect();
    this.offsetX = e.clientX - rect.left;
    this.offsetY = e.clientY - rect.top;
  }

  onDragOver(e) {
    e.preventDefault();
    const rect = this.container.getBoundingClientRect();
    const x = e.clientX - rect.left - this.offsetX;
    const y = e.clientY - rect.top - this.offsetY;
    this.el.style.position = 'absolute';
    this.el.style.left = `${x}px`;
    this.el.style.top = `${y}px`;
    localStorage.setItem(this.key, `${x},${y}`);
  }
}

new DraggableIcon('.des.icon.mycv', '.main', 'mycvPosition');
new CvWindowController('.des.icon.mycv');
