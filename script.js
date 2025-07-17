// Grab DOM elements for interaction
const bookListEl = document.getElementById("book-list");
const searchEl = document.getElementById("search");
const toggleModeBtn = document.getElementById("toggle-mode");
const reviewSection = document.getElementById("review-section");
const reviewTitle = document.getElementById("review-title");
const reviewList = document.getElementById("review-list");
const reviewForm = document.getElementById("review-form");
const reviewInput = document.getElementById("review-input");

let books = []; // Will store book data
let selectedBook = null; // Holds the currently selected book

// Event Listeners
document.addEventListener("DOMContentLoaded", fetchBooks); // Load books when page loads
searchEl.addEventListener("input", handleSearch); // Search as user types
toggleModeBtn.addEventListener("click", () => document.body.classList.toggle("dark")); // Toggle dark mode
reviewForm.addEventListener("submit", submitReview); // Handle review form submission

// Fetch books from API
function fetchBooks() {
  fetch("http://localhost:3000/books")
    .then(res => res.json())
    .then(data => {
      books = data;
      renderBooks(books); // Show books on page
    });
}

// Display all book cards
function renderBooks(bookArray) {
  bookListEl.innerHTML = "";
  bookArray.forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p>${book.description}</p>
    `;
    card.addEventListener("click", () => showReviews(book)); // Show reviews on click
    bookListEl.appendChild(card);
  });
}

// Filter books based on search input
function handleSearch() {
  const query = searchEl.value.toLowerCase();
  const filtered = books.filter(book =>
    book.title.toLowerCase().includes(query) ||
    book.author.toLowerCase().includes(query)
  );
  renderBooks(filtered); // Show filtered books
}

// Show selected book’s reviews
function showReviews(book) {
  selectedBook = book;
  reviewSection.classList.remove("hidden"); // Make review section visible
  reviewTitle.textContent = `Reviews for "${book.title}"`; // Set section title
  renderReviews(book.reviews || []); // Render reviews or empty
}

// Display list of reviews
function renderReviews(reviews) {
  reviewList.innerHTML = "";
  reviews.forEach(review => {
    const li = document.createElement("li");
    li.textContent = review;
    reviewList.appendChild(li);
  });
}

// Handle review submission
function submitReview(e) {
  e.preventDefault(); // Prevent page reload
  const newReview = reviewInput.value.trim();
  if (!newReview) return;

  selectedBook.reviews = selectedBook.reviews || [];
  selectedBook.reviews.push(newReview); // Add review to book

  // Update on server (db.json)
  fetch(`http://localhost:3000/books/${selectedBook.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ reviews: selectedBook.reviews })
  })
    .then(res => res.json())
    .then(updatedBook => {
      reviewInput.value = ""; // Clear input
      renderReviews(updatedBook.reviews); // Show updated reviews
    });
}
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
