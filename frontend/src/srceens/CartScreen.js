/* eslint-disable no-use-before-define */
import {
  parseRequestUrl,
  showLoading,
  hideLoading,
  showMessage,
  rerender,
  redirectUser,
} from '../utils';

import { getProduct, updateProduct, update, getUser } from '../api';
import { getCartItems, setCartItems,getUserInfo,cleanCart,setTotalPrice } from '../localStorage';


let totalPrice = 0;


export const addToCart = (item, forceUpdate = false) => {
  console.log("AddToCart");
  let cartItems = getCartItems();
  const existItem = cartItems.find((x) => x.product === item.product);
  if (existItem) {
    console.log("existItem");

    if (forceUpdate) {
      console.log("forceUpdate");

      cartItems = cartItems.map((x) =>
        x.product === existItem.product ? item : x
        
      );
    }
  } 
  
  else {
    cartItems = [...cartItems, item];
  }
  

  console.log(cartItems);

  setCartItems(cartItems);
  if (forceUpdate) {
    rerender(CartScreen);
  }
};
export const removeFromCart = (id, item) => {
  // setCartItems(getCartItems().filter((x) => x.product !== id));
  // updateTotalPrice(item);
  console.log("item:", item);
  console.log("item:", item[0].selectedSize);

  const price =
  item[0].selectedSize === "small" ? item[0].price_small :
  item[0].selectedSize === "medium" ? item[0].price_medium :
  item[0].selectedSize === "large" ? item[0].price_large :
    0; // Varsayılan olarak 0, belki başka bir değer daha uygun olabilir
  
  console.log("selectedSize:", item[0].selectedSize);
  console.log("item price:", price);
  totalPrice -= price * item[0].qty;
  console.log("total price:", totalPrice);
  setCartItems(getCartItems().filter((x) => x.product !== id));

  if (id === parseRequestUrl().id) {
    document.location.hash = '/cart';
  } else {
    rerender(CartScreen);
  }
};

export const updateTotalPrice = (item) => {

  console.log(item);
  const price =
    item.selectedSize === "small" ? item.price_small :
    item.selectedSize === "medium" ? item.price_medium :
    item.selectedSize === "large" ? item.price_large :
    0; // Varsayılan olarak 0, belki başka bir değer daha uygun olabilir

  totalPrice -= price * item.qty
  // return price * item.qty;
};

export const calculateItemPrice = (item, state) => {
  const price =
    item.selectedSize === "small" ? item.price_small :
    item.selectedSize === "medium" ? item.price_medium :
    item.selectedSize === "large" ? item.price_large :
    0; // Varsayılan olarak 0, belki başka bir değer daha uygun olabilir
  // totalPrice += price * item.qty;
  if (state === true) {
    totalPrice += price * item.qty
    // rerender(CartScreen);

  }
  else{
    totalPrice -= price * item.qty
    // rerender(CartScreen);

  }

  return price * item.qty;
};

export const sumPrice = () => {
  return totalPrice;
};


const calculateTotal = (cartItems) => {
  return cartItems.reduce((total, item) => {
    const price =
      item.selectedSize === "small" ? item.price_small :
      item.selectedSize === "medium" ? item.price_medium :
      item.selectedSize === "large" ? item.price_large :
      0; // Varsayılan olarak 0, belki başka bir değer daha uygun olabilir
    totalPrice = total + price * item.qty 
    return total + price * item.qty;
  }, 0).toFixed(2);
};

