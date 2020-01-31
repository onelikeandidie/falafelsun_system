var loading_messages = [
  "Cooking up some halloumi",
  "Helping you eat healthy",
  "Perfecting the falafel balls",
  "Making an amazing hummus",
  "Frying up some parsnip chips"
];

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
$(".hoverme").style.opacity = "1";

$(".location").forEach((location) => {
  location.onmouseover = function() {
    if (hoverme = $(".hoverme")) {
      hoverme.parentElement.removeChild(hoverme);
    }
  }
})

function generateLoading() {
  console.log("Random message is being generated");

  $(".loading-container>p").forEach(function(loader) {
    loader.innerHTML = (loading_messages[Math.floor(Math.random() * loading_messages.length)]);
  });
}

function loadlocations() {
  generateLoading();
}
