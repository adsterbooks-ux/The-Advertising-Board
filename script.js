let scale = 1;  // Initial zoom level (full grid size)
const board = document.getElementById('board');

// Initially, show 50x50 grid (total 2,500 squares)
let gridSize = 50;  // 50x50 grid (total 2,500 squares)

// Mock data for leaderboard (In a real-world scenario, this would come from your database)
const leaderboard = [
  { name: 'User 1', squaresBought: 150 },
  { name: 'User 2', squaresBought: 120 },
  { name: 'User 3', squaresBought: 100 },
  { name: 'User 4', squaresBought: 80 },
  { name: 'User 5', squaresBought: 60 }
];

// Function to update leaderboard
function updateLeaderboard() {
  const leaderboardList = document.getElementById('leaderboard-list');
  leaderboardList.innerHTML = ''; // Clear previous leaderboard

  // Check if leaderboard data is available
  if (leaderboard.length === 0) {
    leaderboardList.innerHTML = "<li>No top buyers yet!</li>";
  } else {
    leaderboard.forEach((user, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = `${index + 1}. ${user.name} - ${user.squaresBought} squares`;
      leaderboardList.appendChild(listItem);
    });
  }
}

// Call function to display leaderboard on page load
updateLeaderboard();

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

// Function to zoom the board
function zoom(factor) {
  scale *= factor;
  board.style.transform = `scale(${scale})`;  // Apply scaling transformation
  board.style.transformOrigin = 'center'; // Make sure it scales from the center

  // Adjust grid size based on zoom level
  if (scale < 0.5) {
    gridSize = Math.max(50, gridSize - 10);  // Show fewer squares when zooming in
  } else if (scale > 0.5) {
    gridSize = Math.min(100, gridSize + 10);  // Show more squares when zooming out
  }

  generateGrid();  // Re-generate the grid based on the new gridSize
}

// Initial grid generation (2,500 squares)
generateGrid();