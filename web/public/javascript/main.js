var loading_messages = ["Cooking up some halloumi", "Helping you eat healthy", "Perfecting the falafel balls", "Making an amazing hummus", "Frying up some parsnip chips"]

$(document).ready(function() {
  // Stuff to do as soon as the DOM is ready
  loadlocations();
  $(".hero-map").css("opacity", "1");
  $(".loading").remove();
  $(".hero-alternative").css("opacity", "1");
  $(".hoverme").css("opacity", "1");

  $(".location").hover(function() {
    $(".hoverme").remove();
    console.log("n-word");
  }, function() {});
});

$(window).scroll(function() {
  if ($(window).width() > 1080) {
    if ($(window).scrollTop() > 100) {
      $(".nav-bar").addClass("small");
    } else {
      $(".nav-bar").removeClass("small");
    }
  }
});

function generateLoading() {
  console.log("Random message is being generated");
  $(".loading-container>p").each(function(index) {
    $(this).text(loading_messages[Math.floor(Math.random() * loading_messages.length)]);
  });
}

function loadlocations() {

}