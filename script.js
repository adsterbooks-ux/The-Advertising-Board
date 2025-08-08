let scale = 1;
const board = document.getElementById('board');

// Grid size - Initially show a small grid
let gridSize = 10;  // Initially, show a 10x10 grid

// Function to generate the grid based on gridSize
function generateGrid() {
  board.innerHTML = '';  // Clear the existing grid
  
  for (let i = 0; i < gridSize * gridSize; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.dataset.index = i;

    // Add click event for each square
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
}

// Function to zoom the board
function zoom(factor) {
  scale *= factor;
  board.style.transform = `scale(${scale})`;  // Apply scaling transformation
  board.style.transformOrigin = 'center'; // Make sure it scales from the center

  // Adjust grid size based on zoom level
  if (scale < 1) {
    gridSize = Math.max(10, gridSize - 2);  // Show fewer squares when zooming in
  } else if (scale > 1) {
    gridSize = Math.min(50, gridSize + 2);  // Show more squares when zooming out
  }

  generateGrid();  // Re-generate the grid based on the new gridSize
}

// Initial grid generation
generateGrid();