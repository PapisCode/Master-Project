// Currency conversion
async function fetchCurrencies() {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    populateCurrencyDropdown(data.rates);
}

