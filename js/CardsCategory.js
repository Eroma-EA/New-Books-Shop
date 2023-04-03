async function fetchData() {
  try {
    let res = await fetch("../json/books.json");
    let books = await res.json();
    return books;
  } catch (e) {
    console.log(e);
  }
}
async function fetchAccount() {
  try {
    let res = localStorage.getItem("Accounts");
    let Accounts = await JSON.parse(res);
    if (res == null) {
      Accounts = [{ Mail: "local", Active: false }];
      localStorage.setItem("Accounts", JSON.stringify(Accounts));
      return Accounts;
    } else {
      return Accounts;
    }
  } catch (e) {
    console.log(e);
  }
}
function Accounts() {
  let AccountLocal = localStorage.getItem("Accounts");
  AccountLocal = JSON.parse(AccountLocal);
  if (AccountLocal !== null) {
    let Account = AccountLocal.find((A) => A.Active == true);
    return Account;
  }
}
//Cards grid  //////////////////////////////////
async function cardsGrid() {
  let books = await fetchData();
  let Accounts = await fetchAccount();
  let Account = {};
  let UlNav = document.querySelector("ul");
  if (Accounts.length !== 0) {
    Account = Accounts.find((Account) => Account.Active == true);
    if (Account !== undefined) {
      UlNav.innerHTML =
        UlNav.innerHTML +
        `<a href="##" class="Account"><p style="margin-left:50px;">${Account.Mail}</p></a><a href="##" class="SignOut"><p>Sign Out</p></a>`;
      UlNav.children[5].style.display = "none";
      let SignOut = document.querySelector(".SignOut");
      SignOut.addEventListener("click", () => {
        Accounts.find((Account) => {
          if (Account.Active == true) {
            Account.Active = false;
          }
        });
        localStorage.setItem("Accounts", JSON.stringify(Accounts));
        location.href = `./html/signIn.html`;
      });
    }
  } else {
    UlNav.children[5].style.display = "block";
  }

  //innerHTML Grid
  let DivGrid = document.querySelector(".gridCard");
  DivGrid.innerHTML = books.map((book) => bookgrid(book)).join("");
  //Category innerHTML UL
  let Category = document.querySelector(".Category");
  let liArr = [];
  for (let i = 0; i < books.length; i++) {
    if (liArr.includes(books[i].genre)) {
    } else {
      liArr.push(books[i].genre);
    }
  }

  Category.innerHTML =
    Category.innerHTML +
    liArr
      .map(
        (genre) =>
          ` <li><a href="##" class="genre ${genre}"><p>${genre}</p></a></li>`
      )
      .join("");
  //Genre Filter
  FilterGenreBooks();
  //Search books
  SearchBooks();

  let url = new URL(location.href);
  if (url.searchParams.get("category") || url.searchParams.get("search")) {
    if (url.searchParams.get("search") != null) {
      let text = url.searchParams.get("search");
      books = books.filter((obj) =>
        obj.name.toLowerCase().includes(text.toLowerCase())
      );
      DivGrid.innerHTML = books.map((book) => bookgrid(book)).join("");
    } else if (url.searchParams.get("category") != "All") {
      let text = url.searchParams.get("category");
      books = books.filter((obj) => obj.genre === text);
      DivGrid.innerHTML = books.map((book) => bookgrid(book)).join("");
    }
  }
  //Rating Stars & liked & basket & cards html
  RaitingStars(books);
  addLikedBooks();
  addBasketBooks();
  CardPage();
  //Animation Navbar
  AnimationBasket();
  AnimationLiked();
}
//BasketBooks
function addBasketBooks() {
  let basketBTN = document.querySelectorAll(".fa-basket");
  basketBTN.forEach((basket) => {
    basket.addEventListener("click", clickBasketBTN);
  });
}
async function clickBasketBTN(e) {
  let books = await fetchData();
  let basketBTN = e.target;
  basketBTN.style.scale = 0.9;
  setTimeout(() => {
    basketBTN.style.scale = 1;
  }, 300);

  let idSeria = books.find((i) => i.idSeria == basketBTN.closest(".card").id);

  if (basketBTN.style.color == "white") {
    basketBTN.style.color = "rgb(111, 255, 106)";
    addBasketStorage(idSeria);
  } else {
    basketBTN.style.color = "white";
    let Account = Accounts();
    if (Account !== undefined) {
      let AccountLocal = localStorage.getItem(`Basket${Account.Mail}`);
      AccountLocal = JSON.parse(AccountLocal);
      AccountLocal = AccountLocal.filter(
        (Obj) => Obj.idSeria !== idSeria.idSeria
      );
      localStorage.setItem(
        `Basket${Account.Mail}`,
        JSON.stringify(AccountLocal)
      );
    } else {
      basketBTN.style.color = "white";
      let BooksBasket = localStorage.getItem("BooksBasket");
      BooksBasket = JSON.parse(BooksBasket);
      BooksBasket = BooksBasket.filter(
        (Obj) => Obj.idSeria !== idSeria.idSeria
      );
      localStorage.setItem("BooksBasket", JSON.stringify(BooksBasket));
    }
  }

  //Animation Navbar
  AnimationBasket();
}

