import {
  parseRequestUrl,
  showLoading,
  hideLoading,
  showMessage,
  rerender,
} from '../utils';
import { getOrder, deliverOrder } from '../api';
import { getUserInfo, getTotalPrice} from '../localStorage';


const OrderScreen = {
  after_render: async () => {
    const request = parseRequestUrl();
    console.log("request:", request);
    console.log("request id:", request.id);

    if (document.getElementById('deliver-order-button')) {
      document.addEventListener('click', async () => {
        // showLoading();
        // await deliverOrder(request.id);
        // hideLoading();
        // showMessage('Order Delivered.');
        // rerender(OrderScreen);
        // document.location.hash = `/epilogue/${request.id}`;
        // document.location.hash = '/epilogue';
        document.location.hash = '/epilogue';

      });
    }
  },
  render: async () => {
    const { isAdmin } = getUserInfo();
    const request = parseRequestUrl();
    const total = getTotalPrice();

    console.log("request:", request);
    console.log("request id:", request.id);
    const {
      _id,
      shipping,
      payment,
      orderItems,
      totalPrice,
      isDelivered,
      deliveredAt,
      isPaid,
      paidAt,
    } = await getOrder(request.id);
    if (!isPaid) {
      console.log("");
    }
    return `
    <div>
    <h1>Order ${_id}</h1>
      <div class="order">
        <div class="order-info">
        <div>
        <h3>Order Summary</h3>
        <h2>Total Price: $${total}</h2>
        </div>
          <div>
            <h2>Shipping</h2>
            <div>
            ${shipping.address}, ${shipping.city}, ${shipping.postalCode}, 
            ${shipping.country}

            </div>
            ${
              isDelivered
                ? `<div class="success">Delivered at ${deliveredAt}</div>`
                : `<div class="error">Not Delivered</div>`
            }
             
          </div>
          <div>
            <h2>Payment</h2>
            <div>
              Payment Method : ${payment.paymentMethod}
            </div>
            ${
              isPaid
                ? `<div class="success">Paid at ${paidAt}</div>`
                : `<div class="error">Not Paid</div>`
            }
          </div>
          <div>
            <ul class="cart-list-container">
              <li>
                <h2>Shopping Cart</h2>
                <!-- <div>Price</div> -->
              </li>
              ${orderItems
                .map(
                  (item) => `
                <li>
                  <div class="cart-image">
                    <img src="${item.image}" alt="${item.name}" />
                  </div>
                  <div class="cart-name">
                    <div>
                      <a href="/#/product/${item.product}">${item.name} </a>
                    </div>
                    <div> Qty: ${item.qty} </div>
                  </div>
                  <!-- <div class="cart-price"> $${item.price}</div> -->
                </li>
                `
                )
                .join('\n')}
            </ul>
          </div>
        </div>
        <div class="order-action">
                <li>
                 <li>
  
                     <button id="deliver-order-button" class="primary fw">Epilogue</button>
                 
                 <li>
               
        </div>
      </div>
    </div>
    `;
  },
};
export default OrderScreen;
