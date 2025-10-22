const bookForm = document.getElementById("book-form");
const bookList = document.getElementById("book-list");

const nameInput = document.getElementById("title-input");
const authorInput = document.getElementById("author-input");
const genreInput = document.getElementById("genre-input");
const scoreInput = document.getElementById("score-input");
const subimtBtn = document.getElementById("submit-input");

const sortInput = document.getElementById("sort-input");
const clearBtn = document.getElementById("clear-btn");

const genres = [];
Array.from(genreInput.children).forEach((genre) => genres.push(genre.value));

const books = [];

loadBooks();
renderBooks();

document.addEventListener("DOMContentLoaded", () => {
  sortInput.value = "time-desc";
  genreInput.value = "other";
  books.sort((t1, t2) => t1.time - t2.time);
  renderBooks();
});

bookForm.addEventListener("submit", (e) => {
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

  renderBooks();
});

clearBtn.addEventListener("click", () => {
  books.length = 0;
  localStorage.clear();
  renderBooks();
});

sortInput.addEventListener("change", (e) => {
  const option = e.target.value;

  if (option === "score") {
    books.sort((t1, t2) => t2.score - t1.score);
  }

  if (option === "time-desc") {
    books.sort((t1, t2) => t1.time - t2.time);
  } else if (option === "time-asc") {
    books.sort((t1, t2) => t2.time - t1.time);
  }

  renderBooks();
});

function renderBooks() {
  bookList.replaceChildren();

  for (const book of books) {
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

  const newBook = {
    name,
    author,
    genre,
    score,
    time: Date.now(), // use this as unique identifier
  };

  books.push(newBook);
  saveBooks();
}

function createBookItem(book) {
  const itemCont = document.createElement("article");
  itemCont.classList.add("book-item");

  const textCont = document.createElement("div");
  textCont.classList.add("text-cont");

  // Score input
  const itemScore = document.createElement("input");
  itemScore.classList.add("book-score");
  itemScore.type = "number";
  itemScore.value = book.score;
  itemScore.placeholder = "00";
  itemScore.min = "0";
  itemScore.max = "10";

  // Name input
  const itemName = document.createElement("input");
  itemName.classList.add("book-name");
  itemName.type = "text";
  itemName.value = book.name;

  // Author input
  const itemAuthor = document.createElement("input");
  itemAuthor.classList.add("book-author");
  itemAuthor.type = "text";
  itemAuthor.value = book.author;

  // Genre select
  const itemGenre = document.createElement("select");
  itemGenre.classList.add("book-genre");

  for (let genre of genres) {
    const genreOption = document.createElement("option");
    genreOption.value = genre;
    genreOption.textContent = genre.charAt(0).toUpperCase() + genre.slice(1);
    itemGenre.append(genreOption);
  }
  itemGenre.value = book.genre;

  // Auto-save
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

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("book-delete");
  deleteBtn.textContent = "X";
  deleteBtn.addEventListener("click", () => {
    const idx = books.findIndex((item) => item.time === book.time);
    if (idx !== -1) {
      books.splice(idx, 1);
      saveBooks();
      renderBooks();
    }
  });

  textCont.append(itemName, itemAuthor, itemGenre);
  itemCont.append(textCont, itemScore, deleteBtn);

  return itemCont;
}
