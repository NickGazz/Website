let learnMoreButton = document.getElementById('learnMoreButton')
let header = document.querySelector('header');
let body = document.querySelector('body');
let landing = document.querySelector('#landing-wrapper');
let main = document.querySelector('main');
let info1 = document.querySelector('#info1');
let info = document.querySelectorAll('.info');
let downArrow1 = document.querySelector('#downArrow1');
let w = window.innerWidth;

function selectedLearMore() {
  landing.style.transform = "translate(-100%)";
  main.style.opacity = "1";
  for (let i = 0; i < info.length; i++) {
    info[i].style.display = "block";
  }
}

function selectedDownArrow(){
  let current = this.parentElement;
  let next = this.parentElement.nextElementSibling;
  next = next.offsetTop;
  console.log(next);
  // current.style.display = "none";
  // next.style.display = "block";
  window.scrollTo(0, next);

}

learnMoreButton.addEventListener('click', selectedLearMore);
downArrow1.addEventListener('click', selectedDownArrow);
downArrow2.addEventListener('click', selectedDownArrow);
