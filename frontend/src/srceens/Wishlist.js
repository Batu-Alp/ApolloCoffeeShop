/* eslint-disable no-use-before-define */
import { parseRequestUrl, rerender } from '../utils';
import { getProduct, updateProduct } from '../api';
import { getWishlistItems, setWishlistItems } from '../localStorage';
import Rating from '../components/Rating';

const getRandomProductByCategory = (category, wishlistItems) => {
  const categoryProducts = wishlistItems.filter(
    (item) => item.category === category
  );
  if (categoryProducts.length > 0) {
    const randomIndex = Math.floor(Math.random() * categoryProducts.length);
    return categoryProducts[randomIndex];
  }
  return null;
};
const addToWishlist= (item, forceUpdate = false) => {
  let cartItems = getWishlistItems();
  const existItem = cartItems.find((x) => x.product === item.product);
  if (existItem) {
    if (forceUpdate) {
      cartItems = cartItems.map((x) =>
        x.product === existItem.product ? item : x
      );
    }
  } else {
    cartItems = [...cartItems, item];
  }
  setWishlistItems(cartItems);
  if (forceUpdate) {
    rerender(Wishlist);
  }
};
const removeFromWishlist= (id) => {
    setWishlistItems(getWishlistItems().filter((x) => x.product !== id));
  if (id === parseRequestUrl().id) {
    document.location.hash = '/wishlist';
  } else {
    rerender(Wishlist);
  }
};
const Wishlist = {

  
  after_render: () => {
    const request = parseRequestUrl();

    const qtySelects = document.getElementsByClassName('qty-select');
    Array.from(qtySelects).forEach((qtySelect) => {
      qtySelect.addEventListener('change', (e) => {
        const item = getWishlistItems().find((x) => x.product === qtySelect.id);
        addToWishlist({ ...item, qty: Number(e.target.value) }, true);
      });
    });
    const deleteButtons = document.getElementsByClassName('delete-button');
    Array.from(deleteButtons).forEach((deleteButton) => {
      deleteButton.addEventListener('click', () => {
        removeFromWishlist(deleteButton.id);
      });
    });

    const addButtons = document.getElementsByClassName('add-button');
    Array.from(addButtons).forEach((addButton) => {
      addButton.addEventListener('click', async () => {

      const product = await getProduct(addButton.id);

      console.log("item:", product);
      console.log("old stock :", product.countInStock);

      product.countInStock -= 1;

      const data = await updateProduct({
        _id: request.id,
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
        category: product.category,
        countInStock: product.countInStock,
        description: product.description,
      });
        document.location.hash = `/cart/${addButton.id}`;

      });
    });
   
  
    /*
    document.getElementById('checkout-button').addEventListener('click', () => {
      document.location.hash = '/signin';
    });
    */

  },

  render: async () => {
    const request = parseRequestUrl();
 
    if (request.id) {
      const product = await getProduct(request.id);
      /*
      document.getElementById('add-button').addEventListener('click', () => {
        document.location.hash = `/cart/${request.id}`;
      });
      */
      addToWishlist({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty: 1,
      });
    }

    const cartItems = getWishlistItems();

    // En fazla olan kategoriyi bulun
    const categoryCounts = {};
    cartItems.forEach((item) => {
      if (categoryCounts[item.category]) {
        // eslint-disable-next-line no-plusplus
        categoryCounts[item.category]++;
      } else {
        categoryCounts[item.category] = 1;
      }
    });
    const mostFrequentCategory = Object.keys(categoryCounts).reduce(
      (a, b) => (categoryCounts[a] > categoryCounts[b] ? a : b),
      ''
    );

    // En fazla olan kategoriden rastgele bir ürün alın
    const recommendedProduct = getRandomProductByCategory(
      mostFrequentCategory,
      cartItems
    );
    
    //console.log("recommended product : " ,recommendedProduct);
 
    return `
    <div class="content cart">
      <div class="cart-list">
        <ul class="cart-list-container">

        <li>
            <h3>Wishlist</h3>
          </li>
          <!-- <div class = "wishlist-price">Price</div> -->
          <div style="position:absolute;right:180px; top:75px;"> Price</div>

          ${
            cartItems.length === 0
              ? '<div>Wishlist is empty. <a href="/#/">Go Shopping</a>'
              : cartItems
                  .map(
                    (item) => `
            <li>
              <div class="cart-image">
                <img src="${item.image}" alt="${item.name}" />
              </div>
              
              <div class="cart-name">
              
                <div>
                  <a href="/#/product/${item.product}">
                    ${item.name}
                  </a>
                </div>
                <div>
                 <!--
                  Qty: 
                  <select class="qty-select" id="${item.product}">
                  ${[...Array(item.countInStock).keys()].map((x) =>
                    item.qty === x + 1
                      ? `<option selected value="${x + 1}">${x + 1}</option>`
                      : `<option  value="${x + 1}">${x + 1}</option>`
                  )} 
                  --> 

                  </select>
                  <button type="button" class="delete-button" id="${
                    item.product
                  }">
                    Delete
                  </button>
                </div>
              </div>
              <div class="cart-price" >
                 <! -- ${item.price} TL -->

              </div>

              <div class="cart-action-wishlist">
              <button type = "button" id="${
                item.product
              }" class="add-button">
                Add to cart
              </button>
               </div>
            
          </li>
            `
                  )
                  .join('\n')
          } 
        </ul>
      </div>
      ${
        recommendedProduct
          ? `
            <div class="recommended-product">
              <h3>Recommended Product</h3>
              <div class="product">
                <a href="/#/product/${recommendedProduct.product}">
                  <img src="${recommendedProduct.image}" alt="${recommendedProduct.name}" />
                </a>
                <div class="product-name">
                  <a href="/#/product/${recommendedProduct.product}">${recommendedProduct.name}</a>
                </div>
                <div class="product-rating">
                  ${Rating.render({
                    value: recommendedProduct.rating,
                    text: `${recommendedProduct.numReviews} reviews`,
                  })}
                </div>
                <div class="product-brand">
                  ${recommendedProduct.brand}
                </div>
                <div class="product-price">
                  ${recommendedProduct.price} TL
                </div>
                <div class="cart-action-wishlist">
                  <button type="button" id="${recommendedProduct.product}" class="add-button">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
      `
          : ''
      }
    </div>
    `;
  },
};

export default Wishlist;
