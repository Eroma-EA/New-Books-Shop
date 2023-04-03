async function fetchData() {
  try {
    let res = await fetch("../json/books.json");
    let books = await res.json();
    return cardsRandom(books);
  } catch (e) {
    console.log(e);
  }
}

function cardsRandom(books) {
  let DivImg = document.querySelector(".img");

  let arr = [];

  for (let a = 0; a <= 5; a++) {
    let i = (Math.random() * books.length).toFixed(0);
    if (i >= books.length || i == 0 || arr.includes(i)) {
      a--;
    } else {
      arr.push(i);
    }
  }

  DivImg.innerHTML = arr
    .map((i) => {
      return `<img class="img" src="../img/books/b${i}.jpg" id="${i}" alt="">`;
    })
    .join("");
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
  console.log(id);
  location.href = `../html/card.html?id=${id}`;
}
fetchData();
