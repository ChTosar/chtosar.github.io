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
        this.shadowRoot.innerHTML = `
            <style>
                .photos{
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    column-gap: 0.5rem;
                    justify-content: space-between;
                    align-content: flex-start;
                    box-sizing: border-box;
                    overflow: auto;
                    height: 100%;
                    width: 100%;
                    padding: 1rem;
                    padding-top: calc(26px + 1rem) !important;
                    padding-bottom: 10rem;
                }
                .photos.smallSize .photo{
                    width: calc(33% - 1rem);
                }

                .photo{
                    width: calc(25% - 0.5rem);
                    margin-bottom: 1rem;
                    aspect-ratio: 3 / 4;
                    z-index: 2;
                    box-sizing: border-box;
                    box-shadow: 0 0px 10px 0px #00000050;
                }

                .photo:hover img {
                    transition: filter 200ms ease-in-out;
                    filter: brightness(1.08);
                }

                .photos img{
                    width: 100%;
                    border-radius: 7px;
                    aspect-ratio: 3 / 4;
                    object-fit: cover; 
                    cursor: pointer;
                    user-select: none;
                    -webkit-user-select: none;
                }
                
                @media screen and (max-width: 800px) {
                    .photos .photo {
                        width: calc(33% - 1rem);
                    }
                }

                .expanded .photos {
                    padding-top: 3rem;
                }
            </style>
            <div class="photos"></div>`;
    }

    init() {

        const imgs = ['sn06', 'sn10', 'sn03', 'sn04', 'sn05', 'sn01', 'sn07', 'sn02', 'sn09', 'sn08', 'sn11', 'sn12', 'sn13'];
        imgs.forEach(img => {
            const imgElement = document.createElement('div');
            imgElement.classList.add('photo');
            imgElement.innerHTML = `<img src="./imgs/${img}_720.jpg" alt="${img}" draggable="false">`;
            this.shadowRoot.querySelector('.photos').appendChild(imgElement);
            
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
    }

    events() {
        const parent = this.shadowRoot.querySelector('.photos');
        parent.addEventListener("scroll", () => {        
            this.shadowRoot.querySelectorAll(".photo").forEach(img => {
                const rectParent = parent.getBoundingClientRect();       
                const rect = img.getBoundingClientRect();
                const paddingTop = parseInt(window.getComputedStyle(parent).paddingTop.replace('px', ''));
                const relativeTop = rect.top - rectParent.top;
    
                if (relativeTop < paddingTop) {
                    const top = relativeTop - paddingTop;
                    img.querySelector('img').style.transform = `translateY(${-(top*0.9)}px) scale(0.${this.scaling(relativeTop)})`; 
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

    scaling(valor) {
        if (valor <= -80) {   
            let min = -5000, max = -60;
            let minY = 1, maxY = 999;

            let resultado = ((valor - min) * (maxY - minY)) / (max - min) + minY;
            return Math.round(resultado);
        } else {
            return 999
        }
    }
}
customElements.define('photos-page', Photos);