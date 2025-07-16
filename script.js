const bookListEl = document.getElementById("book-list");
const searchEl = document.getElementById("search");
const toggleModeBtn = document.getElementById("toggle-mode");
const reviewSection = document.getElementById("review-section");
const reviewTitle = document.getElementById("review-title");
const reviewList = document.getElementById("review-list");
const reviewForm = document.getElementById("review-form");
const reviewInput = document.getElementById("review-input");

let books = [];
let selectedBook = null;

document.addEventListener("DOMContentLoaded", fetchBooks);
searchEl.addEventListener("input", handleSearch);
toggleModeBtn.addEventListener("click", () => document.body.classList.toggle("dark"));
reviewForm.addEventListener("submit", submitReview);

function fetchBooks() {
  fetch("http://localhost:3000/books")
    .then(res => res.json())
    .then(data => {
      books = data;
      renderBooks(books);
    });
}

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
    card.addEventListener("click", () => showReviews(book));
    bookListEl.appendChild(card);
  });
}

function handleSearch() {
  const query = searchEl.value.toLowerCase();
  const filtered = books.filter(book =>
    book.title.toLowerCase().includes(query) ||
    book.author.toLowerCase().includes(query)
  );
  renderBooks(filtered);
}

function showReviews(book) {
  selectedBook = book;
  reviewSection.classList.remove("hidden");
  reviewTitle.textContent = `Reviews for "${book.title}"`;
  renderReviews(book.reviews || []);
}

function renderReviews(reviews) {
  reviewList.innerHTML = "";
  reviews.forEach(review => {
    const li = document.createElement("li");
    li.textContent = review;
    reviewList.appendChild(li);
  });
}

function submitReview(e) {
  e.preventDefault();
  const newReview = reviewInput.value.trim();
  if (!newReview) return;

  selectedBook.reviews = selectedBook.reviews || [];
  selectedBook.reviews.push(newReview);

  fetch(`http://localhost:3000/books/${selectedBook.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ reviews: selectedBook.reviews })
  })
    .then(res => res.json())
    .then(updatedBook => {
      reviewInput.value = "";
      renderReviews(updatedBook.reviews);
    });
}
