var loading_messages = [
  "Cooking up some halloumi",
  "Helping you eat healthy",
  "Perfecting the falafel balls",
  "Making an amazing hummus",
  "Frying up some parsnip chips"
];

var indoor_open = new Array(7);
indoor_open[0] = false;
indoor_open[1] = false;
indoor_open[2] = true;
indoor_open[3] = true;
indoor_open[4] = true;
indoor_open[5] = true;
indoor_open[6] = true;

var highsteet_open = new Array(7);
highsteet_open[0] = false;
highsteet_open[1] = false;
highsteet_open[2] = true
highsteet_open[3] = false;
highsteet_open[4] = false;
highsteet_open[5] = true;
highsteet_open[6] = true;

var d = new Date();

let $ = function(query) {
  let result = document.querySelectorAll(query);
  if (result.length === 0) {
    return;
  }
  if (result.length > 1) {
    return result;
  }
  result[0].forEach = function(callback) {
    if (callback) callback(result[0]);
  }
  return result[0];
};

loadlocations();

$(".hero-map").style.opacity = "1";
$(".loading").parentElement.removeChild($(".loading"));
$(".hero-alternative").style.opacity = "1";

window.onscroll = function() {
  console.log(window.scrollY);
  if (window.innerWidth > 1080) {
    if (window.scrollY > 100) {
      $(".nav-bar").classList.add("small");
    } else {
      $(".nav-bar").classList.remove("small");
    }
  }
}

function generateLoading() {
  console.log("Random message is being generated");

  $(".loading-container>p").forEach(function(loader) {
    loader.innerHTML = (loading_messages[Math.floor(Math.random() * loading_messages.length)]);
  });
}

function loadlocations() {
  generateLoading();
  if (indoor_open[d.getDay()]) {
    $(".location#indoor")[0].classList.add("open");
  }
  if (highsteet_open[d.getDay()]) {
    $(".location#high-street")[0].classList.add("open");
  }
}