const bookForm = document.getElementById("book-form");
const bookList = document.getElementById("book-list");

const nameInput = document.getElementById("title-input");
const authorInput = document.getElementById("author-input");
const genreInput = document.getElementById("genre-input");
const scoreInput = document.getElementById("score-input");
const subimtBtn = document.getElementById("submit-input");

const filterSelect = document.getElementById("filter-select");
const sortSelect = document.getElementById("sort-select");
const invertInput = document.getElementById("invert-input");

const clearBtn = document.getElementById("clear-btn");

const genres = [];
Array.from(genreInput.children).forEach((genre) => genres.push(genre.value));

const books = [];
let currentBooks = [];

loadBooks();
currentBooks = [...books]; // !make unique!
renderBooks(currentBooks);

document.addEventListener("DOMContentLoaded", () => {
  sortSelect.value = "time";
  filterSelect.value = "none";
  genreInput.value = "other";
  sortBooks();
});

bookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addBook({
    name: nameInput.value,
    author: authorInput.value,
    genre: genreInput.value,
    score: scoreInput.value,
  });
  nameInput.value = "";
  authorInput.value = "";
  genreInput.value = "other";
  scoreInput.value = "";
  currentBooks = [...books];
  sortBooks();
  renderBooks(currentBooks);
});

clearBtn.addEventListener("click", () => {
  const confirmClear = window.confirm(
    "Are you sure you want to delete the entire list?"
  );
  if (!confirmClear) {
    return;
  } else {
    books.length = 0;
    currentBooks.length = 0;
    localStorage.removeItem("books");
    renderBooks(currentBooks);
  }
});

filterSelect.addEventListener("change", filterBooks);
invertInput.addEventListener("change", sortBooks);
sortSelect.addEventListener("change", sortBooks);

function filterBooks() {
  const selected = filterSelect.value;
  if (selected === "none") {
    currentBooks = [...books];
  } else {
    currentBooks = books.filter((book) => book.genre === selected);
  }
  sortBooks();
}

function sortBooks() {
  const option = sortSelect.value;
  const inverted = invertInput.checked;

  if (option === "score") {
    currentBooks.sort((a, b) =>
      inverted ? a.score - b.score : b.score - a.score
    );
  } else if (option === "time") {
    currentBooks.sort((a, b) => (inverted ? a.time - b.time : b.time - a.time));
  } else if (option === "name") {
    currentBooks.sort((a, b) =>
      inverted ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
    );
  }

  renderBooks(currentBooks);
}

function renderBooks(arr) {
  bookList.replaceChildren();
  for (const book of arr) {
    try {
      bookList.append(createBookItem(book));
    } catch (err) {
      console.log("We got an error!", err);
    }
  }
}

function saveBooks() {
  localStorage.setItem("books", JSON.stringify(books));
}

function loadBooks() {
  const stored = localStorage.getItem("books");
  if (stored) {
    const parsed = JSON.parse(stored);
    books.push(...parsed);
  }
}

function addBook({ name, author, genre, score }) {
  if (!name || name.length <= 1) return;
  const newBook = { name, author, genre, score, time: Date.now() };
  books.push(newBook);
  saveBooks();
}

function createBookItem(book) {
  const itemCont = document.createElement("article");
  itemCont.classList.add("book-item");

  const textCont = document.createElement("div");
  textCont.classList.add("text-cont");

  const itemScore = document.createElement("input");
  itemScore.classList.add("book-score");
  itemScore.type = "number";
  itemScore.value = book.score;
  itemScore.placeholder = "00";
  itemScore.min = "0";
  itemScore.max = "10";

  const itemName = document.createElement("input");
  itemName.classList.add("book-name");
  itemName.type = "text";
  itemName.value = book.name;

  const itemAuthor = document.createElement("input");
  itemAuthor.classList.add("book-author");
  itemAuthor.type = "text";
  itemAuthor.value = book.author;

  const itemGenre = document.createElement("select");
  itemGenre.classList.add("book-genre");

  for (let genre of genres) {
    const genreOption = document.createElement("option");
    genreOption.value = genre;
    genreOption.textContent = genre.charAt(0).toUpperCase() + genre.slice(1);
    itemGenre.append(genreOption);
  }
  itemGenre.value = book.genre;

  itemName.addEventListener("input", () => {
    book.name = itemName.value;
    saveBooks();
  });

  itemAuthor.addEventListener("input", () => {
    book.author = itemAuthor.value;
    saveBooks();
  });

  itemScore.addEventListener("input", () => {
    if (itemScore.value > 10) {
      book.score = "10";
    } else if (itemScore.value <= 0) {
      book.score = "";
    } else {
      book.score = itemScore.value;
    }
    saveBooks();
  });

  itemGenre.addEventListener("change", () => {
    book.genre = itemGenre.value;
    saveBooks();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("book-delete");
  deleteBtn.textContent = "X";
  deleteBtn.addEventListener("click", () => {
    const idx = books.findIndex((item) => item.time === book.time);
    if (idx !== -1) {
      books.splice(idx, 1);
      saveBooks();
      currentBooks = [...books];
      sortBooks();
    }
  });

  textCont.append(itemName, itemAuthor, itemGenre);
  itemCont.append(textCont, itemScore, deleteBtn);

  return itemCont;
}
