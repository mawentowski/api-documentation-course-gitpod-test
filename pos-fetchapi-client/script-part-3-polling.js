document.addEventListener("DOMContentLoaded", function() {
    const billContainer = document.getElementById("bill-container");

    // Define a function to fetch data from the server and update the UI
    function fetchDataAndUpdateUI() {
        // Fetch data from the server
        fetch('http://localhost:4010/orders')
            .then(response => response.json())
            .then(data => {
                // Update UI with the fetched data
                updateUI(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Define a function to update the UI with the fetched data
    function updateUI(data) {
        // Create bill elements
        const items = data.items;
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
    }

    // Polling interval (fetch data every 5 seconds)
    setInterval(fetchDataAndUpdateUI, 5000);

    // Initial fetch and update
    fetchDataAndUpdateUI();
});