function addBasketStorage(idSeria) {
  let Account = Accounts();
  if (Account !== undefined) {
    let AccountLocal = localStorage.getItem(`Basket${Account.Mail}`);
    if (AccountLocal == null) {
      AccountLocal = [];
      AccountLocal.push(idSeria);
    } else {
      AccountLocal = JSON.parse(AccountLocal);
      AccountLocal.push(idSeria);
    }
    localStorage.setItem(`Basket${Account.Mail}`, JSON.stringify(AccountLocal));
  } else {
    let BooksBasket = localStorage.getItem("BooksBasket");
    if (BooksBasket == null) {
      BooksBasket = [];
      BooksBasket.push(idSeria);
    } else {
      BooksBasket = JSON.parse(BooksBasket);
      BooksBasket.push(idSeria);
    }
    localStorage.setItem("BooksBasket", JSON.stringify(BooksBasket));
  }
}
//Likedbooks
function addLikedBooks() {
  let likeBTN = document.querySelectorAll(".fa-like");
  likeBTN.forEach((like) => {
    like.addEventListener("click", clickLikeBTN);
  });
}
async function clickLikeBTN(e) {
  let books = await fetchData();
  let likebtn = e.target;
  likebtn.style.scale = 0.9;
  setTimeout(() => {
    likebtn.style.scale = 1;
  }, 300);
  let idSeria = books.find((i) => i.idSeria == likebtn.closest(".card").id);

  if (likebtn.style.color == "white") {
    likebtn.style.color = "red";
    addlocalStorage(idSeria);
  } else {
    likebtn.style.color = "white";
    let Account = Accounts();
    if (Account !== undefined) {
      let AccountLocal = localStorage.getItem(`${Account.Mail}`);
      AccountLocal = JSON.parse(AccountLocal);
      AccountLocal = AccountLocal.filter(
        (Obj) => Obj.idSeria !== idSeria.idSeria
      );
      localStorage.setItem(`${Account.Mail}`, JSON.stringify(AccountLocal));
    } else {
      let localBooks = localStorage.getItem("localBooks");
      localBooks = JSON.parse(localBooks);
      localBooks = localBooks.filter((Obj) => Obj.idSeria !== idSeria.idSeria);
      localStorage.setItem("localBooks", JSON.stringify(localBooks));
    }
  }

  //AnimationLiked
  AnimationLiked();
}
function addlocalStorage(idSeria) {
  let Account = Accounts();
  if (Account !== undefined) {
    let AccountLocal = localStorage.getItem(`${Account.Mail}`);
    if (AccountLocal == null) {
      AccountLocal = [];
      AccountLocal.push(idSeria);
    } else {
      AccountLocal = JSON.parse(AccountLocal);
      AccountLocal.push(idSeria);
    }
    localStorage.setItem(`${Account.Mail}`, JSON.stringify(AccountLocal));
  } else {
    let localBooks = localStorage.getItem("localBooks");
    if (localBooks == null) {
      localBooks = [];
      localBooks.push(idSeria);
    } else {
      localBooks = JSON.parse(localBooks);
      localBooks.push(idSeria);
    }
    localStorage.setItem("localBooks", JSON.stringify(localBooks));
  }
}

