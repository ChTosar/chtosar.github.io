import i18n from '../utils/lang.js';
import './musicPlayer.js';
import './photos.js';

await i18n.langLoaded();

const apps = [
  {
    name: 'photos',
    title: i18n.get('photosTitle'),
    options: { width: '60%', height: '90%' },
    html: `<photos-page></photos-page>`
  },
  {
    name: 'about',
    title: i18n.get('aboutTitle'),
    options: { width: '280px', height: '130px' },
    /*html*/
    html: `<div class="linkList" tabindex="0">
            <spam class="text"></spam>
                <div class="links">
                    <a href="https://github.com/ChTosar/" target="_blank">
                        <svg aria-hidden="true" focusable="false" class="" viewBox="0 0 24 24" width="18" height="18" fill="white" style="display:inline-block;user-select:none;vertical-align:top;overflow:visible"><path d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977 0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547C20.709 21.637 24 17.324 24 12.25 24 5.896 18.854.75 12.5.75Z"></path></svg>
                        <span>${i18n.get('githubLink')}</span>
                    </a>
                    <a href="https://www.npmjs.com/~chtosar" target="_blank">
                        <svg viewBox="0 0 27.23 27.23" aria-hidden="true" width="18" height="18" ><rect fill="white" width="27.23" height="27.23" rx="2"></rect><polygon fill="black" points="5.8 21.75 13.66 21.75 13.67 9.98 17.59 9.98 17.58 21.76 21.51 21.76 21.52 6.06 5.82 6.04 5.8 21.75"></polygon></svg>
                        <span>${i18n.get('npmProfileLink')}</span>
                    </a>
                </div>
            </div>`,
    functions: (win) => {
      win.center({ top: 25 });

      typeWriterEffect(
        document.querySelector('.linkList .text'),
        i18n.get('aboutText')
      ).then(() => {
        document.querySelector('.linkList .links').style.display = 'block';

        document
          .querySelector('.linkList')
          .addEventListener('keydown', (event) => {
            const links = document.querySelectorAll('.linkList .links a');
            if (!links.length) return;
            let currentIndex = Array.from(links).findIndex(
              (link) => link === document.activeElement
            );

            if (event.key === 'ArrowDown') {
              currentIndex = (currentIndex + 1) % links.length;
              links[currentIndex].focus();
            } else if (event.key === 'ArrowUp') {
              currentIndex = (currentIndex - 1 + links.length) % links.length;
              links[currentIndex].focus();
            } else if (event.key === 'Enter') {
              if (currentIndex >= 0) {
                links[currentIndex].click();
              }
            }
          });

        document
          .querySelector('.linkList')
          .addEventListener('mousemove', () => {
            const focus = document.querySelector('.linkList .links a:focus');
            if (focus) {
              focus.blur();
            }
          });

        document
          .querySelector('.linkList')
          .addEventListener('mouseleave', () => {
            document.querySelector('.linkList').focus();
          });

        setTimeout(() => {
          document.querySelector('.linkList .links a').focus();
        }, 750);
      });
    }
  },
  {
    name: 'contact',
    title: i18n.get('contactTitle'),
    options: { width: '280px', height: '130px' },
    html: `<div class="contact">
            <span>${i18n.get('contactEmailText')} <a class="emailLink" href="mailto:christian@tosar.eu">christian@tosar.eu</a>
            <svg class="copyEmail" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#fff" width="18px" height="18" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet">
                <path d="M29.5,7h-19A1.5,1.5,0,0,0,9,8.5v24A1.5,1.5,0,0,0,10.5,34h19A1.5,1.5,0,0,0,31,32.5V8.5A1.5,1.5,0,0,0,29.5,7ZM29,32H11V9H29Z" class="clr-i-outline clr-i-outline-path-1"/><path d="M26,3.5A1.5,1.5,0,0,0,24.5,2H5.5A1.5,1.5,0,0,0,4,3.5v24A1.5,1.5,0,0,0,5.5,29H6V4H26Z" class="clr-i-outline clr-i-outline-path-2"/>
                <rect x="0" y="0" width="36" height="36" fill-opacity="0"/>
            </svg></span>
            </br><span>${i18n.get('linkedinText')}
                <a href="https://www.linkedin.com/in/christian-tosar-2bb91080/" target="_blank">
                    Linkedin
                </a>
            </span>
            </div>`,
    functions: (win) => {
      const emailCopy = win.querySelector('.copyEmail');
      emailCopy.addEventListener('click', (e) => {
        const email = document.querySelector('.contact .emailLink').textContent;
        navigator.clipboard
          .writeText(email)
          .then(() => {
            const copied = document.createElement('div');
            copied.innerHTML = `<div class="copied">${i18n.get('emailCopied')}</div>`;
            document.body.appendChild(copied);
            const rect = e.target.getBoundingClientRect();
            copied.style.position = 'absolute';
            copied.style.left = `${
              rect.left + emailCopy.clientWidth / 2 - copied.clientWidth / 2
            }px`;
            copied.style.top = `${rect.top - 35}px`;
            copied.style.zIndex = 9999;

            setTimeout(() => {
              copied.remove();
            }, 1000);
          })
          .catch((err) => {
            console.error('Error copying email: ', err);
          });
      });
    }
  },
  {
    name: 'cv'
  },
  {
    name: 'chat',
    title: i18n.get('chat'),
    options: { width: '480px', height: '30%' },
    html: `<div class="chat">
            <pre class="presentation"></pre>
            <spam class="userInput" style="display:none;">>>><input type="text" placeholder="${i18n.get('chatInput')}"/></spam>
            </div>`,
    functions: (win) => {
      const input = win.querySelector('.chat input');

      typeWriterEffect(
        document.querySelector('.chat .presentation'),
        i18n.get('chatPresentation'),
        12
      ).then(() => {
        document.querySelector('.chat .userInput').style.display = '';
        input.focus();
      });

      input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          const input = event.target;
          const message = input.value.trim();
          if (message) {
            input.setAttribute('readonly', 'readonly');
            const response = document.createElement('pre');
            response.classList.add('response');

            document.querySelector('custom-window .chat').appendChild(response);

            typeWriterEffect(response, i18n.get('chatResponse'), 12).then(() => {
              response.innerHTML += `</br><a> ✉️ ${i18n.get('contactTitle')}</a>`;
              response.querySelector('a').addEventListener('click', () => {
                document.querySelector('.leftBar .icon.contact').click();
              });
            });
          }
        }
      });
    }
  },
  {
    name: 'mplayer',
    title: i18n.get('mplayer'),
    options: { width: '480px', height: '30%' },
    html: `<music-player></music-player>`
  }
];

class App {
  win = document.createElement('custom-window');

  constructor(app) {
    this.name = app.name;
    this.title = app.title;
    this.html = app.html;
    this.functions = app.functions;
    this.options = app.options;
    this.icon = document.querySelector(`.leftBar .icon.${this.name}`);

    console.log(`Initializing app: ${this.name}`);

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

function typeWriterEffect(element, text, speed = 50) {
  let index = 0;

  return new Promise((resolve) => {
    function type() {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(type, speed);
      } else {
        resolve();
      }
    }

    type();
  });
}
