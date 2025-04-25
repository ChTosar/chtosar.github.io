import '../components/calendar.js';

describe('MyCalendar Component', () => {
    let calendar;

    beforeEach(() => {
        document.body.innerHTML = '<my-calendar></my-calendar>';
        calendar = document.querySelector('my-calendar');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('Renderización inicial muestra el mes y año actuales', () => {
        const currentDate = new Date();
        const month = currentDate.toLocaleString('default', { month: 'long' }).toUpperCase();
        const year = currentDate.getFullYear();

        const shadow = calendar.shadowRoot;
        const displayedMonth = shadow.getElementById('month').textContent;
        const displayedYear = shadow.getElementById('year').textContent;

        expect(displayedMonth).toBe(month);
        expect(displayedYear).toBe(String(year));
    });

    test('El botón "Anterior" cambia al mes anterior', () => {
        const shadow = calendar.shadowRoot;
        const prevButton = shadow.getElementById('prev');
        const initialMonth = shadow.getElementById('month').textContent;

        prevButton.click();
        const newMonth = shadow.getElementById('month').textContent;

        expect(newMonth).not.toBe(initialMonth);
    });

    test('El botón "Siguiente" cambia al mes siguiente', () => {
        const shadow = calendar.shadowRoot;
        const nextButton = shadow.getElementById('next');
        const initialMonth = shadow.getElementById('month').textContent;

        nextButton.click();
        const newMonth = shadow.getElementById('month').textContent;

        expect(newMonth).not.toBe(initialMonth);
    });

    test('El botón "Hoy" restablece al mes y año actuales', () => {
        const shadow = calendar.shadowRoot;
        const todayButton = shadow.getElementById('today');

        shadow.getElementById('prev').click();

        todayButton.click();
        const currentDate = new Date();
        const month = currentDate.toLocaleString('default', { month: 'long' }).toUpperCase();
        const year = currentDate.getFullYear();

        const displayedMonth = shadow.getElementById('month').textContent;
        const displayedYear = shadow.getElementById('year').textContent;

        expect(displayedMonth).toBe(month);
        expect(displayedYear).toBe(String(year));
    });

    test('El número correcto de días se muestra para un mes específico', () => {
        const shadow = calendar.shadowRoot;
        const datesContainer = shadow.querySelector('.dates');

        // Configurar el calendario a febrero de 2021 (28 días)
        calendar.currentDate = new Date(2021, 1, 1); // Febrero 2021
        calendar.renderCalendar();

        const days = datesContainer.querySelectorAll('.date');
        expect(days.length).toBe(28);
    });

    test('El día actual está resaltado con la clase "today"', () => {
        const shadow = calendar.shadowRoot;
        const today = new Date().getDate();
        const todayElement = Array.from(shadow.querySelectorAll('.date')).find(el => el.textContent === String(today));

        expect(todayElement).toBeDefined();
        expect(todayElement.classList.contains('today')).toBe(true);
    });
});
