async function fetchData() {
  try {
    let res = localStorage.getItem("Accounts");
    let Accounts = await JSON.parse(res);
    if (Accounts !== null) {
      return Accounts;
    } else {
      return (Accounts = []);
    }
  } catch (e) {
    console.log(e);
  }
}
async function SignIN() {
  let Accounts = await fetchData();
  AnimationBasket();
  AnimationLiked();
  ChangeClickButton();
  SignINButtonClick();
}
function ChangeClickButton() {
  let inputForm = document.querySelector(".SoR");
  inputForm.addEventListener("click", (e) => {
    let click = e.currentTarget;
    click.parentElement.classList.toggle("Regist");
    if (click.innerHTML == "Registration") {
      click.innerHTML = "Sign-in";
      click.nextElementSibling.innerHTML = "Registration";
    } else {
      click.innerHTML = "Registration";
      click.nextElementSibling.innerHTML = "Sign-in";
    }
  });
}

async function SignINButtonClick() {
  let Accounts = await fetchData();
  let btnSigIn = document.querySelector("button[type='submit']");
  btnSigIn.addEventListener("click", (e) => {
    if (btnSigIn.innerHTML == "Registration") {
      const NewAccaunt = {
        FirstName: "",
        LastName: "",
        Age: "",
        Gender: "",
        Mail: "",
        Password: "",
        Active: false,
      };
      let input = document.querySelectorAll("input");
      NewAccaunt.FirstName = input[0].value;
      NewAccaunt.LastName = input[1].value;
      NewAccaunt.Mail = input[2].value;
      NewAccaunt.Password = input[3].value;
      if (Accounts.find((Account) => Account.Mail == NewAccaunt.Mail)) {
        alert("There is such an account!!");
      } else {
        Accounts.push(NewAccaunt);
        localStorage.setItem("Accounts", JSON.stringify(Accounts));
        alert("Account created successfully!");
      }
    } else {
      let input = document.querySelectorAll("input");
      if (
        Accounts.find((Account) => Account.Mail == input[2].value) &&
        Accounts.find((Account) => Account.Password == input[3].value)
      ) {
        Accounts.find((Account) => {
          if (Account.Mail == input[2].value) {
            Account.Active = true;
          }
        });
        localStorage.setItem("Accounts", JSON.stringify(Accounts));
        let UlNav = document.querySelector("ul");

        UlNav.innerHTML = UlNav.innerHTML + creatSign(input[2].value);

        location.href = `../home.html`;
      } else {
        alert("Tere is false an account or password!!");
      }
    }
  });
}
function creatSign(Account) {
  return `
  <a href="##"><p>${Account}</p></a>
`;
}
//NAVBAR ANIMATION
function AnimationBasket() {
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
function AnimationLiked() {
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
SignIN();
