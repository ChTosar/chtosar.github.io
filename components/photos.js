import styles from './photos.scss';
class Photos extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.init();
    this.events();
  }

  render() {
    const style = document.createElement('style');
    style.textContent = styles;
    this.shadowRoot.innerHTML = `<div class="photos"></div>`;
    this.shadowRoot.append(style);
  }

  init() {
    const imgs = [
      'sn06',
      'sn10',
      'sn03',
      'sn04',
      'sn05',
      'sn01',
      'sn07',
      'sn02',
      'sn09',
      'sn08',
      'sn11',
      'sn12',
      'sn13'
    ];
    imgs.forEach((img) => {
      const imgElement = document.createElement('div');
      imgElement.classList.add('photo');
      imgElement.innerHTML = `<img src="./imgs/${img}_720.jpg" alt="${img}" draggable="false">`;
      this.shadowRoot.querySelector('.photos').appendChild(imgElement);

      imgElement.querySelector('img').addEventListener('click', (e) => {
        const animationTimeStart = performance.now();
        e.target.parentElement.style.animation = 'expandToFull 250ms forwards';

        const resolution =
          window.innerHeight * window.devicePixelRatio < 1200 ? '1080' : '5k';
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
  }

  events() {
    const parent = this.shadowRoot.querySelector('.photos');
    let ticking = false;

    parent.addEventListener('scroll', () => {
      if (!ticking) {
        console.log(parent.scrollTop);
        ticking = true;
        updatePhotos();
      }
    });

    const updatePhotos = () => {
      const rectParent = parent.getBoundingClientRect();
      const paddingTop = parseInt(
        window.getComputedStyle(parent).paddingTop || '0',
        10
      );

      const photos = this.shadowRoot.querySelectorAll('.photo');

      photos.forEach((photo) => {
        const rect = photo.getBoundingClientRect();
        const relativeTop = rect.top - rectParent.top;

        const imgEl = photo.querySelector('img');

        if (relativeTop === paddingTop) {
          const realOffset = parseInt(photo.getAttribute('offsetTop')) || 0;
          const offset = ((parent.scrollTop - realOffset) * 0.1).toFixed(5);

          const scale = `0.${this.scaling(relativeTop)}`;
          window.requestAnimationFrame(() => {
            imgEl.style.transform = `translateY(${-offset}px) scale(${scale})`;
            photo.style.zIndex = 1;
            ticking = false;
          });
        } else {
          const offsetTop = photo.offsetTop - parent.offsetTop;
          photo.setAttribute('offsetTop', offsetTop);

          window.requestAnimationFrame(() => {
            imgEl.style.transform = '';
            photo.style.zIndex = '';
            ticking = false;
          });
        }
      });
    };

    const resizeObserver = new ResizeObserver((entries) => {
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

  scaling(valor) {
    if (valor <= -80) {
      let min = -5000,
        max = -60;
      let minY = 1,
        maxY = 999;

      let resultado = ((valor - min) * (maxY - minY)) / (max - min) + minY;
      return Math.round(resultado);
    } else {
      return 999;
    }
  }
}
customElements.define('photos-page', Photos);
