function swiper() {
  let next = document.querySelector(".fa-chevron-right");
  let prev = document.querySelector(".fa-chevron-left");
  next.addEventListener("click", clickNext);
  prev.addEventListener("click", clickPrev);
}
let i = 0;
function clickNext(e) {
  let slides = document.querySelector(".swiper-relative");
  i = i + 590;
  if (i != 1770) {
    slides.style.left = -i + "px";
  } else {
    slides.style.left = 0 + "px";
    i = 0;
  }
}

function clickPrev(e) {
  let slides = document.querySelector(".swiper-relative");
  i = i - 590;
  if (i >= 0) {
    slides.style.left = -i + "px";
  } else {
    slides.style.left = -1180 + "px";
    i = 1180;
  }
}
swiper();

// function swiper() {
//   window.onscroll = function () {
//     myFunction();
//   };
//   let MainCard = document.querySelector(".Main");

//   var sticky = MainCard.offsetTop;
//   let Swipe = document.querySelector(".swiper");
//   function myFunction() {
//     if (window.pageYOffset > sticky) {

//     } else {

//     }
//   }
// }
// swiper();
