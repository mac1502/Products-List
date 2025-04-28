let products = [];
let categories = [];
let currentPage = 1;
const productsPerPage = 10;
let selectedCategory = 'all';

const fetchProducts = async () => {
  const response = await fetch('https://fakestoreapi.com/products');
  const data = await response.json();
  products = data;
  renderProducts();
};

const fetchCategories = async () => {
  const response = await fetch('https://fakestoreapi.com/products/categories');
  const data = await response.json();
  categories = ['all', ...data];
  populateCategoryFilter();
};

const populateCategoryFilter = () => {
  const categoryFilter = document.querySelector('.filter-buttons');
  const categoryDropdown = document.querySelector('.filter-dropdown');

  categoryFilter.innerHTML = '';
  categoryDropdown.innerHTML = '';

  categories.forEach(category => {
    const button = document.createElement('button');
    button.classList.add('filter-btn');
    button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    button.onclick = () => setCategory(category);
    categoryFilter.appendChild(button);

    const option = document.createElement('option');
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categoryDropdown.appendChild(option);
  });
};

const setCategory = (category) => {
  selectedCategory = category;
  currentPage = 1;
  renderProducts();
};

const renderProducts = () => {
  const productList = document.getElementById('productList');
  productList.innerHTML = '';

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const productsToRender = filteredProducts.slice(startIndex, endIndex);

  productsToRender.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p class="category">${product.category}</p>
      <p class="price">$${product.price.toFixed(2)}</p>
      <p class="rating">Rating: ${product.rating.rate} / 5</p>
      <div class="actions">
        <input type="number" min="1" value="1">
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
    productList.appendChild(productCard);
  });

  renderPagination(filteredProducts.length);
};

const renderPagination = (totalProducts) => {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  if (currentPage > 1) {
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.onclick = () => changePage(currentPage - 1);
    pagination.appendChild(prevButton);
  }

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.onclick = () => changePage(i);
    if (i === currentPage) pageButton.disabled = true;
    pagination.appendChild(pageButton);
  }

  if (currentPage < totalPages) {
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.onclick = () => changePage(currentPage + 1);
    pagination.appendChild(nextButton);
  }
};

const changePage = (page) => {
  currentPage = page;
  renderProducts();
};

const addToCart = (productId) => {
  console.log(`Product ${productId} added to cart.`);
};

document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
  fetchCategories();
});
