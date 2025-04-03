
import "./windows.js";

window.onload = () => {

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
        document.querySelector('.topBar .title').textContent = 'Tosar.eu';
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

    function reglaDeTres(valor) {
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

        document.querySelector('.title').textContent = 'Tosar.eu';
    });

    document.querySelector('.leftBar .icon.photos').addEventListener('click', () => {

        const el = document.querySelector('container custom-window.photos');

        if (el) {
            el.classList.add('selected');

            if (el.classList.contains('expanded')) {
                document.querySelector('container').scrollTo({
                    left: document.querySelector('container .photos').offsetLeft-100,
                    behavior: 'smooth'
                });
            }
        } else {
            const newElement = document.createElement('custom-window');

            newElement.innerHTML = `<div class="photos">`;
    
            document.querySelector('container').appendChild(newElement);
    
            newElement.title = 'Fotos';
            newElement.classList.add('selected');
            newElement.classList.add('photos');

            document.querySelector('container custom-window .photos').addEventListener("scroll", () => {        
                document.querySelectorAll(".photo").forEach(img => {
        
                    const rect = img.getBoundingClientRect();
        
                    if (rect.top <= 60) {
                        const top = rect.top - 60;
                        img.querySelector('img').style.transform = `translateY(${-(top*0.9)}px) scale(0.${reglaDeTres(rect.top)})`; 
                        img.style.zIndex = -1;
                    } else {
                        img.querySelector('img').style.transform = "";
                        img.style.zIndex = "";
                    }   
                });
        
            });

        }
    });

    document.querySelector('.leftBar .icon.about').addEventListener('click', () => {
        const el = document.querySelector('container custom-window.about');

        if (el) {
            el.classList.add('selected');

            if (el.classList.contains('expanded')) {
                document.querySelector('container').scrollTo({
                    left: document.querySelector('container .about').offsetLeft-100,
                    behavior: 'smooth'
                });
            }
        } else {
            const newElement = document.createElement('custom-window');

            newElement.innerHTML = `<div class="linkList" tabindex="0">
            <spam class="text"></spam>
                <div class="links">
                    <a href="https://github.com/ChTosar/" target="_blank">
                        <svg aria-hidden="true" focusable="false" class="" viewBox="0 0 24 24" width="18" height="18" fill="white" style="display:inline-block;user-select:none;vertical-align:top;overflow:visible"><path d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977 0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547C20.709 21.637 24 17.324 24 12.25 24 5.896 18.854.75 12.5.75Z"></path></svg>
                        <span>GitHub</span>
                    </a>
                    <a href="https://www.npmjs.com/~chtosar" target="_blank">
                        <svg viewBox="0 0 27.23 27.23" aria-hidden="true" width="18" height="18" ><rect fill="white" width="27.23" height="27.23" rx="2"></rect><polygon fill="black" points="5.8 21.75 13.66 21.75 13.67 9.98 17.59 9.98 17.58 21.76 21.51 21.76 21.52 6.06 5.82 6.04 5.8 21.75"></polygon></svg>
                        <span>npm profile</span>
                    </a>
                </div>
            </div>`;
    
            document.querySelector('container').appendChild(newElement);
    
            newElement.title = 'Proyectos';
            newElement.classList.add('selected');
            newElement.classList.add('about');

            typeWriterEffect(document.querySelector('.linkList .text'), 'My public proyects:').then(() => {
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
                document.querySelector('container').scrollTo({
                    left: document.querySelector('container .contact').offsetLeft-100,
                    behavior: 'smooth'
                });
            }
        } else {
            const newElement = document.createElement('custom-window');

            newElement.innerHTML = `<div class="contact">
            <span>Send me an email to: <a class="emailLink" href="mailto:christian@tosar.eu">christian@tosar.eu</a>
            <svg class="copyEmail" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#fff" width="18px" height="18" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet">
                <path d="M29.5,7h-19A1.5,1.5,0,0,0,9,8.5v24A1.5,1.5,0,0,0,10.5,34h19A1.5,1.5,0,0,0,31,32.5V8.5A1.5,1.5,0,0,0,29.5,7ZM29,32H11V9H29Z" class="clr-i-outline clr-i-outline-path-1"/><path d="M26,3.5A1.5,1.5,0,0,0,24.5,2H5.5A1.5,1.5,0,0,0,4,3.5v24A1.5,1.5,0,0,0,5.5,29H6V4H26Z" class="clr-i-outline clr-i-outline-path-2"/>
                <rect x="0" y="0" width="36" height="36" fill-opacity="0"/>
            </svg></span>
            </br><span> or chekck my 
                <a href="https://www.linkedin.com/in/christian-tosar-2bb91080/" target="_blank">
                    Linkedin
                </a>
            </span>
            </div>`;
    
            document.querySelector('container').appendChild(newElement);

            newElement.title = 'Contacto';
            newElement.classList.add('selected');
            newElement.classList.add('contact');
            newElement.center();

            document.querySelector('.contact .copyEmail').addEventListener('click', () => {
                const email = document.querySelector('.contact .emailLink').textContent;
                navigator.clipboard.writeText(email).then(() => {
                    document.querySelector('.contact .emailLink').classList.add('copied');
                    setTimeout(() => {
                        document.querySelector('.contact .emailLink').classList.remove('copied');
                    }, 1500);
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
}
