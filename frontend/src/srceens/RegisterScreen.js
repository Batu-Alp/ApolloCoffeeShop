import { register } from '../api';
import { getUserInfo, setUserInfo } from '../localStorage';
import { showLoading, hideLoading, showMessage, redirectUser } from '../utils';


const img1 = "ApolloFresh.PNG";

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


function autoWriteText() {
  const text = "We are your door to new horizons in the world of coffee! We choose the challenge and embark on a flavor adventure in every cup. With coffee notes dancing in our taste, every drop is a discovery, every sip is a flavor journey. Discover new tastes in the coffee world with us, because success is hidden in every sip.";
  const autoWriteDiv = document.getElementById('autoWriting');
  let index = 0;

  const intervalId = setInterval(() => {
    autoWriteDiv.innerHTML += `<em>${text[index]}</em>`;
    index += 1;

    if (index === text.length) {
      clearInterval(intervalId);
    }
  }, 50); // Yazı hızını ayarlayabilirsiniz (ms cinsinden)
}

const RegisterScreen = {

  after_render: () => {

    autoWriteText();

    
    document
      .getElementById('register-form')
      .addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const cash = document.getElementById('cash').value;

        if (!validateEmail(email)) {
          showMessage('Please enter a valid email address.');
          return;
        }

        showLoading();
        const data = await register({ name, email, password, cash });
        hideLoading();
        
        if (data.error) {
          showMessage(data.error);
        } else {
          setUserInfo(data);
          alert("The account is created. Welcome to Apollo.");
          // document.location.hash = `/signin`;
          redirectUser();
        }

      });
  },
  render: () => {
    /*
    if (getUserInfo().name) {
      redirectUser();
    }
    */
    if (getUserInfo().name) {
      redirectUser();
    }
    return `

    <div class="register-container">

    <div class="form-container sign-up-container">
      <form id="register-form">
        <ul class="form-items">
          <li>
            <h1>Create Account</h1>
          </li>
          <li>
            <label for="name">Name</label>
            <input type="name" name="name" id="name" />
          </li>
          <li>
            <label for="email">Email</label>
            <input type="email" name="email" id="email" />
          </li>
          <li>
            <label for="password">Password</label>
            <input type="password" name="password" id="password" />
          </li>
          <li>
            <label for="repassword">Re-Enter Password</label>
            <input type="password" name="repassword" id="repassword" />
          </li>
           <li>
            <label for="cash">Cash</label>
            <input type="cash" name="cash" id="cash" />
          </li>
          <li>
            <button type="submit" class="primary">Register</button>
          </li>
          <li>
            <div>
              Already have an account?
              <a href="/#/signin">Log-in </a>
            </div>
          </li>
        </ul>
      </form>
    </div>
    <div class="overlay-container">
    <div class="overlay-greeting">
      <div class="overlay-panel">
        <img class="apollo-image" src="src/images/apollo.png" alt="Apollo" width="300px" />
        <h1>Hello There!</h1>
        <p>We've been waiting for you</p>
        <!-- <p align="justify"><i>"We are your door to new horizons in the world of coffee! We choose the challenge and embark on a flavor adventure in every cup. With coffee notes dancing in our taste, every drop is a discovery, every sip is a flavor journey. Discover new tastes in the coffee world with us, because success is hidden in every sip ."<i></p> -->
        <div id="autoWriting" style="text-align: justify;"></div>
        </div>
</div>
    </div>
    `;
  },
};
export default RegisterScreen;
