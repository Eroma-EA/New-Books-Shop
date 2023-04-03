async function fetchData() {
  try {
    let res = localStorage.getItem("BooksBasket");
    let books = await JSON.parse(res);
    if (books !== null) {
      return books;
    } else {
      return (books = []);
    }
  } catch (e) {
    console.log(e);
  }
}

function Accounts() {
  let AccountLocal = localStorage.getItem("Accounts");
  if (AccountLocal !== null) {
    AccountLocal = JSON.parse(AccountLocal);
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
    let books = localStorage.getItem(`Purch${Account.Mail}`);
    if (books !== null) {
      books = JSON.parse(books);
      //innerHTML Grid
      let DivGrid = document.querySelector(".gridCard");
      DivGrid.innerHTML = books.map((book) => bookgrid(book)).join("");

      AnimationBasket();
      AnimationLiked();
      PotisitionCardsIMG();
      HoverIMG();
      CardPage();
    } else {
      AnimationBasket();
      AnimationLiked();
    }
  } else {
    let books = localStorage.getItem("Purchases");
    if (books !== null) {
      books = JSON.parse(books);
      //innerHTML Grid
      let DivGrid = document.querySelector(".gridCard");
      DivGrid.innerHTML = books.map((book) => bookgrid(book)).join("");
      //Category innerHTML UL

      //Rating Stars & basket & cards html

      AnimationBasket();
      AnimationLiked();
      PotisitionCardsIMG();
      HoverIMG();
      CardPage();
    } else {
      AnimationBasket();
      AnimationLiked();
    }
  }
}

//Hover on IMG
function HoverIMG() {
  let CardIMG = document.querySelectorAll(".cardimg");
  CardIMG.forEach((Card) => Card.addEventListener("mouseover", CardIMGHover));
  CardIMG.forEach((Card) => Card.addEventListener("mouseout", CardIMGHoverOut));
}
function CardIMGHoverOut(e) {
  if (e.target.classList == "img") {
    let booksName = e.target.closest(".card").children[2];
    booksName.innerHTML = "Books";
  }
}
async function CardIMGHover(e) {
  let books = await fetchData();
  if (e.target.classList == "img") {
    let book = books.find((book) => book.idSeria == e.target.id);
    let booksName = e.target.closest(".card").children[2];
    booksName.innerHTML = book.name;
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

//Cards book
function bookgrid(book) {
  return `
                <div class="card"><i class="fa-sharp fa-solid fa-circle-xmark"></i>
                    <div class="cardimg">${book
                      .map((b) => imgBook(b))
                      .join("")}</div>
                    <p class="BooksName">Books</p>
                    <div class="totalPay">
                    <p class="priceTotal">Total: ${TotalSumm(book)}₸</p>
                   </div>
                </div>
        `;
}

function imgBook(b) {
  return ` <img class="img" src="../img/books/b${b.idSeria}.jpg" id="${b.idSeria}">`;
}
function PotisitionCardsIMG() {
  let CardIMG = document.querySelectorAll(".cardimg");

  CardIMG.forEach((img) => {
    let a = 0;
    for (let i = 0; i < img.children.length; i++) {
      img.children[i].style.left = a + "px";
      a = a + 15;
    }
  });
}
function TotalSumm(book) {
  if (book[0].delivery == true) {
    return `${Number(book[0].total) + 1000}`;
  } else {
    return `${Number(book[0].total)}`;
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
