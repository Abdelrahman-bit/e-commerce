let moreBtn = document.querySelector(".moreBtn");
let etraTxt = document.querySelector(".extra-text");
let isOpen = false;
moreBtn.addEventListener("click", () => {
  etraTxt.classList.toggle("hidden");
  isOpen = !isOpen;
  if (isOpen) {
    moreBtn.textContent = "less";
  } else {
    moreBtn.textContent = "more";
  }
});
