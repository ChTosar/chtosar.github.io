class CustomWindow extends HTMLElement {

    title;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isExpanded = false;
        this.initialState = {};
    }

    connectedCallback() {
        this.minWidth = this.getAttribute('min-width') || 100;
        this.minHeight = this.getAttribute('min-height') || 60;
        this.windowWidth = this.getAttribute('width') || 'auto';
        this.windowHeight = this.getAttribute('height') || 'auto';
        this.render();
        this.addEventListeners();

        if (this.hasAttribute('no-expand')) {
            this.shadowRoot.querySelector('.actions .big').style.display = 'none';
        }

        if (this.hasAttribute('no-resize')) {
            this.windowDiv.classList.add('no-resize');
        }
        this.onClassChange();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .window {
                    border-radius: 8px;
                    position: fixed;
                    width: ${this.windowWidth};
                    height: ${this.windowHeight};
                    min-width: ${this.minWidth}px;
                    min-height: ${this.minHeight}px;
                    top: 60px;
                    left: 120px;
                    border: 0.5px solid var(--withe-contrast);
                    box-shadow: -1px 10px 20px #00000080;
                    max-height: 100vh;
                    max-width: calc(100vw - 100px);
                    user-select: none;
                    -webkit-user-select: none;
                    overflow: hidden;
                }

                .window.no-resize {
                    resize: none;
                    cursor: default;
                }

                .window:not(.selected) .big,
                .window:not(.selected) .close {
                    background-color: grey;
                }

                .window.expanded {
                    position: static;
                    border: none;
                    width: calc(100vw - 100px) !important;
                    height: 100vh !important;
                }

                .window .bar {
                    min-width: 60px;
                    border-bottom: solid 1px var(--withe-contrast);
                    padding: 5px 12px;
                    box-sizing: border-box;
                    display: flex;
                    justify-content: space-between;
                    z-index: 3;
                    position: absolute;
                    width: 100%;
                    backdrop-filter: blur(4px);
                    background: #0000008a;
                }

                .window.expanded .bar {
                    display: none;
                }

                .window .content {
                    overflow: auto;
                    min-height: ${this.minHeight}px;
                    height: 100%;
                    width: 100%;
                    padding: 5px 12px;
                    box-sizing: border-box;
                    user-select: text;
                    -webkit-user-select: text;
                    backdrop-filter: blur(4px);
                    background: #0000008a;
                }

                slot>* {
                    padding-top:30px;
                }

                .window.expanded .content {
                    height: calc(100%);
                    padding: 0 12px;
                }
                
                .actions {
                    display: flex;
                    gap: 5px;
                }

                .actions.expanded.selected {
                    display: flex;
                }

                .actions div {
                    border-radius: 20px;
                    width: 14px;
                    height: 14px;
                    margin-inline-end: 0.5rem;
                    cursor: pointer;
                    display: inline-block;
                }

                .actions svg {
                    transform: scale(1.2);
                    display: none;
                }

                .big { background-color: #4caf50; }
                .close { background-color: #f44336; }

                .actions:hover svg {
                    display: block;
                }
            </style>

            <div class="window">
                <div class="bar">
                    <div class="actions">
                        <div class="close">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                                <path xmlns="http://www.w3.org/2000/svg" d="M16 8L8 16M12 12L16 16M8 8L10 10" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class="big">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                                <path d="M9 14L12 17L15 14M10.5 8.5L9 10M15 10L12 7" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="content">
                    <slot></slot>
                </div>
            </div>
        `;

        this.windowDiv = this.shadowRoot.querySelector(".window");
        this.header = this.shadowRoot.querySelector(".bar");
    }

    addEventListeners() {
        let offsetX = 0, offsetY = 0;

        const maxTop = document.querySelector('.topBar').offsetHeight + 1; // TODO parameters
        const maxLeft = -160;

        this.header.addEventListener("mousedown", (e) => {
            offsetX = e.clientX - this.windowDiv.offsetLeft;
            offsetY = e.clientY - this.windowDiv.offsetTop;

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });

        const onMouseMove = (e) => {
            let newTop = e.clientY - offsetY;
            let newLeft = e.clientX - offsetX;

            if (newTop < maxTop) {
                newTop = maxTop;
            }

            if (newLeft < maxLeft) {
                newLeft = maxLeft;
            }

            this.windowDiv.style.left = `${newLeft}px`;
            this.windowDiv.style.top = `${newTop}px`;
            this.windowDiv.style.width = `${this.windowDiv.clientWidth}px`;
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        this.shadowRoot.addEventListener("mousedown", (e) => {
            document.querySelectorAll('custom-window').forEach(other => other.classList.remove('selected'));
            this.classList.add('selected');
        });

        this.shadowRoot.querySelector('.actions .close').addEventListener("click", () => {
            this.close();
        });

        if (!this.hasAttribute('no-resize')) {
            this.resize();
        }

        if (!this.hasAttribute('no-expand')) {
            this.shadowRoot.querySelector('.actions .big').addEventListener("click", () => {
                this.toggleExpand();
            });

            this.shadowRoot.querySelector('.bar').addEventListener("dblclick", () => {
                console.log('double click');
                this.toggleExpand();
            });
        }

        this.observeClassChanges();
    }

    observeClassChanges() {
        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.attributeName === "class") {
                    this.onClassChange();
                }
            }
        });
    
        observer.observe(this, { attributes: true, attributeFilter: ["class"] });
    }

    upadateTitle() {
        document.querySelector('.topBar .title').textContent = this.title;
    }
    
    onClassChange() {
        if (this.classList.contains("selected")) {
            this.windowDiv.classList.add("selected");
            this.upadateTitle();
            document.querySelectorAll('custom-window').forEach(other => other != this ? other.classList.remove('selected'):0);
            if (!this.classList.contains('expanded')) {
                document.querySelector('.topBar .actions').classList.add('hidden');
            } else {
                document.querySelector('.topBar .actions').classList.remove('hidden');
            }
        } else {
            this.windowDiv.classList.remove("selected");
        }

        if (this.classList.contains("expanded")) {
            this.windowDiv.classList.add("expanded");
        } else {
            this.windowDiv.classList.remove("expanded");
        }
    }

    close() {
        if (this.classList.contains('expanded')) {
            this.classList.remove('expanded');
            document.querySelector('.topBar .actions').classList.add('hidden');
        }
        window.defaultTitle();
        this.remove();
    }

    toggleExpand() {
        if (!this.isExpanded) {

            this.initialState = {
                left: this.windowDiv.offsetLeft,
                top: this.windowDiv.offsetTop,
                width: this.windowDiv.clientWidth,
                height: this.windowDiv.clientHeight
            };

            const startTime = performance.now();
            const duration = 500;
            const targetLeft = 100;
            const targetTop = 0;
            const targetWidth = window.innerWidth - 100;
            const targetHeight = window.innerHeight;

            const animateExpand = (time) => {
                const progress = Math.min((time - startTime) / duration, 1);

                this.windowDiv.style.left = `${this.initialState.left + (targetLeft - this.initialState.left) * progress}px`;
                this.windowDiv.style.top = `${this.initialState.top + (targetTop - this.initialState.top) * progress}px`;
                this.windowDiv.style.width = `${this.initialState.width + (targetWidth - this.initialState.width) * progress}px`;
                this.windowDiv.style.height = `${this.initialState.height + (targetHeight - this.initialState.height) * progress}px`;

                if (progress < 1) {
                    requestAnimationFrame(animateExpand);
                } else {
                    this.isExpanded = true;
                    this.windowDiv.classList.add('expanded');
                    this.classList.add('expanded');
                    document.querySelector('container').scrollTo({
                        left: this.offsetLeft-100,
                    });
                    document.querySelector('.actions').classList.remove('hidden');
                }
            }

            requestAnimationFrame(animateExpand);

        } else {
            this.windowDiv.style.left = `${this.initialState.left}px`;
            this.windowDiv.style.top = `${this.initialState.top}px`;
            this.windowDiv.style.width = `${this.initialState.width}px`;
            this.windowDiv.style.height = `${this.initialState.height}px`;
            this.windowDiv.classList.remove('expanded');
            this.classList.remove('expanded');

            if (document.querySelectorAll('custom-window.expanded').length == 0) {
                document.querySelector('.actions').classList.add('hidden');
            }

            this.isExpanded = false;
        }
    }

    center(options = {}) {
        const { top = 50, left = 50 } = options;
        this.windowDiv.style.top = `calc(${top}% + 25px - ${this.windowDiv.offsetHeight/2}px)`;
        this.windowDiv.style.left = `calc(${left}% - ${this.windowDiv.offsetWidth/2}px)`;
    }

    resize() {
        let isResizing = false;
        let startX, startY, startWidth, startHeight, startLeft, startTop;
        let resizingDirection = {};

        this.windowDiv.addEventListener('mousemove', (e) => {
            let rect = this.windowDiv.getBoundingClientRect();
            let isNearLeft = Math.abs(e.clientX - rect.left) < 8;
            let isNearRight = Math.abs(e.clientX - (rect.left + rect.width)) < 8;
            let isNearTop = Math.abs(e.clientY - rect.top) < 8;
            let isNearBottom = Math.abs(e.clientY - (rect.top + rect.height)) < 8;

            if ((isNearLeft && isNearTop) || (isNearRight && isNearBottom)) {
                this.windowDiv.style.cursor = "nwse-resize"; 
            } else if ((isNearRight && isNearTop) || (isNearLeft && isNearBottom)) {
                this.windowDiv.style.cursor = "nesw-resize";
            } else if (isNearRight || isNearLeft) {
                this.windowDiv.style.cursor = "ew-resize";
            } else if (isNearBottom || isNearTop) {
                this.windowDiv.style.cursor = "ns-resize";  
            } else {
                this.windowDiv.style.cursor = "default";
            }
        });

        this.windowDiv.addEventListener('mousedown', (e) => {
            let rect = this.windowDiv.getBoundingClientRect();
            let isNearLeft = Math.abs(e.clientX - rect.left) < 8;
            let isNearRight = Math.abs(e.clientX - (rect.left + rect.width)) < 8;
            let isNearTop = Math.abs(e.clientY - rect.top) < 8;
            let isNearBottom = Math.abs(e.clientY - (rect.top + rect.height)) < 8;

            if (isNearLeft || isNearRight || isNearTop || isNearBottom) {
                isResizing = true;
                startX = e.clientX;
                startY = e.clientY;
                startWidth = rect.width;
                startHeight = rect.height;
                startLeft = rect.left;
                startTop = rect.top;

                resizingDirection = { left: isNearLeft, right: isNearRight, top: isNearTop, bottom: isNearBottom };

                document.addEventListener('mousemove', resize);
                document.addEventListener('mouseup', stopResize);
            }
        });

        const resize = (e) => {

            if (isResizing) {
                let newWidth = startWidth;
                let newHeight = startHeight;
                let newLeft = startLeft;
                let newTop = startTop;

                if (resizingDirection.right) {
                    newWidth = startWidth + (e.clientX - startX);
                }
                if (resizingDirection.bottom) {
                    newHeight = startHeight + (e.clientY - startY);
                }
                if (resizingDirection.left) {
                    let diffX = e.clientX - startX;
                    newWidth = startWidth - diffX;
                    newLeft = startLeft + diffX;
                }
                if (resizingDirection.top) {
                    let diffY = e.clientY - startY;
                    newHeight = startHeight - diffY;
                    newTop = startTop + diffY;
                }

                if (newWidth > this.minWidth) {
                    this.windowDiv.style.width = newWidth + 'px';
                    this.windowDiv.style.left = newLeft + 'px';
                }
                if (newHeight > this.minHeight) {
                    this.windowDiv.style.height = newHeight + 'px';
                    this.windowDiv.style.top = newTop + 'px';
                }
            }
        }

        const stopResize = () => {
            isResizing = false;
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);
        }
    }

}

customElements.define('custom-window', CustomWindow);