const CartScreen = {
  after_render: () => {


    const request = parseRequestUrl();
    console.log(totalPrice);

    const sizeSelects = document.getElementsByClassName('price-options');
    Array.from(sizeSelects).forEach((sizeSelect) => {

      sizeSelect.addEventListener('change',  (e) => {
        const item = getCartItems().find((x) => x.product === sizeSelect.id);

        addToCart({ ...item, selectedSize: String(e.target.value) }, true);
      });
    });

    const qtySelects = document.getElementsByClassName('qty-select');
    Array.from(qtySelects).forEach((qtySelect) => {
      // const selectedSizeCoffee = document.getElementById('price-options').value;

      qtySelect.addEventListener('change',  (e) => {
        const item = getCartItems().find((x) => x.product === qtySelect.id);
    
        addToCart({ ...item, qty: Number(e.target.value) }, true);
      });
    });
    const deleteButtons = document.getElementsByClassName('delete-button');
    Array.from(deleteButtons).forEach((deleteButton) => {
      // cleanCart();
      deleteButton.addEventListener('click', async (e) => {
      console.log("deleteButton :", deleteButton.id);
      const product = await getProduct(deleteButton.id);
      // const product2 = await getCartItems(deleteButton.value);
      const selectedItem = await getCartItems(deleteButton.value);

      console.log("deleteButton :", deleteButton);
      console.log("deleteButton.id :", deleteButton.id);
      console.log("deleteButton,value :", deleteButton.id);
      // console.log("item2:", product2);
      console.log("item3:", selectedItem);


      console.log("item:", product.selectedSize);
      console.log("old stock :", product.countInStock);

      product.countInStock += 1;

      const data = await updateProduct({
        _id: request.id,
        name: product.name,
        price_small: product.price_small,
        price_medium: product.price_medium,
        price_large: product.price_large,
        image: product.image,
        type: product.type,
        countInStock: product.countInStock,
        description: product.description,
        
      });
      console.log("new stock :", product.countInStock);
        
      hideLoading();
      if (data.error) {
        showMessage(data.error);
      } else {
        document.location.hash = `/cart`;

      }
      removeFromCart(deleteButton.id, selectedItem);
    
      });
    });
    
    document.getElementById('checkout-button').addEventListener('click', async (e) => {
      
      e.preventDefault();

      // const selectedSizePrice = document.getElementById('price-options').value;

      const { name, email } = getUserInfo();
      console.log("request:",request);
      console.log("request:",request.id);

      const cartItems = getCartItems();
      // console.log("user : ", user);
      console.log("user : ", name);
      console.log("TOTAL: ",totalPrice);
      setTotalPrice(totalPrice);

      if (totalPrice === 0) {
        alert("Please select product");
      }

      totalPrice = 0;
      document.location.hash = '/signin';



    });
  },
  render: async () => {


    const request = parseRequestUrl();

    if (request.id) {
      console.log("Inside");
      const product = await getProduct(request.id);

      addToCart({
        product: product._id,
        name: product.name,
        image: product.image,
        price_small: product.price_small,
        price_medium: product.price_medium,
        price_large: product.price_large,
        countInStock: product.countInStock,
        selectedSize: "",
        total_price: totalPrice,
        qty: 1,
      });
    
    }
   
    const cartItems = getCartItems();
    const priceOptions = ["small", "medium", "large"];

    console.log(cartItems);
    return `
    <div class="content cart">
      <div class="cart-list">
        <ul class="cart-list-container">
          <li>
            <h3>Shopping Cart</h3>
          </li>
          ${
            cartItems.length === 0
              ? '<div>Cart is empty. <a href="/#/">Go Shopping</a>'
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
                  Qty: 
                  <select class="qty-select" id="${item.product}">
                  ${[...Array(item.countInStock).keys()].map((x) =>
                    item.qty === x + 1
                      ? `<option selected value="${x + 1}">${x + 1}</option>`
                      : `<option  value="${x + 1}">${x + 1}</option>`
                  )}  

                  </select>
                  <button type="button" value="${item}" class="delete-button" id="${
                    item.product
                  }">
                    Delete
                  </button>
                </div>
                <div>
                Size: 
                <select class="price-options" id="${item.product}">
                ${[...priceOptions].map((b) =>
                  item.selectedSize === b
                    ? `<option selected value="${b}">${b}</option>`
                    : `<option  value="${b}">${b}</option>`,
                )
              }  
  
  
                </select>
                </div>
                <h3>
              Subtotal (${item.qty} items)
              :
              $${calculateItemPrice(item, true).toFixed(2)}

            </h3>
              </div>

        

              <!--
              <li>
              <label for="price-options">Select Size:</label>
              
              <select id="price-options">
                <option value="${item.price_small}">Small - $${item.price_small}</option>
                <option value="${item.price_medium}">Medium - $${item.price_medium}</option>
                <option value="${item.price_large}">Large - $${item.price_large}</option>
              </select>


            </li>
            -->
           
              <!--
              <div class="cart-price">
                ${item.price_small} TL
                ${item.price_medium} TL
                ${item.price_large} TL
              </div>
              -->
            </li>
            `
                  )
                  .join('\n')
          } 
        </ul>
      </div>
      <div class="cart-action">
      <!-- <h3>Total: $${calculateTotal(cartItems)}</h3> -->
      <h3>Total: $${totalPrice}</h3> 
      <!--
          <h3>
            Subtotal (${cartItems.reduce((a, c) => a + c.qty, 0)} items)
            :
            $${cartItems.reduce((a, c) => a + c.price * c.qty, 0)}
          </h3>
          -->
          <button id="checkout-button" class="primary fw">
            Proceed to Checkout
          </button>
      </div>
    </div>
    `;
  },
};

export default CartScreen;