//Filter ///////////////
function FilterGenreBooks() {
  let genres = document.querySelectorAll(".genre");
  genres.forEach((genre) => {
    genre.addEventListener("click", clickGenre);
  });
}
function clickGenre(e) {
  e.preventDefault();
  let genreName = e.currentTarget.classList.toString();
  genreName = genreName.split(" ");

  let url = new URL(location.href);
  let textURL = url.toString();
  let arr = [];
  arr = textURL.split("?");
  url = new URL(arr[0]);
  url.searchParams.set("category", genreName[1]);
  location.href = url;
}

//Search Boocs ///////////////////////////
function SearchBooks() {
  let search = document.querySelector("form");
  let text = document.querySelector("input[type='text']");
  search.addEventListener("submit", (e) => {
    e.preventDefault();
    let url = new URL(location.href);
    if (text.value != null) {
      let textURL = url.toString();
      let arr = [];
      arr = textURL.split("?");
      url = new URL(arr[0]);
      url.searchParams.set("search", text.value);
      location.href = url;
    }
  });
}

//Raiting   //////////////////////////////////////////////////////////////////////
function RaitingStars(books) {
  let star = document.querySelectorAll(".Rating");
  for (let i = 0; i < books.length; i++) {
    if (star[i].closest(".card").id == books[i].idSeria) {
      for (let j = 0; j < books[i].stars; j++) {
        star[i].children[j].style.color = "yellow";
        star[i].children[j].style.textShadow = "0px 0px 2px black";
      }
    }
  }
}

//Cards book
function bookgrid(book) {
  return `
            <div class="card" id="${book.idSeria}">
                <img class="img" src="../img/books/b${book.idSeria}.jpg" id="${
    book.idSeria
  }">
                <p>${book.name}</p>
                <p class="price">Price: ${book.price}₸</p>
                <div>
                <p class="Rating">      
                    <i class='fa-solid fa-star' ></i> 
                    <i class='fa-solid fa-star' ></i>
                    <i class='fa-solid fa-star' ></i>
                    <i class='fa-solid fa-star' ></i>
                    <i class='fa-solid fa-star' ></i>
                           
                </p><span>
                <i class="fa-solid fa-cart-shopping fa-basket" style="color:${colorBasket(
                  book
                )}"></i>
                <i class="fa-solid fa-heart fa-like"  style="color:${colorLiked(
                  book
                )}"></i></span>
                </div>
            </div>
    `;
}

