// Countdown Timer
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

// Squares Bought (static example)
const squareCount = 500;  // Replace this with dynamic fetching
document.getElementById('square-count').innerText = squareCount;

// Night Mode Toggle
const toggleButton = document.getElementById('night-mode-toggle');
toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('night-mode');
});