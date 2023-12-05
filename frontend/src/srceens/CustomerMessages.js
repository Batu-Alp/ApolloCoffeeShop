import {
    parseRequestUrl,
    showLoading,
    hideLoading,
  } from '../utils';
import { getSupports } from "../api";
import DashboardMenu from "../components/DashboardMenu";

const AdminSupportScreen = {
    render: async () => {
      //const request = parseRequestUrl();
      showLoading();
      
      const supports = await getSupports({ }); // Tüm şikayetleri almak için bir API çağrısı yapın
      console.log("a :", supports[0].reviews[0]);
      /*
      if (supports.error) {
        return `<div class="error">${supports.error}</div>`;
      }
      */
      hideLoading();

      return `
      <div class="dashboard">
      ${DashboardMenu.render({ selected: 'dashboard' })}
      <div class="dashboard-content">

          <h2>Support Requests</h2>
          <ul>
            ${supports.map((support) => `
              <li>
              <div>Name: ${support.reviews[0].name}</div> 
              <div>Id: ${support.reviews[0]._id}</div> 
              <div>Comment: ${support.reviews[0].comment}</div> 
              <div>CreatedAt : ${support.reviews[0].createdAt}</div> 

                <br><br><br>
              </li>
            `).join('')}
          </ul>
          </div>
        </div>
      `;
    }
  };
  
  export default AdminSupportScreen;