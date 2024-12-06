// Currency conversion
async function fetchCurrencies() {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    populateCurrencyDropdown(data.rates);
}

function populateCurrencyDropdown(rates) {
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    Object.keys(rates).forEach(currency => {
        fromCurrency.innerHTML += `<option value="${currency}">${currency}</option>`;
        toCurrency.innerHTML += `<option value="${currency}">${currency}</option>`;
    });
}

    
    document.getElementById('convert-btn').addEventListener('click', async () => {
        const amount = document.getElementById('amount').value;
        const fromCurrency = document.getElementById('from-currency').value;
        const toCurrency = document.getElementById('to-currency').value;
        const response = await fetch(`https://api.exchange-api.com/v4/latest/${fromCurrency}`);
        const data = await response.json();
        const result = amount * data.rates[toCurrency];
        document.getElementById('conversion-result').innerText = `${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`;   
    });

    fetchCurrencies();
