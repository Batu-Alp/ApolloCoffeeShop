import { getUserInfo } from '../localStorage';
import { parseRequestUrl } from '../utils';
import { getProducts } from '../api';
import Rating from './Rating';

const Header = {
  render: async () => {
    const { name, isAdmin, isSeller } = getUserInfo();
    const { value } = parseRequestUrl();

    // Eğer kullanıcı adı yoksa (name yoksa), search bar görünmez olsun
    const searchBar = !name
      ? ''
      : `
        <div class="search">
          <form class="search-form" id="search-form">
            <input type="text" name="q" id="q" value="${value || ''}" />
            <button type="submit"><i class="fa fa-search"></i></button>
          </form>
        </div>
      `;

    return `

      <div class="brand">
        <!-- <a href="/#/">Apollo</a> -->
        <a href="/#/">
        <img class="apollo-image" src="src/images/apollo.png" alt="Apollo" width="250px" />

        </a> 


      </div>
      ${searchBar}
      <div>
        <i class="glyphicon glyphicon-user"></i>
        ${
          name
            ? `<a href="/#/profile">${name}</a>`
            : `<a href="/#/signin">Log-in</a>`
        }  

        ${name && !isAdmin && !isSeller ? `
          <i class="fa fa-shopping-cart" style="font-size:18px"></i>
          <a href="/#/cart">Cart</a>`
          : ''}

        ${name && !isAdmin && !isSeller ? `
          <i class="fa fa-heart" style="font-size:18px"></i>
          <a href="/#/wishlist">Wishlist</a>` 
          : ''}

        ${name && !isAdmin && !isSeller ? `<a href="/#/customer-support">Customer Support</a>` : ''}

        ${isAdmin ? `<a href="/#/dashboard">Administration</a>` : ''}
        ${isSeller ? `<a href="/#/dashboard">Administration</a>` : ''}
        ${name ?`<a href="/#/recent-orders">Recent Orders</a>`: ''}
      </div>`;
  },
  after_render: async () => {
    const { value } = parseRequestUrl();
    const searchInput = document.getElementById('q');
    
    // Eğer kullanıcı adı yoksa (name yoksa), input event listener'ını ekleme
    if (searchInput) {
      const products = await getProducts({});
      searchInput.addEventListener('input', () => {
        const searchKeyword = searchInput.value.toLowerCase();
        const filteredProducts = products.filter(product =>
          product.name.toLowerCase().includes(searchKeyword)
        );
        // Burada filteredProducts ile istediğiniz işlemi yapabilirsiniz.
        console.log(filteredProducts);
      });

      document.getElementById('search-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const searchKeyword = searchInput.value;
        document.location.hash = `/?q=${searchKeyword}`;
      });
    }
  },
};

export default Header;
