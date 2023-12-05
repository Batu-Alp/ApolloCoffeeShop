import {
  getCartItems,
  getShipping,
  getPayment,
  cleanCart,
  getTotalPrice,
} from '../localStorage';
import CheckoutSteps from '../components/CheckoutSteps';
import { showLoading, hideLoading, showMessage, parseRequestUrl, rerender} from '../utils';
import { createOrder,deliverOrder,getOrder , updateCash} from '../api';

let isOrderSuccesfull = false;
let is_deliver= false;
let delivered_at= null;
let deliveryDateTime;

const convertCartToOrder = () => {
  const orderItems = getCartItems();
  if (orderItems.length === 0) {
    document.location.hash = '/cart';
  }
  const shipping = getShipping();
  if (!shipping.address) {
    document.location.hash = '/shipping';
  }
  const payment = getPayment();
  if (!payment.paymentMethod) {
    document.location.hash = '/payment';
  }

  return {
    orderItems,
    shipping,
    payment,
    
  };
};

let orderData = null;
let totalCost = 0;

const PlaceOrderScreen = {
  after_render: async () => {

    console.log("deliveryDateTime: ",deliveryDateTime);
    const request = parseRequestUrl();

    if (document.getElementById('placeorder-button')) {
  
      document.getElementById('placeorder-button')
      .addEventListener('click', async () => {

        deliveryDateTime = document.getElementById('deliveryDateTime').value;

        if (!deliveryDateTime) {
          alert('Please choose a delivery date and time.');
          return; // If deliveryDateTime is undefined or null, show the alert message.
        }
        isOrderSuccesfull = true;
        // await deliverOrder(request.id);
        // await deliverOrder(request.id, new Date(deliveryDateTime));
        await deliverOrder({
          _id: request.id,
          deliveryTime: new Date(deliveryDateTime)
        });

        console.log("Delivery time: ", deliveryDateTime);
        // const dd =  new Date(deliveryDateTime);
        // console.log("new Date (Delivery): ", dd.toISOString());

        rerender(PlaceOrderScreen);

      });
    }

    if (document.getElementById('deliver-order-button')) {

      document.getElementById('deliver-order-button')
      .addEventListener('click', async () => {
        if (isOrderSuccesfull === false) {
          alert("Please, first order");
        }
        else{

        alert('Order is succesfull.');
        cleanCart();
    
        rerender(PlaceOrderScreen);

        // document.location.hash = `/order/${orderData.order._id}`;
        document.location.hash = `/order/${request.id}`;

      
      }});
    }

    
  },
  render: async () => {

    const totalPrice = getTotalPrice();
    totalCost = totalPrice;

    const request = parseRequestUrl();
    console.log("request:", request);
    const {
      orderItems,
      shipping,
      payment,
    } = convertCartToOrder();


    console.log("request2:", request);

    const {
      _id,
      isDelivered,
      deliveredAt,
      isPaid,
      paidAt,
    } = await getOrder(request.id);
    console.log("_id: ", _id);
    console.log("deliveredAt: ", deliveredAt);
    console.log("isDelivered: ", isDelivered);


    // const totalPrice = getTotalPrice();
    // console.log(totalPrice);

    return `
    <div>
      ${CheckoutSteps.render({
        step1: true,
        step2: true,
        step3: true,
        step4: true,
      })}
      <div class="order">
        <div class="order-info">
          <div>
            <h2><b>Shipping</b></h2>
            <div>
            ${shipping.address}, ${shipping.city}, ${shipping.postalCode}, 
            ${shipping.country},
            <br><br>
            ${ isDelivered ? `<b>Deliver At: ${deliveryDateTime}</b>` : ``}
            </div>
            <div>
                <label for="deliveryDateTime">Choose Delivery Date/Time:</label>
                <input type="datetime-local" id="deliveryDateTime" name="deliveryDateTime" required>
            </div>
          </div>
          <div>
            <h2>Payment</h2>
            <div>
              Payment Method : ${payment.paymentMethod}
            </div>
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
                  <!-- <div class="cart-price"> $${totalPrice}</div> -->
                </li>
                `
                )
                .join('\n')}
            </ul>
          </div>
        </div>
        <div class="order-action">
           <ul>
                <li>
                  <h2><b>Order Summary</b></h2>
                 </li>
                 <li><div><b>Total Price</b></div><div>$${totalPrice}</div></li>
                 <li>
                 <button id="placeorder-button" class="primary fw">
                 Place Order
                 </button>
                 </li>
                 <li>
                 <button id="deliver-order-button" class="primary fw">
                 Order
                 </button>
                 </li>            

        </div>
      </div>
    </div>
    `;
  },
};
export default PlaceOrderScreen;