//color Liked cards
function colorLiked(book) {
  let Account = Accounts();
  if (Account !== undefined) {
    let AccountLocal = localStorage.getItem(`${Account.Mail}`);
    AccountLocal = JSON.parse(AccountLocal);
    if (
      AccountLocal == null ||
      !AccountLocal.find((Obj) => Obj.idSeria === book.idSeria)
    ) {
      return `white`;
    } else {
      return `red`;
    }
  } else {
    let localBooks = localStorage.getItem("localBooks");
    localBooks = JSON.parse(localBooks);

    if (
      localBooks == null ||
      !localBooks.find((Obj) => Obj.idSeria === book.idSeria)
    ) {
      return `white`;
    } else {
      return `red`;
    }
  }
}
function colorBasket(book) {
  let Account = Accounts();
  if (Account !== undefined) {
    let AccountLocal = localStorage.getItem(`Basket${Account.Mail}`);
    AccountLocal = JSON.parse(AccountLocal);
    if (
      AccountLocal == null ||
      !AccountLocal.find((Obj) => Obj.idSeria === book.idSeria)
    ) {
      return `white`;
    } else {
      return `rgb(111, 255, 106)`;
    }
  } else {
    let BooksBasket = localStorage.getItem("BooksBasket");
    BooksBasket = JSON.parse(BooksBasket);

    if (
      BooksBasket == null ||
      !BooksBasket.find((Obj) => Obj.idSeria === book.idSeria)
    ) {
      return `white`;
    } else {
      return `rgb(111, 255, 106)`;
    }
  }
}
//NAVBAR ANIMATION
function AnimationBasket() {
  let Account = Accounts();
  if (Account !== undefined) {
    let AccountLocal = localStorage.getItem(`Basket${Account.Mail}`);
    AccountLocal = JSON.parse(AccountLocal);
    let baskNav = document.querySelector(".fa-bask");
    if (AccountLocal !== null) {
      if (AccountLocal.length > 0) {
        baskNav.style.opacity = 1;
        baskNav.nextSibling.style.opacity = 1;
        baskNav.nextSibling.style.scale = 1.1;
        setTimeout(() => {
          baskNav.nextSibling.style.scale = 1.0;
        }, 100);
        if (Number(baskNav.nextSibling.innerHTML) < 9) {
          baskNav.nextSibling.style.padding = "2px 5px";
        } else {
          baskNav.nextSibling.style.padding = "2px 3px";
        }
        baskNav.nextSibling.innerHTML = AccountLocal.length;
      } else {
        baskNav.nextSibling.innerHTML = AccountLocal.length;
        baskNav.style.opacity = 0;
        baskNav.nextSibling.style.opacity = 0;
      }
    }
  } else {
    let BooksBasket = localStorage.getItem("BooksBasket");
    BooksBasket = JSON.parse(BooksBasket);
    let baskNav = document.querySelector(".fa-bask");
    if (BooksBasket !== null) {
      if (BooksBasket.length > 0) {
        baskNav.style.opacity = 1;
        baskNav.nextSibling.style.opacity = 1;
        baskNav.nextSibling.style.scale = 1.1;
        setTimeout(() => {
          baskNav.nextSibling.style.scale = 1.0;
        }, 100);
        if (Number(baskNav.nextSibling.innerHTML) < 9) {
          baskNav.nextSibling.style.padding = "2px 5px";
        } else {
          baskNav.nextSibling.style.padding = "2px 3px";
        }
        baskNav.nextSibling.innerHTML = BooksBasket.length;
      } else {
        baskNav.nextSibling.innerHTML = BooksBasket.length;
        baskNav.style.opacity = 0;
        baskNav.nextSibling.style.opacity = 0;
      }
    }
  }
}
function AnimationLiked() {
  let Account = Accounts();
  if (Account !== undefined) {
    let AccountLocal = localStorage.getItem(`${Account.Mail}`);
    AccountLocal = JSON.parse(AccountLocal);
    let baskNav = document.querySelector(".fa-liked-Nav");
    if (AccountLocal !== null) {
      if (AccountLocal.length > 0) {
        baskNav.style.opacity = 1;
        baskNav.nextSibling.style.opacity = 1;
        baskNav.nextSibling.style.scale = 1.1;
        setTimeout(() => {
          baskNav.nextSibling.style.scale = 1.0;
        }, 100);
        if (Number(baskNav.nextSibling.innerHTML) < 9) {
          baskNav.nextSibling.style.padding = "2px 5px";
        } else {
          baskNav.nextSibling.style.padding = "2px 3px";
        }
        baskNav.nextSibling.innerHTML = AccountLocal.length;
      } else {
        baskNav.nextSibling.innerHTML = AccountLocal.length;
        baskNav.style.opacity = 0;
        baskNav.nextSibling.style.opacity = 0;
      }
    }
  } else {
    let localBooks = localStorage.getItem("localBooks");
    localBooks = JSON.parse(localBooks);
    let likeNav = document.querySelector(".fa-liked-Nav");
    if (localBooks !== null) {
      if (localBooks.length > 0) {
        likeNav.style.opacity = 1;
        likeNav.nextSibling.style.opacity = 1;
        likeNav.nextSibling.style.scale = 1.1;
        setTimeout(() => {
          likeNav.nextSibling.style.scale = 1.0;
        }, 100);
        if (Number(likeNav.nextSibling.innerHTML) < 9) {
          likeNav.nextSibling.style.padding = "2px 5px";
        } else {
          likeNav.nextSibling.style.padding = "2px 3px";
        }
        likeNav.nextSibling.innerHTML = localBooks.length;
      } else {
        likeNav.nextSibling.innerHTML = localBooks.length;
        likeNav.style.opacity = 0;
        likeNav.nextSibling.style.opacity = 0;
      }
    }
  }
}
cardsGrid();
