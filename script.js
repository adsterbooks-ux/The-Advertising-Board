let scale = 1;
const board = document.getElementById('board');

// Function to zoom the board
function zoom(factor) {
  scale *= factor;
  board.style.transform = `scale(${scale})`;  // Apply scaling transformation
  board.style.transformOrigin = 'center'; // Make sure it scales from the center
}

// Add square generation code if missing (make sure the squares are rendered)
const GRID_SIZE = 100; // Adjust for the number of squares (change for testing smaller grid)

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
        window.location = data.url;  // Redirect to Stripe checkout page
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