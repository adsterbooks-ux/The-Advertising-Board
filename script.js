// Set the countdown date (e.g., 24 hours from now)
const countdownDate = new Date().getTime() + 24 * 60 * 60 * 1000; // 24-hour countdown

const x = setInterval(function() {
  const now = new Date().getTime();
  const distance = countdownDate - now;

  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("timer").innerHTML = hours + "h " + minutes + "m " + seconds + "s ";

  if (distance < 0) {
    clearInterval(x);
    document.getElementById("timer").innerHTML = "EXPIRED";
  }
}, 1000);

// Function to generate squares on the board
const GRID_SIZE = 100;  // Adjust this for the number of squares (change for testing smaller grid)

const board = document.getElementById('board');  // Get the board element

// Loop to create squares and add them to the board
for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
  const square = document.createElement('div');  // Create a new div element for each square
  square.classList.add('square');  // Add the 'square' class to it
  square.dataset.index = i;  // Store the index of the square in the data attribute

  // Add click event for each square (or any other event you want)
  square.addEventListener('click', () => {
    fetch('/.netlify/functions/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ square: i + 1 })  // Pass the square number for checkout
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

  // Append the square to the board
  board.appendChild(square);
}

// Update number of squares bought (this is a static value for now, can be fetched from Supabase)
const squareCount = 500;  // Replace with dynamic data from your database (e.g., Supabase)
document.getElementById('square-count').innerText = squareCount;