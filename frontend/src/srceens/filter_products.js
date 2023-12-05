import Rating from '../components/Rating';
import { getProducts } from '../api';
import { parseRequestUrl } from '../utils';

const HomeScreen = {
    render: async () => {
      const { value } = parseRequestUrl();
      const products = await getProducts({ searchKeyword: value });
      if (products.error) {
        return `<div class="error">${products.error}</div>`;
      }
  
      const selectedProductId = '1'; // Seçilen ürünün ID'sini burada alın veya belirleyin
      const selectedProduct = products.find(
        (product) => product._id === selectedProductId
      );
      const selectedProductCategory = selectedProduct ? selectedProduct.type : '';
      console.log(selectedProductCategory);
      return `
        <div class="category-homescreen">
          <a href="/#/?q=T-Shirt">
            <div class="category ${
              selectedProductCategory === 'coffee' ? 'selected' : ''
            }">
              <span class="category-name">T-Shirts</span>
              <i class="fa fa-chevron-right"></i>
            </div>
          </a>
          <a href="/#/?q=phone">
            <div class="category ${
              selectedProductCategory === 'phone' ? 'selected' : ''
            }">
              <span class="category-name">Phones</span>
              <i class="fa fa-chevron-right"></i>
            </div>
          </a>
          <a href="/#/?q=electronic">
            <div class="category ${
              selectedProductCategory === 'electronic' ? 'selected' : ''
            }">
              <span class="category-name">Electronic</span>
              <i class="fa fa-chevron-right"></i>
            </div>
          </a>
        </div>
  
        <ul class="products">
          ${products
            .map(
              (product) => `
                <li>
                  <div class="product">
                    <a href="/#/product/${product._id}">
                      <img src="${product.image}" alt="${product.name}" />
                    </a>
                    <div class="product-name">
                      <a href="/#/product/1">${product.name}</a>
                    </div>
                    <div class="product-rating">
                      ${Rating.render({
                        value: product.rating,
                        text: `${product.numReviews} reviews`,
                      })}
                    </div>
                    <div class="product-brand">
                      ${product.type}
                    </div>
                    <div class="product-price">
                    ${product.price_small} TL
                    ${product.price_medium} TL
                    ${product.price_large} TL                      
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
  