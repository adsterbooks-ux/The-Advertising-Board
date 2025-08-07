const GRID_SIZE = 1000;
const board = document.getElementById('board');

for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
  const square = document.createElement('div');
  square.classList.add('square');
  square.dataset.index = i;
  square.addEventListener('click', () => {
    fetch('/.netlify/functions/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ square: i + 1 })
    })
    .then(res => res.json())
    .then(data => {
  if (data.url) {
    window.location = data.url;  // ✅ not using /pay/${id}
  } else {
    alert("Checkout session failed");
    console.error("Missing session URL:", data);
  }
})
  });
  board.appendChild(square);
}

let scale = 1;
function zoom(factor) {
  scale *= factor;
  board.style.transform = `scale(${scale})`;
}