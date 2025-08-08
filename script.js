const GRID_SIZE = 100; // Limit to 100x100 for testing performance
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
        window.location = data.url;
      } else {
        alert("Checkout session failed");
      }
    })
    .catch(err => {
      console.error("Fetch error:", err);
      alert("Network error.");
    });
  });

  board.appendChild(square);
}

let scale = 1;
function zoom(factor) {
  scale *= factor;
  board.style.transform = `scale(${scale})`;
}