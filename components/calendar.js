import styles from './calendar.scss';
import i18n from '../utils/lang.js';

const lang = await i18n.langLoaded();

class MyCalendar extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = styles;

        const container = document.createElement('div');

        /*html*/
        container.innerHTML = `
            <div class="header">
                <span id="month"></span>
                <span id="year"></span>
                <div class="buttons">
                    <button id="prev">&lt;</button>
                    <button id="today">${lang.today}</button>
                    <button id="next">&gt;</button>
                </div>
            </div>
            <div class="dates"></div>`;

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
