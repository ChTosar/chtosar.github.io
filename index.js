import './styles.css';
import "./components/windows.js";
import "./components/calendar.js";
import './components/musicPlayer.js';
import './components/photos.js';

const lang = {};
let actualLang;
const availableLanguages = ["en-US", "es-ES", "gl-ES", "ca-ES", "pt-PT", "fr-FR", "de-DE", "it-IT", "zh-CN", "ja-JP", "ar", "ru-RU", "vi-VN", "uk-UA"];

async function loadLanguage(language) {
    const userPrefLang = localStorage.getItem('preferredLanguage');
    const userLang = !language && userPrefLang ? userPrefLang : (language || navigator.language || "en-US");
    const baseLang = userLang.split("-")[0];

    if (availableLanguages.includes(userLang)) {
        try {
            const response = await fetch(`./lang/${userLang}.json`);
            Object.assign(lang, await response.json());
            actualLang = userLang;
            document.querySelector('html').setAttribute('lang', actualLang.split("-")[0]);
            return;
        } catch (error) {
            console.error(`Error loading language file for ${userLang}:`, error);
        }
    }

    const partialMatch = availableLanguages.find(langCode => langCode.startsWith(baseLang));
    if (partialMatch) {
        try {
            const response = await fetch(`./lang/${partialMatch}.json`);
            Object.assign(lang, await response.json());
            actualLang = userLang;
            document.querySelector('html').setAttribute('lang', actualLang.split("-")[0]);
            return;
        } catch (error) {
            console.error(`Error loading language file for ${partialMatch}:`, error);
        }
    }

    console.warn(`Falling back to default language.`);
    const response = await fetch('./lang/en-US.json');
    Object.assign(lang, await response.json());
    document.querySelector('html').setAttribute('lang', 'en');
}

