const paths = document.querySelectorAll('svg.bg path');
let tick = 0;
const speeds = [3, 9, 1];
function animateWaves() {
  tick += 0.001;
  paths.forEach((path, i) => {
    const tickL = tick * speeds[i];
    i = i + 1;
    const offset = i * 4.5;
    const amplitude = i * 28;
    const frequency = 0.001 + i * 0.0005;

    const width = Math.ceil(svg.clientWidth * 0.01) * 100;

    let d = `M0 0 `;
    let startY =
      500 + Math.random() * 10 + Math.sin(tickL + offset) * amplitude;
    d += `L0 ${startY.toFixed(2)} `;

    for (let x = 100; x <= width; x += 100) {
      const y = 500 + Math.sin(x * frequency + tickL + offset) * amplitude;
      d += `L${x} ${y.toFixed(2)} `;
    }

    d += `L${width} 0 Z`;
    path.setAttribute('d', d);
  });
  requestAnimationFrame(animateWaves);
}

const svg = document.querySelector('svg.bg');
svg.style.width = '100%';
svg.style.height = '100%';
svg.setAttribute('viewBox', `0 0 ${svg.clientWidth} ${svg.clientHeight}`);
window.addEventListener('resize', () => {
  svg.setAttribute('viewBox', `0 0 ${svg.clientWidth} ${svg.clientHeight}`);
});
animateWaves();
