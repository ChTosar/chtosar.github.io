export function typeWriterEffect(element, text, speed = 50) {
  let index = 0;

  return new Promise((resolve) => {
    function type() {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(type, speed);
      } else {
        resolve();
      }
    }

    type();
  });
}