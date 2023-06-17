const cart = {
  items: [],
  addItem(book) {
    const existingItem = this.items.find(
      (item) => item.book.title === book.title
    );
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.items.push({ book, quantity: 1 });
    }
  },
  removeItem(book) {
    const existingItem = this.items.find(
      (item) => item.book.title === book.title
    );
    if (existingItem) {
      existingItem.quantity--;
      if (existingItem.quantity === 0) {
        const index = this.items.indexOf(existingItem);
        this.items.splice(index, 1);
      }
    }
  },
  getItems() {
    return this.items;
  },
  getTotalQuantity() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  },
};

// Function to perform book search
function searchBooks(event) {
  event.preventDefault();

  // Get the search query
  const searchQuery = document.querySelector(
    '.search-bar input[type="text"]'
  ).value;

  // Perform book search using Google Books API
  fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&key=AIzaSyDCaMHS-cJPDc2bHtOIFs0WgnWw_LbDKfg`
  )
    .then((response) => response.json())
    .then((data) => {
      const searchResults = data.items.map((item) => {
        const book = {
          title: item.volumeInfo.title,
          authors: item.volumeInfo.authors
            ? item.volumeInfo.authors.join(", ")
            : "Unknown",
          publisher: item.volumeInfo.publisher
            ? item.volumeInfo.publisher
            : "Unknown",
          publishedDate: item.volumeInfo.publishedDate
            ? item.volumeInfo.publishedDate.substring(0, 4)
            : "Unknown",
          description: item.volumeInfo.description
            ? item.volumeInfo.description
            : "No description available",
          pageCount: item.volumeInfo.pageCount
            ? item.volumeInfo.pageCount
            : "Unknown",
          categories: item.volumeInfo.categories
            ? item.volumeInfo.categories.join(", ")
            : "Unknown",
          availability:
            item.saleInfo.saleability === "FOR_SALE"
              ? "Available"
              : "Not available",
          thumbnail: item.volumeInfo.imageLinks
            ? item.volumeInfo.imageLinks.thumbnail
            : "",
        };
        return book;
      });

      displayBookResults(searchResults);
    })
    .catch((error) => {
      console.log("Error fetching search results:", error);
    });
}

// Function to display book search results
function displayBookResults(books) {
  const bookList = document.querySelector(".book-list");
  bookList.innerHTML = "";

  books.forEach((book) => {
    const li = document.createElement("li");
    const bookDataAttr = encodeURIComponent(JSON.stringify(book));
    li.innerHTML = `
      <button class="add-to-cart-btn" data-book='${JSON.stringify(
        book
      )}'>Add to Cart</button>
      <div class="book-image">
          <img src="${book.thumbnail}" alt="Book Cover" loading="lazy">
        </div>
        <div class="book-info">
          <h3>${book.title}</h3>
          <p>Authors: ${book.authors}</p>
          <p>Publisher: ${book.publisher}</p>
          <p>Published Date: ${book.publishedDate}</p>
          <p>Description: ${book.description}</p>
          <p>Page Count: ${book.pageCount}</p>
          <p>Categories: ${book.categories}</p>
          <p class="availability">Available: ${book.availability}</p>
        </div>
        
      `;
    bookList.appendChild(li);
  });
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", handleAddToCart);
  });
}

const searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", searchBooks);
