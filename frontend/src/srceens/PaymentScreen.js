import { getUserInfo, setPayment,getCartItems, getShipping, getPayment, getTotalPrice} from '../localStorage';
import CheckoutSteps from '../components/CheckoutSteps';
import  {parseRequestUrl,showMessage} from '../utils';
import { createOrder,deliverOrder,getOrder } from '../api';

const totalPrice = getTotalPrice();

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
    totalPrice,
  };
};

const PaymentScreen = {
  after_render: () => {

    const request = parseRequestUrl();

    document
      .getElementById('payment-form')
      .addEventListener('submit', async (e) => {
        e.preventDefault();
        const paymentMethod = document.querySelector(
          'input[name="payment-method"]:checked'
        ).value;
        setPayment({ paymentMethod });

        const order = convertCartToOrder();
        console.log("order: ", order);
        const data = await createOrder(order);
        if (data.error) {
          showMessage(data.error);
        } 
        else {
          // await deliverOrder(request.id);
          console.log("request.id", request);
          document.location.hash = `/placeorder/${data.order._id}`;
        }
      });
  },
  render: () => {
    const { name } = getUserInfo();
    if (!name) {
      document.location.hash = '/';
    }
    return `
    ${CheckoutSteps.render({ step1: true, step2: true, step3: true })}
    <div class="payment-container">
      <form id="payment-form">
        <ul class="payment-items">
          <li>
            <h1>Credit Card</h1>
          </li>
          <li>
  <div class="payment-method">
    <label for="payment">Credit Card</label>
    <input
      type="radio"
      name="payment-method"
      id="payment"
      value="Credit Card"
      checked
    />
  </div>
</li>
          <li>
            <button type="submit" class="primary">Continue</button>
          </li>        
        </ul>
      </form>
    </div>
    `;
  },
};
export default PaymentScreen;
