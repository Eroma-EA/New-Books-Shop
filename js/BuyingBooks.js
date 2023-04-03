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
async function buyBooks() {
  let books = await fetchData();

  Account = Accounts();
  if (Account !== undefined) {
    let AccountLocal = localStorage.getItem(`Basket${Account.Mail}`);
    AccountLocal = JSON.parse(AccountLocal);
    let Buying = document.querySelector(".Buying");
    if (AccountLocal !== null) {
      Buying.innerHTML = AddBuying(AccountLocal);
      booksIMGpostion();
      TotalSumm();
      addbookNum(AccountLocal);
      viewDelivery();
      addByPay();
      PayPurchases();
    } else {
      Buying.innerHTML = `Basket is empty!!!`;
      Buying.style.fontSize = "25px";
    }
  } else {
    let Buying = document.querySelector(".Buying");
    if (books.length !== 0) {
      Buying.innerHTML = AddBuying(books);
      booksIMGpostion();
      TotalSumm();
      addbookNum(books);
      viewDelivery();
      addByPay();
      PayPurchases();
    } else {
      Buying.innerHTML = `Basket is empty!!!`;
      Buying.style.fontSize = "25px";
    }
  }
}
function AddBuying(books) {
  return `<div class="Buy booksName">
    <h1>Books in order</h1>
    <div>
      <div>
        ${books.map((book) => ImgBooks(book)).join("")}
      </div>
      <div>
        <p>Amount</p>
        <p class="numBook"></p>
      </div>
      <div>
        <p>Sum</p>
        <p class="totalBook"></p>
      </div>
    </div>
  </div>
  <div class="Buy delivery">
    <h1>Delivery</h1>
    <div>
        <div class="truck"><p>Delivery</p>
        <p>1 000₸</p>
        <i class="fa-solid fa-truck"></i>
        </div>
        <div class="pickup">
        <p>Pickup</p>
        <p>0₸</p>
        <i class="fa-solid fa-box"></i>
        </div>
    </div>
   </div>
  <div class="Buy payment"><h1>payment</h1>
    <div><p class="BankCard">By Card</p><p class="Cash">By Cash</p></div>
    <div class="ByCash"><img src="../img/ByCash.png"></div>
    <div class="CardBank">
    <img src="../img/CardBank.png">
    <div class="NumCard"><input type="text"><input type="text"><input type="text"><input type="text"></div>
    <input class="data" type="text">
    <input class="data2" type="text">
    <input class="CVV" type="text">
    <input class="Name" type="text"></div>
  </div>
  <div class="totalBuyPrice"><h1>Total</h1><input type="button" value="Pay"></div>`;
}

