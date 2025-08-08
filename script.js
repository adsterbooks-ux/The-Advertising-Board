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

  leaderboard.forEach((user, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${index + 1}. ${user.name} - ${user.squaresBought} squares`;
    leaderboardList.appendChild(listItem);
  });
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

    // Fetch purchase info for this square from the database (e.g., expiry date)
    const expiryDate = getExpiryDate(i); // This function fetches expiry from the database
    
    // Log expiry date to debug
    console.log(`Square ${i}: Expiry Date - ${expiryDate}`);

    const timeRemaining = calculateTimeRemaining(expiryDate); // Calculate remaining time

    // Add countdown timer or message
    const countdownElement = document.createElement('div');
    countdownElement.classList.add('countdown');
    countdownElement.innerText = timeRemaining;
    square.appendChild(countdownElement);

    // If expired, show the "Re-buy" button
    if (timeRemaining === "Expired") {
      const reBuyButton = document.createElement('button');
      reBuyButton.innerText = "Re-buy";
      reBuyButton.addEventListener('click', () => {
        // Handle re-buy logic, such as sending the user to checkout
        reBuySquare(i);
      });
      square.appendChild(reBuyButton);
    }

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

// Calculate remaining time for countdown
function calculateTimeRemaining(expiryDate) {
  const now = new Date();
  const timeDiff = expiryDate - now;
  
  if (timeDiff <= 0) {
    return "Expired";
  }

  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m remaining`;
}

// Fetch expiry date for a square from the backend
function getExpiryDate(squareId) {
  // Example of retrieving data from the database (replace with your logic)
  const expiryDate = fetchExpiryDateFromDatabase(squareId);  // Mocked database call
  if (!expiryDate) {
    console.error(`No expiry date found for square ${squareId}`);
    return new Date();  // Return current date if no expiry date is found
  }
  return new Date(expiryDate);
}

// Re-buy the square (reset expiry date and purchase time)
function reBuySquare(squareId) {
  // Update expiry date in the database (replace with actual logic)
  const newExpiryDate = new Date();
  newExpiryDate.setDate(newExpiryDate.getDate() + 7);  // Add 7 days

  // Update the backend with the new expiry date
  updateSquareExpiryInDatabase(squareId, newExpiryDate);  // Mocked update function

  // Re-generate the grid after the square is re-bought
  generateGrid();
}

// Mocked database update function (replace with actual implementation)
function updateSquareExpiryInDatabase(squareId, newExpiryDate) {
  console.log(`Square ${squareId} expiry updated to: ${newExpiryDate}`);
}

// Initial grid generation (2,500 squares)
generateGrid();