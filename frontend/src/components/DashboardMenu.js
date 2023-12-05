import { getUserInfo } from '../localStorage';
import { parseRequestUrl } from '../utils';

const DashboardMenu = {
  render: (props) => {
    const { name, isAdmin, isSeller } = getUserInfo();
    const { value } = parseRequestUrl();
    return `
    <div class="dashboard-menu">

    ${isAdmin ? `<a href="/#/dashboard"><b>Admin Administration</b></a>` : ''}

      <ul>
        <li class="${props.selected === 'dashboard' ? 'selected' : ''}">
          <a href="/#/dashboard">Dashboard</a>
        </li>
        ${isAdmin ? `<li class="${props.selected === 'orders' ? 'selected' : ''}">
          <a href="/#/orderlist">Orders</a>`: ""}
        </li>
        <li class="${props.selected === 'products' ? 'selected' : ''}">
          <a href="/#/productlist">Products</a>
        </li>
        ${isAdmin ? `<li class="${props.selected === 'customer-messages' ? 'selected' : ''}">
          <a href="/#/customer-messages">Customer Messages</a> `: ""}
        </li>
      </ul>
    </div>
    `;
  },
};
export default DashboardMenu;
