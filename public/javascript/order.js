// Our fake jQuery
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
// Define variables needed
var products;
var cart = {
  items: [],
  price: 0
};


function init() {
  socket.emit('get products');

  socket.on('gotten products', function(data) {
    products = data.products;
    let types = [];
    for (var i = 0; i < products.length; i++) {
      if (products[i].type != types[types.length - 1]) {
        types.push(products[i].type);
      }
    }
    for (var i = 0; i < types.length; i++) {
      let clone = $('#category').content.cloneNode(true);
      clone.querySelector('h2').innerHTML = types[i];
      for (var j = 0; j < products.length; j++) {
        if (products[j].type == types[i]) {
          let itemclone = $('#item').content.cloneNode(true);
          itemclone.querySelector('h3').innerHTML = products[j].name;
          itemclone.querySelector('.itemimg').style.backgroundImage = 'url("/assets/food/' + products[j].image + '") ';

          itemclone.querySelector('.itemimg').style.backgroundPosition = 'center';
          itemclone.querySelector('.itemimg').style.backgroundRepeat = 'no-repeat';
          itemclone.querySelector('.itemimg').style.backgroundSize = '250%';
          if (products[j].available) {
            itemclone.querySelector('data').value = j;
            itemclone.querySelector('p').innerHTML = products[j].description;
          } else {
            console.log(itemclone);
            itemclone.children[0].classList.add('disabled');
            itemclone.querySelector('data').value = false;
            itemclone.querySelector('p').innerHTML = 'Out of Stock';
          }
          clone.querySelector('.items').append(itemclone);
        } else {

        }
      }
      $('.menu').append(clone);
    }
  });

  updateCart();
}

$('form').addEventListener('submit', function(e) {
  e.preventDefault(); // prevents page reloading
  if (cart.items.length > 0) {
    post('/order', {
      cart: JSON.stringify(cart.items),
      price: cart.price,
      ready: false
    });
  }
  console.log('order sent');
  return false;
}, false);

function togglecategory(element) {
  return false;
}

function selectitem(element) {
  let itemid = element.parentElement.querySelector('data').value;
  let item = products[itemid];
  if (itemid != 'false' && !(element.classList.contains('disabled'))) {
    try {
      $('.details').removeChild($(".itemdetails"));
    } catch (e) {
      console.error("unable to remove last item details");
      console.error(e);
    }
    let clone = $('#itemdetails').content.cloneNode(true);
    clone.querySelector('data').value = itemid;
    clone.querySelector('h2').innerHTML = products[itemid].name;
    clone.querySelector('.description').innerHTML = products[itemid].description;
    clone.querySelector('.itemimg').style.backgroundImage = 'url("/assets/food/' + products[itemid].image + '") ';

    clone.querySelector('.itemimg').style.backgroundPosition = 'center';
    clone.querySelector('.itemimg').style.backgroundRepeat = 'no-repeat';
    clone.querySelector('.itemimg').style.backgroundSize = '100%';
    clone.querySelector('p.price').innerHTML = '£' + (Math.round(products[itemid].price * 100) / 100).toFixed(2);
    console.log(clone);
    // Ingredients checkbox generator
    if (products[itemid].ingredients.length > 0) {
      for (var i = 0; i < products[itemid].ingredients.length; i++) {
        let finishedHTML;
        finishedHTML = '<div><input type="checkbox" name="ingredients" value="' + products[itemid].ingredients[i] + '"id="' + products[itemid].ingredients[i] + '"' + ' checked>';
        finishedHTML += '<label for="' + products[itemid].ingredients[i] + '">' + products[itemid].ingredients[i] + '</label></div>'
        clone.querySelector('.ingredients').append(createElementFromHTML(finishedHTML));
      }
    } else {
      let parentnode = clone.querySelector('.ingredients').parentElement;
      let node = clone.querySelector('.ingredients');
      parentnode.removeChild(node);
    }
    // Sauce checkbox generation
    if (products[itemid].sauces.length > 0) {
      for (var i = 0; i < products[itemid].sauces.length; i++) {
        let finishedHTML;
        finishedHTML = '<div><input type="checkbox" name="sauces" value="' + products[itemid].sauces[i] + '"id="' + products[itemid].sauces[i] + '"' + '>';
        finishedHTML += '<label for="' + products[itemid].sauces[i] + '">' + products[itemid].sauces[i] + '</label></div>';
        clone.querySelector('.sauces').append(createElementFromHTML(finishedHTML));
      }
    } else {
      let parentnode = clone.querySelector('.sauces').parentElement;
      let node = clone.querySelector('.sauces');
      parentnode.removeChild(node);
    }
    // Options checkbox generation
    if (products[itemid].options.length > 0) {
      for (var i = 0; i < products[itemid].options.length; i++) {
        let finishedHTML;
        if (products[itemid].options[i].default) {
          finishedHTML = '<div><input type="checkbox" name="options" value="' + products[itemid].options[i].name + '"id="' + products[itemid].options[i].name + '"' + ' checked>';
        } else {
          finishedHTML = '<div><input type="checkbox" name="options" value="' + products[itemid].options[i].name + '"id="' + products[itemid].options[i].name + '"' + '>';
        }
        finishedHTML += '<label for="' + products[itemid].options[i].name + '">' + products[itemid].options[i].name + ' <span class="price">+£' + (Math.round(products[itemid].options[i].price * 100) / 100).toFixed(2) + '</span></label></div>';
        clone.querySelector('.options').append(createElementFromHTML(finishedHTML));
      }
    } else {
      let parentnode = clone.querySelector('.options').parentElement;
      let node = clone.querySelector('.options');
      parentnode.removeChild(node);
    }
    // Append to the finished item details to the details div on page
    $('.details').append(clone);
  }
  return false;
}

