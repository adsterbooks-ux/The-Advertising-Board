let scale = 1;  // Initial zoom level (full grid size)
const board = document.getElementById('board');

// Initially, show 50x50 grid (total 2,500 squares)
let gridSize = 50;  // 50x50 grid (total 2,500 squares)

// Function to generate the grid based on gridSize
function generateGrid() {
  board.innerHTML = '';  // Clear the existing grid

  for (let i = 0; i < gridSize * gridSize; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.dataset.index = i;

    // Temporary: Just create squares without expiry for now
    const countdownElement = document.createElement('div');
    countdownElement.classList.add('countdown');
    countdownElement.innerText = "Available";
    square.appendChild(countdownElement);

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

// Initial grid generation (2,500 squares)
generateGrid();