window.onload = async () => {
    await loadLanguage();

    const timePlace = document.querySelector('.topBar time');

    function updateTime() {
        if (!timePlace) return;

        const ahora = new Date();
        const hora = ahora.getHours().toString().padStart(2, '0');
        const minutos = ahora.getMinutes().toString().padStart(2, '0');
        const segundos = ahora.getSeconds().toString().padStart(2, '0');

        timePlace.textContent = `${hora}:${minutos}:${segundos}`;
    }
    setInterval(updateTime, 1000);
    updateTime();

    timePlace.addEventListener('click', () => {
        const calendar = document.querySelector('my-calendar');
        calendar.style.display = 'block';

        calendar.addEventListener('mouseleave', () => { 
            calendar.style.display = '';
        });
    });

    window.defaultTitle = () => {
        document.querySelector('.topBar .title').textContent = lang.defaultTitle;
    };

    document.querySelector('container .main').addEventListener('click', () => {
        defaultTitle();
    });

    document.querySelector('.topBar .actions .big').addEventListener('click', () => {
        document.querySelector('custom-window.expanded.selected').toggleExpand();
    });

    document.querySelector('.topBar .actions .close').addEventListener('click', () => {
        document.querySelector('custom-window.expanded.selected').close();
    });

    document.querySelector('.topBar .lang').addEventListener('click', () => {
        const langMenu = document.querySelector('.topBar .lang .langMenu');
        if (langMenu) {
            langMenu.remove();
        } else {
            const newLangMenu = document.createElement('div');
            newLangMenu.classList.add('langMenu');

            availableLanguages.forEach(langCode => {
                const langItem = document.createElement('span');
                langItem.classList.add('lang');
                if(langCode === actualLang) {
                    langItem.classList.add('selected');
                }
                langItem.textContent = langCode;
                langItem.addEventListener('click', async () => {
                    await loadLanguage(langCode);
                    actualLang = langCode;
                    newLangMenu.remove();
                    localStorage.setItem('preferredLanguage', langCode);
                });
                newLangMenu.appendChild(langItem);
            });
            document.querySelector('.topBar .lang').appendChild(newLangMenu);
            newLangMenu.addEventListener('mouseleave', () => {
                newLangMenu.remove();
            });
        }
    });

    document.querySelector('.leftBar .icon.start').addEventListener('click', () => {
        document.querySelector('container').scrollTo({
            left: 0,
            behavior: 'smooth'
        });

        document.querySelector('.title').textContent = lang.defaultTitle;
    });

    document.querySelector('.leftBar .icon.photos').addEventListener('click', () => {

        const el = document.querySelector('custom-window[name="photos"]');

        if (el) {
            el.classList.add('selected');

            if (el.classList.contains('expanded')) {
                moveAnimationWindows(document.querySelector('container .photos'));
            }
        } else {
            const win = document.createElement('custom-window');
            const icon = document.querySelector('.leftBar .icon.photos');

            win.innerHTML = `<photos-page></photos-page>`;
        
            win.title = lang.photosTitle;
            win.setAttribute('name', 'photos');
            win.setAttribute('width', '60%');
            win.setAttribute('height', '90%');
            document.querySelector('container').appendChild(win);
            win.center();
            icon.classList.add('selected');
            win.onClose = () => {
                icon.classList.remove('selected');
            };
        }
    });

    document.querySelector('.leftBar .icon.about').addEventListener('click', () => {
        const el = document.querySelector('custom-window[name="about"]');

        if (el) {
            el.classList.add('selected');

            if (el.classList.contains('expanded')) {
                moveAnimationWindows(document.querySelector('container .about'));
            }
        } else {
            const icon = document.querySelector('.leftBar .icon.about');
            const win = document.createElement('custom-window');

            win.innerHTML = `<div class="linkList" tabindex="0">
            <spam class="text"></spam>
                <div class="links">
                    <a href="https://github.com/ChTosar/" target="_blank">
                        <svg aria-hidden="true" focusable="false" class="" viewBox="0 0 24 24" width="18" height="18" fill="white" style="display:inline-block;user-select:none;vertical-align:top;overflow:visible"><path d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977 0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547C20.709 21.637 24 17.324 24 12.25 24 5.896 18.854.75 12.5.75Z"></path></svg>
                        <span>${lang.githubLink}</span>
                    </a>
                    <a href="https://www.npmjs.com/~chtosar" target="_blank">
                        <svg viewBox="0 0 27.23 27.23" aria-hidden="true" width="18" height="18" ><rect fill="white" width="27.23" height="27.23" rx="2"></rect><polygon fill="black" points="5.8 21.75 13.66 21.75 13.67 9.98 17.59 9.98 17.58 21.76 21.51 21.76 21.52 6.06 5.82 6.04 5.8 21.75"></polygon></svg>
                        <span>${lang.npmProfileLink}</span>
                    </a>
                </div>
            </div>`;
    
            win.setAttribute('min-width', '280');
            win.setAttribute('min-height', '130');
            win.setAttribute('name', 'about');
            win.title = lang.aboutTitle;
            document.querySelector('container').appendChild(win);
            win.center({top: 25});

            icon.classList.add('selected');
            win.onClose = () => {
                icon.classList.remove('selected');
            };

            typeWriterEffect(document.querySelector('.linkList .text'), lang.aboutText).then(() => {
                document.querySelector('.linkList .links').style.display = 'block';

                document.querySelector('.linkList').addEventListener('keydown', (event) => {
                    const links = document.querySelectorAll('.linkList .links a');
                    if (!links.length) return;
                    let currentIndex = Array.from(links).findIndex(link => link === document.activeElement);
                
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

                document.querySelector('.linkList').addEventListener('mousemove', (event) => {
                    const focus = document.querySelector('.linkList .links a:focus')
                    if (focus) {
                        focus.blur(); 
                    }                   
                });

                document.querySelector('.linkList').addEventListener('mouseleave', (event) => {
                    document.querySelector('.linkList').focus();          
                });



                setTimeout(() => {
                    document.querySelector('.linkList .links a').focus();
                }, 750);

            });
        }

    });

    document.querySelector('.leftBar .icon.contact').addEventListener('click', () => {

        const el = document.querySelector('custom-window[name="contact"]');

        if (el) {
            el.classList.add('selected');
            if (el.classList.contains('expanded')) {
                moveAnimationWindows(document.querySelector('container .contact'));
            }
        } else {
            const icon = document.querySelector('.leftBar .icon.contact');
            const win = document.createElement('custom-window');

            win.innerHTML = `<div class="contact">
            <span>${lang.contactEmailText} <a class="emailLink" href="mailto:christian@tosar.eu">christian@tosar.eu</a>
            <svg class="copyEmail" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#fff" width="18px" height="18" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet">
                <path d="M29.5,7h-19A1.5,1.5,0,0,0,9,8.5v24A1.5,1.5,0,0,0,10.5,34h19A1.5,1.5,0,0,0,31,32.5V8.5A1.5,1.5,0,0,0,29.5,7ZM29,32H11V9H29Z" class="clr-i-outline clr-i-outline-path-1"/><path d="M26,3.5A1.5,1.5,0,0,0,24.5,2H5.5A1.5,1.5,0,0,0,4,3.5v24A1.5,1.5,0,0,0,5.5,29H6V4H26Z" class="clr-i-outline clr-i-outline-path-2"/>
                <rect x="0" y="0" width="36" height="36" fill-opacity="0"/>
            </svg></span>
            </br><span>${lang.linkedinText}
                <a href="https://www.linkedin.com/in/christian-tosar-2bb91080/" target="_blank">
                    Linkedin
                </a>
            </span>
            </div>`;

            win.setAttribute('no-resize', '');
            win.setAttribute('no-expand', '');
            win.setAttribute('name', 'contact');
            win.title = lang.contactTitle;
            document.querySelector('container').appendChild(win);
            win.center();

            const emailCopy = win.querySelector('.copyEmail');
            emailCopy.addEventListener('click', (e) => {
                const email = document.querySelector('.contact .emailLink').textContent;
                navigator.clipboard.writeText(email).then(() => {
                    
                    const copied = document.createElement('div')
                    copied.innerHTML = `<div class="copied">${lang.emailCopied}</div>`;
                    document.body.appendChild(copied);
                    const rect = e.target.getBoundingClientRect();
                    copied.style.position = 'absolute';
                    copied.style.left = `${rect.left + emailCopy.clientWidth/2 - copied.clientWidth/2}px`;
                    copied.style.top = `${rect.top - 35}px`;
                    copied.style.zIndex = 9999;
                    
                    setTimeout(() => {
                        copied.remove();
                    }, 1000);
                }).catch(err => {
                    console.error('Error copying email: ', err);
                });
            });

            icon.classList.add('selected');

            win.onClose = () => {
                icon.classList.remove('selected');
            };
        }
    });

    document.querySelector('.leftBar .icon.cv').addEventListener('click', () => {
        const el = document.querySelector('custom-window[name="cv"]');

        if (el) {
            el.classList.add('selected');
            if (el.classList.contains('expanded')) {
                moveAnimationWindows(document.querySelector('container .cv'));
            }
        }
    });

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

    function moveAnimationWindows(el) {
        const leftGap = screen.orientation.type === "landscape-primary" ? 100 : 0;
        document.querySelector('container').scrollTo({
            left: el.offsetLeft-leftGap,
            behavior: 'smooth'
        });
    }

    window.addEventListener("resize", () => {
        const windowSelected = document.querySelector('custom-window.expanded.selected');
        const leftGap = screen.orientation.type === "landscape-primary" ? 100 : 0;
        if (windowSelected) {
            document.querySelector('container').scrollTo({
                left: windowSelected.offsetLeft-leftGap,
            });
        }
    })

    const cv = document.querySelector('.des.icon.mycv');
    cv.addEventListener('dblclick', () => {
        
        if (document.querySelector('custom-window[name="cv"]')) {
            document.querySelector('custom-window[name="cv"]').classList.add('selected');
            return;
        } const icon = document.querySelector('.leftBar .icon.cv');
        const win = document.createElement('custom-window');

        win.innerHTML = `<div class="pdfContent"><iframe src="./docs/CVCH${actualLang == 'es-ES'? '': '_ING'}.pdf" frameborder="0" width="100%" height="100%"></iframe></div>`;
        
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
        }

        const iframe = win.querySelector('iframe');

        const activeIframe = (e) => {
            iframe.style.pointerEvents = 'auto';
            iframe.click();
            iframe.addEventListener('mouseleave', () => {
                iframe.style.pointerEvents = 'none';
                console.log('mouseleave');
            });
        }

        win.querySelector('.pdfContent').addEventListener('wheel', activeIframe);
        win.querySelector('.pdfContent').addEventListener('click', activeIframe);
    });

    cv.addEventListener('click', (e) => {
        e.stopPropagation();
        cv.classList.add('selected');
    });

    document.querySelector('.main').addEventListener('click', () => {
        document.querySelectorAll('.des.icon').forEach(icon => {
            icon.classList.remove('selected');
        });
    });

    document.querySelector('.leftBar .icon.chat').addEventListener('click', () => {
        const el = document.querySelector('custom-window[name="chat"]');

        if (el) {
            el.classList.add('selected');
            if (el.classList.contains('expanded')) {
                moveAnimationWindows(document.querySelector('container .chat'));
            }
        } else {
            const win = document.createElement('custom-window');
            const icon = document.querySelector('.leftBar .icon.chat');

            const presentation = lang.chatPresentation;

            win.innerHTML = `<div class="chat">
            <pre class="presentation"></pre>
            <spam class="userInput" style="display:none;">>>><input type="text" placeholder="${lang.chatInput}"/></spam>
            </div>`;

            win.title = lang.chat;
            win.classList.add('selected');
            win.setAttribute('name', 'chat');
            win.setAttribute('width', '480px');
            win.setAttribute('height', '30%');
            document.querySelector('container').appendChild(win);

            const input = win.querySelector('.chat input');

            typeWriterEffect(document.querySelector('.chat .presentation'), presentation, 12).then(() => {
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

                        typeWriterEffect(response, lang.chatResponse, 12).then(() => {
                            response.innerHTML += `</br><a> ✉️ ${lang.contactTitle}</a>`;    
                            response.querySelector('a').addEventListener('click', () => {
                                document.querySelector('.leftBar .icon.contact').click();
                            });                  
                        });
                    }
                }
            });

            win.center();
            icon.classList.add('selected');
            win.onClose = () => {
                icon.classList.remove('selected');
            };
        }
    });

    document.querySelector('.leftBar .icon.mplayer').addEventListener('click', () => {
        const el = document.querySelector('custom-window[name="mplayer"]');

        if (el) {
            el.classList.add('selected');
            if (el.classList.contains('expanded')) {
                moveAnimationWindows(document.querySelector('container .mplayer'));
            }
        } else {
            const icon = document.querySelector('.leftBar .icon.mplayer');
            const win = document.createElement('custom-window');

            win.innerHTML = `<music-player></music-player>`;

            
            win.title = lang.mplayer;
            win.setAttribute('width', '480px');
            win.setAttribute('name', 'mplayer');
            document.querySelector('container').appendChild(win);

            win.center();
            icon.classList.add('selected');

            win.onClose = () => {
                icon.classList.remove('selected');
            };
        }
    });

    const windowsObserver = new MutationObserver((mutationsList) => {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.tagName === 'CUSTOM-WINDOW' && target.classList.contains('selected')) {
                    const windowName = target.getAttribute('name');
                    const icons = document.querySelectorAll('.leftBar .icon');
                    icons.forEach(icon => {
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

    windowsObserver.observe(document.querySelector('container'), { attributes: true, subtree: true });

    (() => {
        const paths = document.querySelectorAll('svg.bg path');
        let tick = 0;
        const speeds = [3,9,1];
        function animateWaves() {
            tick += 0.001;
            paths.forEach((path, i) => {
                const tickL = tick*speeds[i]; 
                i = i +1;
                const offset = i * 4.5;
                const amplitude = i * 28 ;
                const frequency = 0.001  + i * 0.0005 ;

                const width = Math.ceil(svg.clientWidth*0.01)*100;
    
                let d = `M0 0 `;
                let startY = 500 + (Math.random() * 10)  + Math.sin(tickL + offset) * amplitude;
                d += `L0 ${startY.toFixed(2)} `;
    
                for (let x = 100; x <= width; x += 100) {
                    const y = 500 + Math.sin((x * frequency) + tickL + offset) * amplitude;
                    d += `L${x} ${y.toFixed(2)} `;
                }
    
                d += `L${width} 0 Z`;
                path.setAttribute("d", d);
            });
            requestAnimationFrame(animateWaves);
        }
    
        const svg = document.querySelector('svg.bg');
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.setAttribute('viewBox', `0 0 ${svg.clientWidth} ${svg.clientHeight}`);
        window.addEventListener('resize', () => {
            svg.setAttribute('viewBox', `0 0 ${svg.clientWidth} ${svg.clientHeight}`);
        });
        animateWaves();
    })();

    (() => {
        const draggable = document.querySelector('.des.icon.mycv');
        const container = document.querySelector('.main');
        const emptyImage = new Image();
        emptyImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
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

        draggable.addEventListener('dragend', (e) => {
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
        
    })();

}
