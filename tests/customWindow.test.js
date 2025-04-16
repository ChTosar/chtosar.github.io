import '../windows.js';

describe('CustomWindow', () => {
    let customWindow;

    beforeEach(() => {
        customWindow = document.createElement('custom-window');
        document.body.appendChild(customWindow);
    });

    afterEach(() => {
        document.body.removeChild(customWindow);
    });

    test('should toggle expand state', async () => {
        expect(customWindow.isExpanded).toBe(false);

        customWindow.toggleExpand();
        await new Promise((resolve) => setTimeout(resolve, 600));
        expect(customWindow.isExpanded).toBe(true);
        expect(customWindow.classList.contains('expanded')).toBe(true);

        customWindow.toggleExpand();
        await new Promise((resolve) => setTimeout(resolve, 600));
        expect(customWindow.isExpanded).toBe(false);
        expect(customWindow.classList.contains('expanded')).toBe(false);
    });
});
