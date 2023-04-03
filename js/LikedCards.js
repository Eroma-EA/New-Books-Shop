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
      return (Accounts = []);
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
        location.href = `signIn.html`;
      });
    }
  } else {
    UlNav.children[5].style.display = "block";
  }

  Account = Accounts.find((A) => A.Active == true);

  if (Account !== undefined) {
    let books = localStorage.getItem(`${Account.Mail}`);
    books = JSON.parse(books);
    if (books !== null) {
      //innerHTML Grid
      let DivGrid = document.querySelector(".gridCard");
      DivGrid.innerHTML = books.map((book) => bookgrid(book)).join("");
      RaitingStars(books);
    }
  } else {
    let books = localStorage.getItem("localBooks");
    if (books !== null) {
      books = JSON.parse(books);
      //innerHTML Grid
      let DivGrid = document.querySelector(".gridCard");
      DivGrid.innerHTML = books.map((book) => bookgrid(book)).join("");
      RaitingStars(books);
    }
  }

  //Rating Stars & basket & cards html

  addBasketBooks();
  addDeleteCards();
  AnimationBasket();
  AnimationLiked();

  CardPage();
}

//Card Page HTML
function CardPage() {
  let imgCards = document.querySelectorAll(".img");
  imgCards.forEach((img) => {
    img.addEventListener("click", clickIMGcardPage);
  });
}
function clickIMGcardPage(e) {
  let id = e.target.id;
  location.href = `../html/card.html?id=${id}`;
}
//BasketBooks
function addBasketBooks() {
  let basketBTN = document.querySelectorAll(".fa-cart-shopping");
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

//Delete liked Cards
function addDeleteCards() {
  let DeleteBTN = document.querySelectorAll(".fa-circle-xmark");
  DeleteBTN.forEach((Delete) => {
    Delete.addEventListener("click", clickDelete);
  });
}

function clickDelete(e) {
  let Account = Accounts();
  if (Account !== undefined) {
    let AccountLocal = localStorage.getItem(`${Account.Mail}`);
    AccountLocal = JSON.parse(AccountLocal);
    let likebtn = e.target;
    likebtn.style.scale = 0.9;
    setTimeout(() => {
      likebtn.style.scale = 1;
    }, 300);
    let idSeria = AccountLocal.find(
      (i) => i.idSeria == likebtn.closest(".card").id
    );

    let localAccount = localStorage.getItem(`${Account.Mail}`);
    localAccount = JSON.parse(localAccount);
    localAccount = localAccount.filter(
      (Obj) => Obj.idSeria !== idSeria.idSeria
    );
    localStorage.setItem(`${Account.Mail}`, JSON.stringify(localAccount));
    likebtn.parentElement.remove();
    AnimationLiked();
  } else {
    let books = localStorage.getItem("localBooks");
    books = JSON.parse(books);
    let likebtn = e.target;
    likebtn.style.scale = 0.9;
    setTimeout(() => {
      likebtn.style.scale = 1;
    }, 300);
    let idSeria = books.find((i) => i.idSeria == likebtn.closest(".card").id);

    let localBooks = localStorage.getItem("localBooks");
    localBooks = JSON.parse(localBooks);
    localBooks = localBooks.filter((Obj) => Obj.idSeria !== idSeria.idSeria);
    localStorage.setItem("localBooks", JSON.stringify(localBooks));
    likebtn.parentElement.remove();
    AnimationLiked();
  }
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
              <div class="card" id="${
                book.idSeria
              }"><i class="fa-sharp fa-solid fa-circle-xmark"></i>
                  <img class="img" src="../img/books/b${
                    book.idSeria
                  }.jpg" id="${book.idSeria}">
                  <p>${book.name}</p>
                  <p class="price">Price: ${book.price}₸</p>
                  <div>
                  <p class="Rating">      
                      <i class='fa-solid fa-star' ></i> 
                      <i class='fa-solid fa-star' ></i>
                      <i class='fa-solid fa-star' ></i>
                      <i class='fa-solid fa-star' ></i>
                      <i class='fa-solid fa-star' ></i>
                             
                  </p>
                  <span>
                  <i class="fa-solid fa-cart-shopping" style="color:${colorBasket(
                    book
                  )}"></i> </span>
                  </div>
              </div>
      `;
}

//color Basket card
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