function ImgBooks(book) {
  return `<img  class="booksIMG"  id="${book.idSeria}" src="../img/Books/b${book.idSeria}.jpg" alt="" />`;
}
function booksIMGpostion() {
  let booksIMG = document.querySelectorAll(".booksIMG");
  let a = 0;
  booksIMG.forEach((img) => {
    img.style.left = a + "px";
    a = a + 5;
  });
}
function addbookNum(books) {
  let totalBook = document.querySelector(".totalBook");
  let numBook = document.querySelector(".numBook");
  let num = 0;
  let total = 0;
  let arr = [];
  books.forEach((book) => {
    num = num + Number(book.amount);
    total = total + Number(book.amount) * Number(book.price);
  });
  arr = JSON.parse(`{"total":"${total}"}`);
  books[0] = { ...books[0], ...arr };

  let Account = Accounts();
  if (Account !== undefined) {
    localStorage.setItem(`Basket${Account.Mail}`, JSON.stringify(books));
    numBook.innerHTML = num;
    totalBook.innerHTML = new Intl.NumberFormat("ru-RU").format(total) + "₸";
    totalBuyPrice(total);
  } else {
    localStorage.setItem("BooksBasket", JSON.stringify(books));
    numBook.innerHTML = num;
    totalBook.innerHTML = new Intl.NumberFormat("ru-RU").format(total) + "₸";
    totalBuyPrice(total);
  }
}
function totalBuyPrice(total) {
  let Account = Accounts();
  if (Account !== undefined) {
    let books = localStorage.getItem(`Basket${Account.Mail}`);
    books = JSON.parse(books);
    let totalPrice = document.querySelector(".totalBuyPrice");
    if (books[0].delivery == true) {
      totalPrice.children[0].innerHTML = `Total: ${
        new Intl.NumberFormat("ru-RU").format(total + 1000) + "₸"
      }`;
    } else {
      totalPrice.children[0].innerHTML = `Total: ${
        new Intl.NumberFormat("ru-RU").format(total) + "₸"
      }`;
    }
  } else {
    let books = localStorage.getItem("BooksBasket");
    books = JSON.parse(books);
    let totalPrice = document.querySelector(".totalBuyPrice");
    if (books[0].delivery == true) {
      totalPrice.children[0].innerHTML = `Total: ${
        new Intl.NumberFormat("ru-RU").format(total + 1000) + "₸"
      }`;
    } else {
      totalPrice.children[0].innerHTML = `Total: ${
        new Intl.NumberFormat("ru-RU").format(total) + "₸"
      }`;
    }
  }
}
//Total Summ for PAY
function TotalSumm() {
  let summ = document.querySelectorAll("input[type='number']");
  let del = document.querySelectorAll(".fa-circle-xmark");
  del.forEach((del) => {
    del.addEventListener("click", deleteCardSum);
  });
  summ.forEach((summX) => {
    summX.addEventListener("click", summXTotal);
  });
}
function summXTotal(e) {
  let current = e.target;

  let Account = Accounts();
  if (Account !== undefined) {
    let books = localStorage.getItem(`Basket${Account.Mail}`);
    books = JSON.parse(books);
    books.find((book) => {
      if (book.idSeria == current.closest(".card").id) {
        let total = current.closest(".card").children[3].children[1];
        total.innerHTML = `Total: ${new Intl.NumberFormat("ru-RU").format(
          book.price * current.value
        )}₸`;
        book.amount = current.value;
      }
    });
    localStorage.setItem(`Basket${Account.Mail}`, JSON.stringify(books));
    addbookNum(books);
  } else {
    let books = localStorage.getItem("BooksBasket");
    books = JSON.parse(books);
    books.find((book) => {
      if (book.idSeria == current.closest(".card").id) {
        let total = current.closest(".card").children[3].children[1];
        total.innerHTML = `Total: ${new Intl.NumberFormat("ru-RU").format(
          book.price * current.value
        )}₸`;
        book.amount = current.value;
      }
    });
    localStorage.setItem("BooksBasket", JSON.stringify(books));
    addbookNum(books);
  }
}
function deleteCardSum(e) {
  let current = e.target;
  let Account = Accounts();
  if (Account !== undefined) {
    let books = localStorage.getItem(`Basket${Account.Mail}`);
    books = JSON.parse(books);
    books.find((book) => {
      if (book.idSeria == current.closest(".card").id) {
        let total = current.closest(".card").children[3].children[1];
        total.innerHTML = `Total: ${new Intl.NumberFormat("ru-RU").format(
          book.price * current.value
        )}₸`;
        book.amount = current.value;
      }
    });
    localStorage.setItem(`Basket${Account.Mail}`, JSON.stringify(books));
  } else {
    let books = localStorage.getItem("BooksBasket");
    books = JSON.parse(books);
    books.find((book) => {
      if (book.idSeria == current.closest(".card").id) {
        let total = current.closest(".card").children[3].children[1];
        total.innerHTML = `Total: ${new Intl.NumberFormat("ru-RU").format(
          book.price * current.value
        )}₸`;
        book.amount = current.value;
      }
    });
    localStorage.setItem("BooksBasket", JSON.stringify(books));
  }

  let imgBook = document.querySelectorAll(".booksIMG");
  imgBook.forEach((i) => {
    if (i.id == current.closest(".card").id) {
      i.remove();
    }
  });

  booksIMGpostion();
}
//Pay Purcheses
async function PayPurchases() {
  let PayButton = document.querySelector("input[type='button']");
  PayButton.addEventListener("click", clickPayButton);
}
async function clickPayButton(e) {
  let Account = Accounts();
  if (Account !== undefined) {
    let books = localStorage.getItem(`Basket${Account.Mail}`);
    books = JSON.parse(books);
    let Purchases = localStorage.getItem(`Purch${Account.Mail}`);
    Purchases = JSON.parse(Purchases);
    if (Purchases !== null) {
      Purchases.push(books);
      localStorage.setItem(`Purch${Account.Mail}`, JSON.stringify(Purchases));
    } else {
      Purchases = [books];
      localStorage.setItem(`Purch${Account.Mail}`, JSON.stringify(Purchases));
    }
  } else {
    let books = await fetchData();
    let Purchases = localStorage.getItem("Purchases");
    Purchases = JSON.parse(Purchases);
    if (Purchases !== null) {
      Purchases.push(books);
      localStorage.setItem("Purchases", JSON.stringify(Purchases));
    } else {
      Purchases = [books];
      localStorage.setItem("Purchases", JSON.stringify(Purchases));
    }
  }
}
//Delivery view
function viewDelivery() {
  let delivery = document.querySelector(".truck");
  let pickup = document.querySelector(".pickup");

  delivery.addEventListener("click", (e) => {
    let Account = Accounts();
    if (Account !== undefined) {
      let books = localStorage.getItem(`Basket${Account.Mail}`);
      books = JSON.parse(books);
      books.map((book) => {
        book.delivery = true;
      });

      localStorage.setItem(`Basket${Account.Mail}`, JSON.stringify(books));
      addbookNum(books);
    } else {
      let books = localStorage.getItem("BooksBasket");
      books = JSON.parse(books);
      books.map((book) => {
        book.delivery = true;
      });
      localStorage.setItem("BooksBasket", JSON.stringify(books));
      addbookNum(books);
    }
    let current = e.currentTarget;
    current.style.backgroundColor = "rgba(162, 255, 2, 0.364)";
    pickup.style.backgroundColor = "rgba(108, 41, 255, 0.251)";
  });
  pickup.addEventListener("click", (e) => {
    let Account = Accounts();
    if (Account !== undefined) {
      let books = localStorage.getItem(`Basket${Account.Mail}`);
      books = JSON.parse(books);
      books.map((book) => {
        book.delivery = false;
      });

      localStorage.setItem(`Basket${Account.Mail}`, JSON.stringify(books));
      addbookNum(books);
    } else {
      let books = localStorage.getItem("BooksBasket");
      books = JSON.parse(books);
      books.map((book) => {
        book.delivery = false;
        console.log(book.delivery);
      });
      localStorage.setItem("BooksBasket", JSON.stringify(books));
      addbookNum(books);
    }
    let current = e.currentTarget;
    current.style.backgroundColor = "rgba(162, 255, 2, 0.364)";
    delivery.style.backgroundColor = "rgba(108, 41, 255, 0.251)";
  });
}
//By Cash or By Card
function addByPay() {
  let ByCash = document.querySelector(".Cash");
  let ByCard = document.querySelector(".BankCard");
  let Card = document.querySelector(".CardBank");
  let Cash = document.querySelector(".ByCash");
  ByCash.addEventListener("click", (e) => {
    let current = e.currentTarget;
    current.style.backgroundColor = "rgba(162, 255, 2, 0.364)";
    ByCard.style.backgroundColor = "rgba(108, 41, 255, 0.251)";
    Cash.style.display = "block";
    Card.style.display = "none";
  });
  ByCard.addEventListener("click", (e) => {
    let current = e.currentTarget;
    current.style.backgroundColor = "rgba(162, 255, 2, 0.364)";
    ByCash.style.backgroundColor = "rgba(108, 41, 255, 0.251)";
    Card.style.display = "block";
    Cash.style.display = "none";
  });
}
buyBooks();
