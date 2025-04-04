import "./windows.js";

const lang = {};
let actualLang;
const availableLanguages = ["en-US", "es-ES", "gl-ES", "ca-ES", "pt-PT", "fr-FR", "de-DE", "it-IT", "zh-CN", "ja-JP", "ar", "ru-RU", "vi-VN", "uk-UA"];

async function loadLanguage(language) {
    const userPrefLang = localStorage.getItem('preferredLanguage');
    const userLang = userPrefLang ? userPrefLang : (language || navigator.language || "en-US");
    const baseLang = userLang.split("-")[0];

    if (availableLanguages.includes(userLang)) {
        try {
            const response = await fetch(`./lang/${userLang}.json`);
            Object.assign(lang, await response.json());
            actualLang = userLang;
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
            return;
        } catch (error) {
            console.error(`Error loading language file for ${partialMatch}:`, error);
        }
    }

    console.warn(`Falling back to default language.`);
    const response = await fetch('./lang/en-us.json');
    Object.assign(lang, await response.json());
}

window.onload = async () => {
    await loadLanguage();

    function updateTime() {
        const elementoHora = document.querySelector('.topBar time');
        if (!elementoHora) return;

        const ahora = new Date();
        const hora = ahora.getHours().toString().padStart(2, '0');
        const minutos = ahora.getMinutes().toString().padStart(2, '0');
        const segundos = ahora.getSeconds().toString().padStart(2, '0');

        elementoHora.textContent = `${hora}:${minutos}:${segundos}`;
    }
    setInterval(updateTime, 1000);
    updateTime();

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

    function scaling(valor) {
        if (valor <= -80) {   
            let min = -5000, max = -60;
            let minY = 1, maxY = 999;

            let resultado = ((valor - min) * (maxY - minY)) / (max - min) + minY;
            return Math.round(resultado);
        } else {
            return 999
        }
    }

    document.querySelector('.leftBar .icon.start').addEventListener('click', () => {
        document.querySelector('container').scrollTo({
            left: 0,
            behavior: 'smooth'
        });

        document.querySelector('.title').textContent = lang.defaultTitle;
    });

    document.querySelector('.leftBar .icon.photos').addEventListener('click', () => {

        const el = document.querySelector('container custom-window.photos');

        if (el) {
            el.classList.add('selected');

            if (el.classList.contains('expanded')) {
                moveAnimationWindows(document.querySelector('container .photos'));
            }
        } else {
            const newElement = document.createElement('custom-window');

            newElement.innerHTML = `<div class="photos">`;
        
            newElement.title = lang.photosTitle;
            newElement.classList.add('selected');
            newElement.classList.add('photos');
            newElement.setAttribute('width', '60%');
            newElement.setAttribute('height', '90%');

            const imgs = ['sn06', 'sn10', 'sn03', 'sn04', 'sn05', 'sn01', 'sn07', 'sn02', 'sn09', 'sn08', 'sn11', 'sn12', 'sn13'];
            imgs.forEach(img => {
                const imgElement = document.createElement('div');
                imgElement.classList.add('photo');
                imgElement.innerHTML = `<img src="./imgs/${img}_720.jpg" alt="${img}" draggable="false">`;
                newElement.querySelector('.photos').appendChild(imgElement);
                imgElement.querySelector('img').addEventListener('click', (e) => {
                    const animationTimeStart = performance.now();
                    e.target.parentElement.style.animation = 'expandToFull 250ms forwards';

                    const resolution = window.innerHeight * window.devicePixelRatio < 1200 ? '1080' : '5k';
                    const imgFull = document.createElement('img');
                    imgFull.src = `./imgs/${img}_${resolution}.jpg`;

                    const imgPrev = document.createElement('img');
                    imgPrev.src = e.target.src;
                    imgPrev.classList.add('fullscreen');
                    imgPrev.classList.add('prev');
                    imgPrev.setAttribute('draggable', 'false');

                    imgPrev.addEventListener('load', () => {
                        setTimeout(() => {
                            if (!imgFull.complete) {
                                imgPrev.addEventListener('click', () => {
                                    imgPrev.remove();
                                });
                                document.body.appendChild(imgPrev);
                                e.target.parentElement.style.animation = '';
                            }
                        }, animationTimeStart - performance.now() + 200);
                    });

                    imgFull.classList.add('fullscreen');
                    imgFull.setAttribute('draggable', 'false');                              
                    imgFull.addEventListener('load', () => {
                        setTimeout(() => {
                            imgFull.addEventListener('click', () => {
                                imgFull.remove();
                            });
                            imgPrev.remove();
                            document.body.appendChild(imgFull);
                        }, animationTimeStart - performance.now() + 200);
                    });
                });
            });

            document.querySelector('container').appendChild(newElement);
            newElement.center();

            const parent = document.querySelector('container custom-window .photos');
            parent.addEventListener("scroll", () => {        
                document.querySelectorAll(".photo").forEach(img => {
                    const rectParent = parent.getBoundingClientRect();       
                    const rect = img.getBoundingClientRect();
                    const paddingTop = parseInt(window.getComputedStyle(parent).paddingTop.replace('px', ''));
                    const relativeTop = rect.top - rectParent.top;
        
                    if (relativeTop < paddingTop) {
                        const top = relativeTop - paddingTop;
                        img.querySelector('img').style.transform = `translateY(${-(top*0.9)}px) scale(0.${scaling(relativeTop)})`; 
                        img.style.zIndex = 1;
                    } else {
                        img.querySelector('img').style.transform = "";
                        img.style.zIndex = "";
                    }   
                });
        
            });

            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    if (entry.contentRect.width < 800) {
                        parent.classList.add('smallSize');
                    } else {
                        parent.classList.remove('smallSize');
                    }
                }
            });
            resizeObserver.observe(parent);

        }
    });

    document.querySelector('.leftBar .icon.about').addEventListener('click', () => {
        const el = document.querySelector('container custom-window.about');

        if (el) {
            el.classList.add('selected');

            if (el.classList.contains('expanded')) {
                moveAnimationWindows(document.querySelector('container .about'));
            }
        } else {
            const newElement = document.createElement('custom-window');

            newElement.innerHTML = `<div class="linkList" tabindex="0">
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
    
            newElement.setAttribute('min-width', '210');
            newElement.setAttribute('min-height', '130');
            newElement.title = lang.aboutTitle;
            newElement.classList.add('selected');
            newElement.classList.add('about');
            document.querySelector('container').appendChild(newElement);
            newElement.center({top: 25});

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

        const el = document.querySelector('container custom-window.contact');

        if (el) {
            el.classList.add('selected');
            if (el.classList.contains('expanded')) {
                moveAnimationWindows(document.querySelector('container .contact'));
            }
        } else {
            const newElement = document.createElement('custom-window');

            newElement.innerHTML = `<div class="contact">
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

            newElement.setAttribute('no-resize', '');
            newElement.setAttribute('no-expand', '');
            newElement.title = lang.contactTitle;
            newElement.classList.add('selected');
            newElement.classList.add('contact');
            document.querySelector('container').appendChild(newElement);
            newElement.center();

            const emailCopy = newElement.querySelector('.copyEmail');
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
}