function addToCart(element) {
  let form = element.parentElement.parentElement;
  let productid = form.querySelector('data').value;
  let item = {};
  item.id = productid;
  item.name = products[productid].name;
  item.price = products[productid].price;
  item.ingredients = [];
  item.special = "Nothing special";
  let formspecial = form.querySelectorAll('input[name="special"]')[0]
  try {
    if (formspecial.value != undefined) {
      item.special = formspecial.value;
    }
  } catch (e) {
    console.log("No special requests were found");
  }
  let formingredients = form.querySelectorAll('input[name="ingredients"]')
  try {
    for (var i = 0; i < formingredients.length; i++) {
      if (formingredients[i].checked) {
        item.ingredients.push(formingredients[i].value);
      }
    }
  } catch (e) {
    console.log("No ingredients were found or checked");
  }
  item.sauces = [];
  let formsauces = form.querySelectorAll('input[name="sauces"]')
  try {
    for (var i = 0; i < formsauces.length; i++) {
      if (formsauces[i].checked) {
        item.sauces.push(formsauces[i].value);
      }
    }
  } catch (e) {
    console.log("No sauces were found or checked");
  }
  item.options = [];
  let formoptions = form.querySelectorAll('input[name="options"]')
  try {
    for (var i = 0; i < formoptions.length; i++) {
      if (formoptions[i].checked) {
        item.options.push(formoptions[i].value);
        for (var j = 0; j < products[productid].options.length; j++) {
          if (formoptions[i].value == products[productid].options[j].name) {
            item.price += products[productid].options[j].price;
          }
        }
      }
    }
  } catch (e) {
    console.log("No options were found or checked");
  }
  cart.items.push(item);
  updateCart();
  return false;
}

function removeFromCart(element) {
  let cartitem = element.parentElement;
  let jsonvalue = JSON.parse(cartitem.querySelector('data').value);
  console.log(jsonvalue);
  cart.items.splice(jsonvalue[1] - 1, 1);
  updateCart();
  return false;
}

function updateCart() {
  let cartnode = $('.hero-form .cart');
  let totalprice = 0;
  if (cart.items.length > 0) {
    cartnode.querySelector('.items').innerHTML = '';
    for (var i = 0; i < cart.items.length; i++) {
      totalprice += cart.items[i].price;
      cartnode.querySelector('.items').append(createElementFromHTML('<div class="cartitem"><data value="[' + cart.items[i].id + ',' + cart.items.length + ']"></data><a href="#" class="removeitem" onclick="removeFromCart(this)">❌</a><p class="name">' + cart.items[i].name + '</p><p class="price">' + '<span class="price">£' + (Math.round(cart.items[i].price * 100) / 100).toFixed(2) + '</span></p></div>'));
      cartnode.querySelector('input[value="Order"]').classList.remove('disabled');
    }
  } else {
    cartnode.querySelector('.items').innerHTML = 'You have no items in cart';
    cartnode.querySelector('input[value="Order"]').classList.add('disabled');
  }
  cartnode.querySelector('.cartinfo .price').innerHTML = '<span class="price">£' + (Math.round(totalprice * 100) / 100).toFixed(2) + '</span>';
  cartnode.querySelector('.cartinfo .quantity').innerHTML = cart.items.length + " items";
  cart.price = totalprice;
  console.log(cart);
  return false;
}

function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild;
}

function post(path, params, method = 'post') {

  // The rest of this code assumes you are not using a library.
  // It can be made less wordy if you use one.
  const form = document.createElement('form');
  form.method = method;
  form.action = path;

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = key;
      hiddenField.value = params[key];

      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();
}

init();