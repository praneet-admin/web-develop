// ============================================================
//  BUS PASSENGER COUNTER
//  Concepts: Variables, Functions, DOM Selection,
//            DOM Manipulation, Event Listeners,
//            Conditional Logic
// ============================================================


// --- 1. VARIABLES & STATE ---
// const = never changes | let = changes over time

const MAX_SEATS = 50;          // bus capacity — fixed, so const
let passengerCount = 0;        // current passengers — changes, so let


// --- 2. DOM SELECTION ---
// Grab each element once and store it

const countEl  = document.getElementById("passengerCount");
const statusEl = document.getElementById("statusText");
const seatsEl  = document.getElementById("seatsLeft");
const boardBtn = document.getElementById("boardBtn");
const leaveBtn = document.getElementById("leaveBtn");
const resetBtn = document.getElementById("resetBtn");


// --- 3. FUNCTIONS ---

// Updates the screen to match the current passengerCount
function updateDisplay() {

  // DOM Manipulation — change text on screen
  countEl.textContent = passengerCount;
  seatsEl.textContent = MAX_SEATS - passengerCount;

  // Conditional Logic — decide what status to show
  if (passengerCount === MAX_SEATS) {
    statusEl.textContent = "Bus Full!";
    statusEl.classList.add("full");
    statusEl.classList.remove("available");
  } else {
    statusEl.textContent = "Seats Available";
    statusEl.classList.add("available");
    statusEl.classList.remove("full");
  }

  // Conditional Logic — disable buttons at the limits
  boardBtn.disabled = (passengerCount === MAX_SEATS);
  leaveBtn.disabled = (passengerCount === 0);
}

// Adds one passenger (only if bus is not full)
function boardPassenger() {
  if (passengerCount < MAX_SEATS) {
    passengerCount = passengerCount + 1;
    updateDisplay();
  }
}

// Removes one passenger (only if count is above 0)
function leavePassenger() {
  if (passengerCount > 0) {
    passengerCount = passengerCount - 1;
    updateDisplay();
  }
}

// Resets everything back to 0
function resetCounter() {
  passengerCount = 0;
  updateDisplay();
}


// --- 4. EVENT LISTENERS ---
// Listen for a click on each button, then call its function

boardBtn.addEventListener("click", boardPassenger);
leaveBtn.addEventListener("click", leavePassenger);
resetBtn.addEventListener("click", resetCounter);


// --- 5. FIRST RUN ---
// Call updateDisplay once so the page looks correct on load
updateDisplay();
