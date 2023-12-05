import { signin } from '../api';
import { getUserInfo, setUserInfo } from '../localStorage';
import { showLoading, hideLoading, showMessage, redirectUser } from '../utils';
// eslint-disable-next-line import/no-extraneous-dependencies
// import 'bootstrap';
// eslint-disable-next-line import/no-extraneous-dependencies
// import 'bootstrap/dist/css/bootstrap.min.css';


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

const SigninScreen = {
  
  after_render: () => {

    autoWriteText();

    document
      .getElementById('signin-form')
      .addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoading();
        const data = await signin({
          email: document.getElementById('email').value,
          password: document.getElementById('password').value,
        });
        hideLoading();
        if (data.error) {
          showMessage(data.error);
        } else {
          setUserInfo(data);
          alert("Logged In. The Eagle Has Landed");
          // document.location.hash = `/`;

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

    <div class="login-container">
      <div class="form-container sign-in-container">
      
      <form id="signin-form">
        <ul class="form-items">
          <li>
            <h1>Log-in</h1>
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
            <button type="submit" class="primary">Login</button>
          </li>
          <li>
            <div>
              New User?
              <a href="/#/register">Create your account </a>
            </div>
          </li>
        </ul>
        
      </form>

  
    </div>
        <div class="overlay-container">
        <div class="overlay-greeting">
          <div class="overlay-panel">
            <img class="apollo-image" src="src/images/apollo.png" alt="Apollo" width="300px" />
            <h1>Welcome Back!</h1>
            <p>Please login to order your fresh coffee</p>
            <br><br>
            <!-- <p>"<i>Fresh Apollo coffee will blow you away</i>"</p> -->
            <div id="autoWriting" style="text-align: justify;"></div>

          </div>
        </div>
  </div>
    </div>
    `;
  },
};
export default SigninScreen;
