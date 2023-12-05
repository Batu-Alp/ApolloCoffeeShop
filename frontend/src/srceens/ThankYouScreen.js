import {
  parseRequestUrl,
  showLoading,
  hideLoading,
  showMessage,
  rerender,
} from '../utils';
import { getOrder, payOrder, deliverOrder } from '../api';
import { getUserInfo, getTotalPrice } from '../localStorage';

const generateOrderNumber = () => {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${randomNum}`;
};

const ThankYouScreen = {
  after_render: async () => {

    /*
    
    if (document.getElementById('home-page')) {
      document.getElementById('home-page').addEventListener('click', async () => {
        document.location.hash = '/';
      });
    }

    */
  },
  render: async () => {
    const orderNumber = generateOrderNumber();

    return `
      <div class="thank-you-container">
        <h1 class="thank-you-heading"><b>Thank You For Your Order!</b></h1>
        <p class="order-number">Your order number is: ${orderNumber}</p>
        <p class="order-details">We've received your order and are processing it. You will receive an email confirmation shortly.</p>
        <div class="thank-you-actions">
        <a href="/#/" class="home-button">
        <button id="home-btn" class="thanks-btn fw">Home Page</button>
        <!-- <button id="home-page" class="primary fw">Home Page</button> -->
        </a>
        <br><br>
        <img class="apollo-image" src="src/images/apollo.png" alt="Apollo" width="300px" />

          </div>
      </div>
    `;
  },
};

export default ThankYouScreen;
