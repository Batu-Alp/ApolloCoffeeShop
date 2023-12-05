import Rating from '../components/Rating';
import { getProducts } from '../api';
import { parseRequestUrl } from '../utils';
import { getUserInfo } from '../localStorage';

const HomeScreen = {
  render: async () => {
    const { value } = parseRequestUrl();
    const products = await getProducts({});
    const { name, isAdmin, isSeller } = getUserInfo();

    if (products.error) {
      return `<div class="error">${products.error}</div>`;
    }

    const types = Array.from(new Set(products.map(product => product.type)));
    
    console.log("types: ", types);


    const selectedCategory = value || "";
    const selectedName = value || "";
    console.log(selectedName);

    const categoryOptions = types
      .map(
        (category) => `
          <option value="${category}" ${category === selectedCategory ? 'selected' : ''}>${category}</option>
        `
      )
      .join('');

    const filteredProducts = selectedCategory
      ? products.filter((product) => product.type.toLowerCase() === selectedCategory.toLowerCase())
      : products;

    const searchedProducts = selectedName
      ? products.filter((product) => product.name.toLowerCase().includes(selectedName.toLowerCase()))
      : products;

    // Birleştirilmiş ürün listesi
    const mergedProducts = [...new Set([...filteredProducts, ...searchedProducts])];

    console.log("selectedCategory : ", selectedCategory);

    return `
      <br>
      <div class="category-homescreen">
        <select class="option-category" id="category" onchange="window.location.href = '/#/?q=' + this.value;">
          <option value="">All Categories</option>
          ${categoryOptions}
        </select>
      </div>

      <ul class="products">
        ${mergedProducts
          .map(
            (product) => `
              <li>
                <div class="product">
                  <a href="/#/product/${product._id}">
                    <img src="${product.image}" alt="${product.name}" />
                  </a>
                  <div class="product-name">
                    <a href="/#/product/${product._id}">${product.name}</a>
                  </div>
                  <div class="product-brand">
                    ${product.type}
                  </div>
                  <div class="product-rating">
                    ${Rating.render({
                      value: product.rating,
                      text: `${product.numReviews} reviews`,
                    })}
                  </div>
                </div>
              </li>
            `
          )
          .join('\n')}
      </ul>
    `;
  },
};

export default HomeScreen;
