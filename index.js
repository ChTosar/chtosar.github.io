
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

            newElement.innerHTML = `<div class="linkList"><span>
                <a href="https://github.com/ChTosar/" target="_blank">
                    <h4>GitHub</h4>
                </a>
            </span>
            <span>
                <a href="https://www.npmjs.com/~chtosar" target="_blank">
                    <h4>npm profile</h4>
                </a>
            </span>
            <span>
                <a href="https://www.linkedin.com/in/christian-tosar-2bb91080/" target="_blank">
                    <h4>Linkedin</h4>
                </a>
            </span></div>`;
    
            document.querySelector('container').appendChild(newElement);
    
            newElement.title = 'Proyectos';
            newElement.classList.add('selected');
            newElement.classList.add('about');
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

            newElement.innerHTML = `<div style="padding: 2rem">Send me an email to: <a href="mailto:christian@tosar.eu">christian@tosar.eu</a></div>`;
    
            document.querySelector('container').appendChild(newElement);

            newElement.title = 'Contacto';
            newElement.classList.add('selected');
            newElement.classList.add('contact');
            newElement.center();
        }
    });

}
