document.addEventListener("DOMContentLoaded", function() {
  const billContainer = document.getElementById("bill-container");

  // Replace 'YOUR_ORDER_ID' with the actual order ID obtained from Postman
  const orderId = 'YOUR_ORDER_ID';

  // Replace 'YOUR_API_KEY' with your actual API key, if required
  const apiKey = '234';

  // Example dish IDs obtained from the schema
  const dishIds = [
      "692a4a34a46ecf001f35ac6f",
      "6a4a857c022eb7001f9b8972",
      "6b7c2441a0db43001f9bf377"
  ];

  // Fetch order details from POS API
  fetch(`http://localhost:4010/orders/${orderId}`, {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          // Add any required authorization headers here
      }
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Failed to fetch order details');
      }
      return response.json();
  })
  .then(data => {
      // Override dish IDs with the example dish IDs from the schema
      data.dish_ids = dishIds;

      // Create bill elements
      const items = data.dish_ids.map(dishId => {
          // Retrieve dish details using dishId
          // Replace the following line with logic to fetch dish details from your API
          const dishDetails = { name: "Example Dish", price: 9.99 };

          return {
              name: dishDetails.name,
              price: dishDetails.price
          };
      });

      const subtotal = items.reduce((acc, item) => acc + item.price, 0);
      const tax = subtotal * 0.1; // Assuming 10% tax
      const total = subtotal + tax;

      const billHTML = `
          <div class="item">
              <h2>Food Items</h2>
              <ul>
                  ${items.map(item => `<li>${item.name}: $${item.price.toFixed(2)}</li>`).join('')}
              </ul>
          </div>
          <div class="total">
              <p>Subtotal: $${subtotal.toFixed(2)}</p>
              <p>Tax (10%): $${tax.toFixed(2)}</p>
              <p>Total: $${total.toFixed(2)}</p>
          </div>
      `;

      // Add bill to container
      billContainer.innerHTML = billHTML;
  })
  .catch(error => console.error('Error fetching order details:', error));
});
