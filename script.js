document.addEventListener("DOMContentLoaded", () => {
  fetchBooks(); // Load books when page loads

  document.getElementById("toggle-mode").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode"); // Toggle dark/light theme
  });

  document.getElementById("review-form").addEventListener("submit", handleReviewSubmit); // Handle review form
  document.getElementById("search").addEventListener("input", handleSearch); // Handle search input
});

function fetchBooks() {
  fetch("http://localhost:3000/books") // Get books from json-server
    .then((res) => res.json())
    .then((books) => {
      renderBooks(books); // Render book cards
    });
}

function renderBooks(books) {
  const bookList = document.getElementById("book-list");
  bookList.innerHTML = ""; // Clear existing books

  books.forEach((book) => {
    const card = document.createElement("div");
    card.className = "book-card"; // Add styling class

    card.innerHTML = `
      <h3>${book.title}</h3>
      <p><em>${book.author}</em></p>
      <p>${book.description}</p>
      <ul>
        ${book.reviews.map((r) => `<li>${r}</li>`).join("")} <!-- Render reviews -->
      </ul>
    `;

    bookList.appendChild(card); // Add card to DOM
  });
}

function handleReviewSubmit(e) {
  e.preventDefault(); // Prevent page reload

  const input = document.getElementById("review-input");
  const reviewText = input.value;

  fetch("http://localhost:3000/books/1") // Assuming updating first book
    .then((res) => res.json())
    .then((book) => {
      const updatedReviews = [...book.reviews, reviewText]; // Add new review
      return fetch(`http://localhost:3000/books/1`, {
        method: "PATCH", // Update book data
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reviews: updatedReviews }) // Send updated reviews
      });
    })
    .then(() => {
      input.value = ""; // Clear input field
      fetchBooks(); // Reload book list to show new review
    });
}

function handleSearch(e) {
  const query = e.target.value.toLowerCase(); // Get search query

  fetch("http://localhost:3000/books") // Fetch all books again
    .then((res) => res.json())
    .then((books) => {
      const filtered = books.filter((book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
      ); // Filter by title or author

      renderBooks(filtered); // Show matching results
    });
}
