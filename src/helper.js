// Convert degrees to radians.
export function toDegrees(angle) {
  return angle * (Math.PI / 180);
}

// Get the (x, y) coordinates of the blob based on the rotation
// https://en.wikipedia.org/wiki/Circle#Equations
export function getXY(nth, length) {
  const app = document.getElementById('app').getBoundingClientRect();
  const circle = document.querySelector('.blob--main').getBoundingClientRect();
  const r = 150;
  // This is the starting angle
  let theta = -60;
  theta += ((120 / (length - 1)) * (nth - 1));
  const cords = {
    x: (r * Math.sin(toDegrees(theta))) + ((circle.width / 2) + (circle.left - app.left)),
    y: (r * Math.cos(toDegrees(theta))) + ((circle.height / 2) + (circle.top - app.top)),
  };

  return cords;
}

