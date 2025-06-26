import i18n from '../utils/lang.js';
const lang = i18n.translations;

class ClockController {
  constructor(el) {
    this.timePlace = el;
    if (!this.timePlace) return;
    this.formatter = new Intl.DateTimeFormat(navigator.language, {
      hour: 'numeric',
      minute: 'numeric'
    });
    this.interval();
  }

  updateTime() {
    this.timePlace.textContent = this.formatter.format(new Date());
  }

  interval() {
    const nextSeg = (60 - new Date().getSeconds()) * 1000;

    this.updateTime();
    setTimeout(() => {
      this.updateTime();
      setInterval(() => this.updateTime(), 60000);
    }, nextSeg);
  }
}

export class CalendarToggleController {
  constructor(timeElement, calendarElement) {
    this.timeElement = timeElement;
    this.calendar = calendarElement;
    this.attachEvents();
  }

  attachEvents() {
    this.timeElement?.addEventListener('click', () => {
      this.calendar.style.display = 'block';
      this.calendar.addEventListener(
        'mouseleave',
        () => {
          this.calendar.style.display = '';
        },
        { once: true }
      );
    });
  }
}

export class LanguageMenuController {
  constructor(i18n, triggerElement) {
    this.i18n = i18n;
    this.trigger = triggerElement;
    this.attachEvent();
  }

  attachEvent() {
    this.trigger.addEventListener('click', () => this.toggleMenu());
  }

  toggleMenu() {
    const existing = this.trigger.querySelector('.langMenu');
    if (existing) {
      existing.remove();
      return;
    }

    const menu = document.createElement('div');
    menu.classList.add('langMenu');

    this.i18n.availableLanguages.forEach((code) => {
      const item = document.createElement('span');
      item.className = 'lang' + (code === this.i18n.lang ? ' selected' : '');
      item.textContent = code;
      item.addEventListener('click', async () => {
        await this.i18n.loadLang(code);
        menu.remove();
        localStorage.setItem('preferredLanguage', code);
      });
      menu.appendChild(item);
    });

    this.trigger.appendChild(menu);
    menu.addEventListener('mouseleave', () => menu.remove());
  }
}

function windowControls() {
  document
    .querySelector('.topBar .actions .big')
    .addEventListener('click', () => {
      document.querySelector('custom-window.expanded.selected').toggleExpand();
    });

  document
    .querySelector('.topBar .actions .close')
    .addEventListener('click', () => {
      document.querySelector('custom-window.expanded.selected').close();
    });

  window.defaultTitle = () => {
    document.querySelector('.topBar .title').textContent = lang.defaultTitle;
  };

  document.querySelector('container .main').addEventListener('click', () => {
    window.defaultTitle();
  });
}

const timePlace = document.querySelector('.topBar time');

new LanguageMenuController(i18n, document.querySelector('.topBar .lang'));
new CalendarToggleController(timePlace, document.querySelector('my-calendar'));
new ClockController(timePlace);
windowControls();
