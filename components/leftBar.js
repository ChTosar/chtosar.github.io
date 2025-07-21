import i18n from '../utils/lang.js';
import './musicPlayer.js';
import './photos.js';
import { apps } from '../apps/appList.js';
await i18n.langLoaded();

class App {
  win = document.createElement('custom-window');

  constructor(app) {
    this.name = app.name;
    this.title = app.title;
    this.html = app.html;
    this.functions = app.functions;
    this.options = app.options;
    this.icon = document.querySelector(`.leftBar .icon.${this.name}`);

    this.click();
  }

  click() {
    document
      .querySelector(`.leftBar .icon.${this.name}`)
      .addEventListener('click', () => {
        const el = document.querySelector(`custom-window[name="${this.name}"]`);
        if (el) {
          el.classList.add('selected');
          if (el.classList.contains('expanded')) {
            this.moveAnimationWindows(el);
          }
        } else {
          this.init();
        }
      });
  }

  moveAnimationWindows(el) {
    const leftGap = screen.orientation.type === 'landscape-primary' ? 100 : 0;
    document.querySelector('container').scrollTo({
      left: el.offsetLeft - leftGap,
      behavior: 'smooth'
    });
  }

  setConfigs(options) {
    this.win.title = this.title;
    this.win.setAttribute('name', this.name);
    this.win.setAttribute('width', options.width);
    this.win.setAttribute('height', options.height);
    this.win.setAttribute('max-height', options.maxHeight);
    document.querySelector('container').appendChild(this.win);
    this.win.center();
    this.icon.classList.add('selected');
  }

  init() {
    this.win.innerHTML = this.html;

    this.setConfigs(this.options);

    if (this.functions) {
      this.functions(this.win);
    }

    this.win.onClose = () => {
      this.icon.classList.remove('selected');
    };
  }
}

class LeftBar {
  constructor() {
    this.leftBar = document.querySelector('.leftBar');
    this.init();
  }

  init() {
    apps.forEach((app) => {
      new App(app);
    });
    this.startButton();
    this.selectedEvents();
    this.resizeGap();
  }

  startButton() {
    this.leftBar.querySelector('.icon.start').addEventListener('click', () => {
      document.querySelector('container').scrollTo({
        left: 0,
        behavior: 'smooth'
      });

      document.querySelector('.title').textContent = i18n.get('defaultTitle');
      document
        .querySelector('.leftBar .icon.selected')
        .classList.remove('selected');
      document
        .querySelector('custom-window.selected')
        .classList.remove('selected');
      document.querySelector('.topBar .actions').classList.add('hidden');
    });
  }

  selectedEvents() {
    document.querySelector('.main').addEventListener('click', () => {
      document.querySelectorAll('.des.icon').forEach((icon) => {
        icon.classList.remove('selected');
      });
    });

    const windowsObserver = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          const target = mutation.target;
          if (
            target.tagName === 'CUSTOM-WINDOW' &&
            target.classList.contains('selected')
          ) {
            const windowName = target.getAttribute('name');
            const icons = document.querySelectorAll('.leftBar .icon');
            icons.forEach((icon) => {
              if (icon.classList.contains(windowName)) {
                icon.classList.add('selected');
              } else {
                icon.classList.remove('selected');
              }
            });
          }
        }
      });
    });

    windowsObserver.observe(document.querySelector('container'), {
      attributes: true,
      subtree: true
    });
  }

  resizeGap() {
    window.addEventListener('resize', () => {
      const windowSelected = document.querySelector(
        'custom-window.expanded.selected'
      );
      const leftGap = screen.orientation.type === 'landscape-primary' ? 100 : 0;
      if (windowSelected) {
        document.querySelector('container').scrollTo({
          left: windowSelected.offsetLeft - leftGap
        });
      }
    });
  }
}

new LeftBar();
