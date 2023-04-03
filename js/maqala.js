async function fetchData() {
  try {
    let res = await fetch("../json/maqala.json");
    let maqala = await res.json();
    return addWrite(maqala);
  } catch (e) {
    console.log(e);
  }
}
function addWrite(maqala) {
  let text = document.querySelector(".Maqala");
  text.style.display = "flex";
  let textAuthor = document.querySelector(".Author");
  let i = (Math.random() * maqala.length).toFixed(0);
  if (i >= maqala.length) {
    i = i - 1;
  }

  let a = maqala[i].Maqala.split("");
  for (let b = 0; b < a.length; b++) {
    let c = document.createElement("li");
    c.classList.add("MaqalaAnimation");
    c.style.transition = "0.3s";
    c.style.opacity = 0;
    c.innerHTML = a[b];
    text.appendChild(c);
  }

  let Pero = document.createElement("img");
  Pero.classList.add("Pero");
  Pero.src = "../img/Pero.png";
  Pero.style.transform = "translateY(70px) translateX(360px)";
  Pero.style.transition = "1.5s";

  setTimeout(() => {
    Pero.style.transform = "translateY(-50px) translateX(0px)";
  }, 2000);

  text.appendChild(Pero);

  textAuthor.innerHTML = maqala[i].Author;
  if (maqala[i].Maqala.length > 60) {
    text.style.marginLeft = "30px";
  } else if (maqala[i].Maqala.length < 30) {
    text.style.marginLeft = "250px";
  }

  setTimeout(() => {
    Maqala();
  }, 3500);
}
function Maqala() {
  let li = document.querySelectorAll(".MaqalaAnimation");

  let Pero = document.querySelector(".Pero");
  Pero.style.transition = "0.1s";

  let r = 100;

  li.forEach((i) => {
    if (i.value == "") {
      i.style.minWidth = "5px";
    }
    setTimeout(() => {
      i.style.display = "block";
      setTimeout(() => {
        if (Pero.style.transform === "translateY(-55px)") {
          Pero.style.transform = "translateY(-45px)";
        } else {
          Pero.style.transform = "translateY(-55px)";
        }
      });
      i.style.opacity = 1;
    }, r);
    r = r + 50;
  });

  setTimeout(() => {
    Pero.style.transition = "1s";
    Pero.style.transform = "translateY(70px)";
    Pero.style.opacity = 0;
  }, 5000);

  let a = document.querySelector(".Author");

}
fetchData();
