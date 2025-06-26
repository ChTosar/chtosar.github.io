class WaveAnimator {
  constructor(svgSelector, speeds = [3, 9, 1]) {
    this.svg = document.querySelector(svgSelector);
    this.paths = this.svg.querySelectorAll('path');
    this.speeds = speeds;
    this.tick = 0;

    this.svg.style.width = '100%';
    this.svg.style.height = '100%';
    this.updateViewBox();
    this.onResize();
    this.animate();
  }

  updateViewBox() {
    this.svg.setAttribute(
      'viewBox',
      `0 0 ${this.svg.clientWidth} ${this.svg.clientHeight}`
    );
  }

  onResize = () => {
    window.addEventListener('resize', () => this.updateViewBox());
  }

  animate = () => {
    this.tick += 0.001;
    const width = Math.ceil(this.svg.clientWidth / 100) * 100;
    const baseY = 500;

    this.paths.forEach((path, index) => {
      const tickSpeed = this.tick * this.speeds[index];
      const layerIndex = index + 1;
      const offset = layerIndex * 4.5;
      const amplitude = layerIndex * 28;
      const frequency = 0.001 + layerIndex * 0.0005;

      let d = `M0 0 L0 ${this.calcY(
        baseY,
        tickSpeed,
        offset,
        amplitude
      ).toFixed(2)} `;

      for (let x = 100; x <= width; x += 100) {
        const y = this.calcY(
          baseY,
          tickSpeed + x * frequency,
          offset,
          amplitude
        );
        d += `L${x} ${y.toFixed(2)} `;
      }

      d += `L${width} 0 Z`;
      path.setAttribute('d', d);
    });

    requestAnimationFrame(this.animate);
  };

  calcY(base, time, offset, amplitude) {
    return base + Math.sin(time + offset) * amplitude;
  }
}

const waveAnimator = new WaveAnimator('svg.bg');
