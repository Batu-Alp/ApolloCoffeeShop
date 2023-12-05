

export const getCartItems = () => {
  const cartItems = localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [];
  return cartItems;
};
export const setCartItems = (cartItems) => {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
};

export const getTotalPrice= () => {
  const totalPrice = localStorage.getItem('totalPrice')
    ? JSON.parse(localStorage.getItem('totalPrice'))
    : [];
  return totalPrice;
};
export const setTotalPrice = (totalPrice) => {
  localStorage.setItem('totalPrice', JSON.stringify(totalPrice));
};

export const getWishlistItems = () => {
  const wishlistItems = localStorage.getItem('wishlistItems')
    ? JSON.parse(localStorage.getItem('wishlistItems'))
    : [];
  return wishlistItems;
};
export const setWishlistItems = (wishlistItems) => {
  localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
};

export const setUserInfo = ({
  _id = '',
  name = '',
  email = '',
  password = '',
  token = '',
  isAdmin = false,
  isSeller = false,
}) => {
  localStorage.setItem(
    'userInfo',
    JSON.stringify({
      _id,
      name,
      email,
      password,
      token,
      isAdmin,
      isSeller,

    })
  );
};
export const clearUser = () => {
  localStorage.removeItem('userInfo');
};
export const getUserInfo = () => {
  return localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : { name: '', email: '', password: '' };
};
export const getShipping = () => {
  const shipping = localStorage.getItem('shipping')
    ? JSON.parse(localStorage.getItem('shipping'))
    : {
        address: '',
        city: '',
        postalCode: '',
        country: '',
      };
  return shipping;
};
export const setShipping = ({
  address = '',
  city = '',
  postalCode = '',
  country = '',
}) => {
  localStorage.setItem(
    'shipping',
    JSON.stringify({ address, city, postalCode, country })
  );
};

export const getPayment = () => {
  const payment = localStorage.getItem('payment')
    ? JSON.parse(localStorage.getItem('payment'))
    : {
        paymentMethod: 'paypal',
      };
  return payment;
};
export const setPayment = ({ paymentMethod = 'paypal' }) => {
  localStorage.setItem('payment', JSON.stringify({ paymentMethod }));
};
export const cleanCart = () => {
  localStorage.removeItem('cartItems');
};
export const cleanWishlist = () => {
  localStorage.removeItem('wishlistItems');
};
