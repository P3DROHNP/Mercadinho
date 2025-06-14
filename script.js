const loginBtn = document.getElementById('loginBtn');
const main = document.getElementById('main');
const loginContainer = document.getElementById('login-container');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

loginBtn.addEventListener('click', () => {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;

  if (user && pass) {
    loginContainer.classList.add('hidden');
    main.classList.remove('hidden');
    loadProducts();
    renderCart();
  } else {
    alert('Preencha usuário e senha!');
  }
});

let allProducts = [];

function loadProducts() {
  fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(products => {
      allProducts = products; // salvar para uso posterior
      const container = document.getElementById('catalog-container');
      container.innerHTML = '';
      products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
          <img src="${product.image}" alt="${product.title}">
          <h3>${product.title}</h3>
          <p>${product.description.substring(0, 100)}...</p>
          <p><strong>R$ ${product.price.toFixed(2)}</strong></p>
          <button class="add-btn" data-id="${product.id}">Adicionar</button>
        `;
        container.appendChild(div);
      });

      // Adiciona eventos após criar os botões
      document.querySelectorAll('.add-btn').forEach(button => {
        button.addEventListener('click', () => {
          const id = parseInt(button.getAttribute('data-id'));
          const selected = allProducts.find(p => p.id === id);
          addToCart(selected);
        });
      });
    });
}


function addToCart(product) {
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  const list = document.getElementById('cart-items');
  list.innerHTML = '';
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement('li');
    li.innerHTML = `${item.title} - R$ ${item.price.toFixed(2)} 
      <button onclick='removeFromCart(${index})'>X</button>`;
    list.appendChild(li);
  });
  document.getElementById('total').innerText = total.toFixed(2);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (cart.length === 0) {
    alert("Carrinho vazio!");
    return;
  }

  const name = prompt("Digite seu nome:");
  const address = prompt("Endereço de entrega:");
  const payment = prompt("Forma de pagamento:");

  if (name && address && payment) {
    alert(`✅ Pedido confirmado!\n\n🧾 Cliente: ${name}\n📦 Endereço: ${address}\n💳 Pagamento: ${payment}`);
    cart = [];
    localStorage.removeItem('cart');
    renderCart();
  } else {
    alert("Por favor, preencha todas as informações para finalizar.");
  }
});
s