import {
    showLoading,
    hideLoading,
  } from '../utils';
  import { getOrders } from '../api';
  import {getTotalPrice} from '../localStorage';

  const RecentOrders = {
    after_render: async () => {
    /*
    
      if (document.getElementById('home-page')) {
        document.getElementById('home-page').addEventListener('click', () => {
          document.location.hash = '/';
        });
      }
      */
    },
    render: async () => {
        // showLoading();
        const recentOrdersPromise = getOrders();
        const recentOrders = await recentOrdersPromise;

        // createdDate'e göre azalan sırayla sırala (en yeni ilk sırada)
        recentOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
        const recentOrdersSlice = recentOrders.slice(0, 10); // En son 10 siparişi al
      
        // hideLoading();
      
        return `
          <div>
            <h1>Recent Orders</h1>
            ${recentOrdersSlice.map(order => `
              <div class="order">
                <div class="order-info">
                  <div>
                    <h3>Order Summary</h3>
                    <h2>Total Price: $${order.totalPrice}</h2>
                    <h2>Order Date: $${order.createdAt}</h2>

                  </div>
                  <div>
                    <h2>Shipping</h2>
                    <div>
                      ${order.shipping.address}, ${order.shipping.city}, ${order.shipping.postalCode}, 
                      ${order.shipping.country}
                    </div>
               
                  </div>
                  <div>
                    <h2>Payment</h2>
                    <div>
                      Payment Method : ${order.payment.paymentMethod}
                    </div>
                    ${
                      order.isPaid
                        ? `<div class="success">Paid at ${order.paidAt}</div>`
                        : `<div class="error">Not Paid</div>`
                    }
                  </div>
                  <div>
                    <ul class="cart-list-container">
                      <li>
                        <h2>Shopping Cart</h2>
                        <!-- <div>Price</div> -->
                      </li>
                      ${order.orderItems
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
              </div>
            `).join('')}
          </div>
        `;
      },
      
  };
  
  export default RecentOrders;
  