class MyCalendar extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        // Estilos del calendario
        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                width: 300px;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                height: 42px;
            }
            .header .buttons {
                display: none;
            }
            .header #year {
                color: var(--withe-contrast);
            }
            .header:hover #year {
                display: none;
            }
            .header:hover .buttons {
                display: flex;
            }
            .header button {
                background: none;
                border: none;
                cursor: pointer;
                font-size: 16px;
                color: #f44336;
                text-decoration: none;
            }
            .dates {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                text-align: center;
                padding: 10px 0;
            }
            .date {
                padding: 10px;
                cursor: pointer;
                border-radius: 50%;
                transition: background-color 0.3s;
                width: 42px;
                height: 42px;
                box-sizing: border-box;
                color: var(--withe-contrast);
            }
            .date:hover {
                color: white;
            }
            .date.today {
                background-color: #f44336;
                color: white;
                font-weight: bold;
            }
        `;

        // Estructura del calendario
        const container = document.createElement('div');
        container.innerHTML = `
            <div class="header">
                <span id="month"></span>
                <span id="year"></span>
                <div class="buttons">
                    <button id="prev">&lt;</button>
                    <button id="today">Hoy</button>
                    <button id="next">&gt;</button>
                </div>
            </div>
            <div class="dates"></div>
        `;

        shadow.appendChild(style);
        shadow.appendChild(container);

        this.shadow = shadow;
        this.currentDate = new Date();
        this.renderCalendar();
    }

    connectedCallback() {
        this.shadow.getElementById('prev').addEventListener('click', () => this.changeMonth(-1));
        this.shadow.getElementById('next').addEventListener('click', () => this.changeMonth(1));
        this.shadow.getElementById('today').addEventListener('click', () => {
            this.currentDate = new Date();
            this.renderCalendar();
        });
    }

    disconnectedCallback() {
        this.shadow.getElementById('prev').removeEventListener('click', () => this.changeMonth(-1));
        this.shadow.getElementById('next').removeEventListener('click', () => this.changeMonth(1));
        this.shadow.getElementById('today').removeEventListener('click', () => {
            this.currentDate = new Date();
            this.renderCalendar();
        });
    }

    renderCalendar() {
        const datesContainer = this.shadow.querySelector('.dates');
        datesContainer.innerHTML = '';

        const monthEl = this.shadow.getElementById('month');
        const year = this.currentDate.getFullYear();
        const yearEl = this.shadow.getElementById('year');

        const month = this.currentDate.getMonth();
        monthEl.textContent = this.currentDate.toLocaleString('default', { month: 'long' }).toUpperCase();
        yearEl.textContent = year;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            datesContainer.appendChild(document.createElement('span'));
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateElement = document.createElement('span');
            dateElement.textContent = day;
            dateElement.className = 'date';
            let dName = new Date(year, month, day).toLocaleString('default', { weekday: 'long' });
            dName = dName.charAt(0).toUpperCase() + dName.slice(1);
            dateElement.setAttribute('title', dName);
            if (day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
                dateElement.classList.add('today');
            }
            datesContainer.appendChild(dateElement);
        }
    }

    changeMonth(offset) {
        this.currentDate.setMonth(this.currentDate.getMonth() + offset);
        this.renderCalendar();
    }
}

customElements.define('my-calendar', MyCalendar);
