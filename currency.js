// API endpoint and key
const apiUrl = 'https://api.exchangerate-api.com/v4/latest/';
let defaultBaseCurrency = 'USD';

// Fetch and populate currency dropdowns
async function fetchCurrencies() {
    try {
        const response = await fetch(`${apiUrl}${defaultBaseCurrency}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch currencies: ${response.status}`);
        }
        const data = await response.json();
        populateCurrencyDropdown(data.rates);
    } catch (error) {
        console.error('Error fetching currencies:', error);
        document.getElementById('conversion-result').innerText = 'Error loading currency data.';
    }
}

// Populate dropdown lists with available currencies
function populateCurrencyDropdown(rates) {
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    Object.keys(rates).forEach(currency => {
        const option = `<option value="${currency}">${currency}</option>`;
        fromCurrency.innerHTML += option;
        toCurrency.innerHTML += option;
    });
    fromCurrency.value = defaultBaseCurrency;
}

// Currency conversion
async function convertCurrency() {
    const amount = document.getElementById('amount').value;
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;

    if (!amount || isNaN(amount)) {
        document.getElementById('conversion-result').innerText = 'Please enter a valid amount.';
        return;
    }

    try {
        const response = await fetch(`${apiUrl}${fromCurrency}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch currencies: ${response.status}`);
        }
        const data = await response.json();
        const rate = data.rates[toCurrency];
        const result = amount * rate;
        document.getElementById('conversion-result').innerText = `${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`;

        // Real-Time conversion rates
        document.getElementById('conversion-rate').innerText = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
    } catch (error) {
        console.error('Error converting currency:', error);
        document.getElementById('conversion-result').innerText = 'Error converting currency.';
    }
}

// Display historical conversion rates graph
async function fetchHistoricalData(fromCurrency, toCurrency) {
    try {
        const historicalUrl = `https://api.exchangerate.host/timeseries?start_date=${getPastDate(
            7
        )}&end_date=${getPastDate()}&base=${fromCurrency}&symbols=${toCurrency}`;
        const response = await fetch(historicalUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch historical data: ${response.status}`);
        }
        const data = await response.json();
        displayHistoricalGraph(data.rates, toCurrency);
    } catch (error) {
        console.error('Error fetching historical data:', error);
    }
}

// Function for past dates
function getPastDate(days = 0) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
}

// Display historical conversion rates graph
function displayHistoricalGraph(rates, toCurrency) {
    const labels = Object.keys(rates);
    const dataPoints = labels.map(date => rates[date][toCurrency]);

    const ctx = document.getElementById('currency-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: `Historical Conversion Rate for ${toCurrency}`,
                    data: dataPoints,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        },
    });
}

// Detect default base currency based on user location
async function detectDefaultBaseCurrency() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) {
            throw new Error('Failed to detect location');
        }
        const data = await response.json();
        defaultBaseCurrency = data.currency || 'USD';
    } catch (error) {
        console.error('Error detecting base currency:', error);
        defaultBaseCurrency = 'USD';
    }
}

// Save favorite currencies
function saveFavoriteCurrency(fromCurrency, toCurrency) {
    const favorites = JSON.parse(localStorage.getItem('favoriteCurrencies')) || [];
    favorites.push({ from: fromCurrency, to: toCurrency });
    localStorage.setItem('favoriteCurrencies', JSON.stringify(favorites));
    alert('Currency pair saved as favorite!');
}

// Load and display favorite currencies
function showFavoriteCurrencies() {
    const favorites = JSON.parse(localStorage.getItem('favoriteCurrencies')) || [];
    const favoritesContainer = document.getElementById('favorites-container');
    favoritesContainer.innerHTML = '<h3>Favorite Currency Pairs:</h3>';
    if (favorites.length === 0) {
        favoritesContainer.innerHTML += '<p>No favorites saved.</p>';
        return;
    }
    favorites.forEach(pair => {
        favoritesContainer.innerHTML += `<p>${pair.from} -> ${pair.to}</p>`;
    });
}

// Event listeners
document.getElementById('convert-btn').addEventListener('click', () => {
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    convertCurrency();
    fetchHistoricalData(fromCurrency, toCurrency);
});

document.getElementById('save-favorite-btn').addEventListener('click', () => {
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    saveFavoriteCurrency(fromCurrency, toCurrency);
});

document.getElementById('show-favorites-btn').addEventListener('click', showFavoriteCurrencies);

// Initialize the app
(async function init() {
    await detectDefaultBaseCurrency();
    await fetchCurrencies();
})();
