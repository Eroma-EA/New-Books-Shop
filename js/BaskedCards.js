function Accounts() {
  let AccountLocal = localStorage.getItem("Accounts");
  AccountLocal = JSON.parse(AccountLocal);
  if (AccountLocal !== null) {
    let Account = AccountLocal.find((A) => A.Active == true);
    return Account;
  }
}

//Cards grid  //////////////////////////////////
function cardsGrid() {
  let Account = Accounts();
  let LocalSave = JSON.parse(localStorage.getItem("Accounts"));
  let UlNav = document.querySelector("ul");
  if (Account !== undefined) {
    UlNav.innerHTML =
      UlNav.innerHTML +
      `<a href="##" class="Account"><p style="margin-left:50px;">${Account.Mail}</p></a><a href="##" class="SignOut"><p>Sign Out</p></a>`;
    UlNav.children[5].style.display = "none";
    let SignOut = document.querySelector(".SignOut");
    SignOut.addEventListener("click", () => {
      LocalSave.map((Account) => {
        if (Account.Active == true) {
          Account.Active = false;
        }
        return Account;
      });

      localStorage.setItem("Accounts", JSON.stringify(LocalSave));
      location.href = `signIn.html`;
    });
  } else {
    UlNav.children[5].style.display = "block";
  }

  if (Account !== undefined) {
    let books = localStorage.getItem(`Basket${Account.Mail}`);
    if (books !== null) {
      books = JSON.parse(books);

      //innerHTML Grid
      let DivGrid = document.querySelector(".gridCard");
      DivGrid.innerHTML = books.map((book) => bookgrid(book)).join("");
      //Category innerHTML UL

      //Rating Stars & basket & cards html
      RaitingStars(books);
      addDeleteCards();
      AnimationBasket();
      AnimationLiked();
      CardPage();
    } else {
      AnimationLiked();
    }
  } else {
    let books = localStorage.getItem("BooksBasket");

    if (books !== null) {
      books = JSON.parse(books);

      //innerHTML Grid
      let DivGrid = document.querySelector(".gridCard");
      DivGrid.innerHTML = books.map((book) => bookgrid(book)).join("");
      //Category innerHTML UL

      //Rating Stars & basket & cards html
      RaitingStars(books);
      addDeleteCards();
      AnimationBasket();
      AnimationLiked();
      CardPage();
    } else {
      AnimationLiked();
    }
  }
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
    let books = localStorage.getItem(`Basket${Account.Mail}`);
    books = JSON.parse(books);
    let DeleteBTN = e.target;
    DeleteBTN.style.scale = 0.9;
    setTimeout(() => {
      DeleteBTN.style.scale = 1;
    }, 300);
    let idSeria = books.find((i) => i.idSeria == DeleteBTN.closest(".card").id);

    let BooksBasket = localStorage.getItem(`Basket${Account.Mail}`);
    BooksBasket = JSON.parse(BooksBasket);
    BooksBasket = BooksBasket.filter((Obj) => Obj.idSeria !== idSeria.idSeria);
    localStorage.setItem(`Basket${Account.Mail}`, JSON.stringify(BooksBasket));
    DeleteBTN.parentElement.remove();

    AnimationBasket();
  } else {
    let books = localStorage.getItem("BooksBasket");
    books = JSON.parse(books);
    let DeleteBTN = e.target;
    DeleteBTN.style.scale = 0.9;
    setTimeout(() => {
      DeleteBTN.style.scale = 1;
    }, 300);
    let idSeria = books.find((i) => i.idSeria == DeleteBTN.closest(".card").id);

    let BooksBasket = localStorage.getItem("BooksBasket");
    BooksBasket = JSON.parse(BooksBasket);
    BooksBasket = BooksBasket.filter((Obj) => Obj.idSeria !== idSeria.idSeria);
    localStorage.setItem("BooksBasket", JSON.stringify(BooksBasket));
    DeleteBTN.parentElement.remove();

    AnimationBasket();
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
                  <div>
                  <p>${book.name}</p>
                  <div>
                  <p class="Rating">      
                      <i class='fa-solid fa-star' ></i> 
                      <i class='fa-solid fa-star' ></i>
                      <i class='fa-solid fa-star' ></i>
                      <i class='fa-solid fa-star' ></i>
                      <i class='fa-solid fa-star' ></i>
                      <input type="number" name="" id="" min="1" max="10" value="${Amount(
                        book
                      )}">       
                  </p>
                  </div></div>
                  <div class="totalPay">
                  <p class="price">Price: ${new Intl.NumberFormat(
                    "ru-RU"
                  ).format(book.price)}₸</p>
                  <p class="priceTotal">Total: ${TotalSumm(book)}₸</p>
                 </div>
              </div>
      `;
}
function TotalSumm(book) {
  if (book.amount == "") {
    return new Intl.NumberFormat("ru-RU").format(book.price);
  } else {
    return new Intl.NumberFormat("ru-RU").format(book.amount * book.price);
  }
}
function Amount(book) {
  if (book.amount == "") {
    return `1`;
  } else {
    return book.amount;
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
