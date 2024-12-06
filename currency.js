// Currency conversion
async function fetchCurrencies() {
    try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    if (!response.ok) throw new Error(`Failed to fetch currencies: ${response.status}`);
    const data = await response.json();
    populateCurrencyDropdown(data.rates);
} catch (error) {
    console.error('Error fetching currencies:', error);
    document.getElementById('conversion-result').innerText = 'Failed to load currency data.';
}
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

        if (!amount || isNaN(amount)) {
            document.getElementById('conversion-result').innerText = 'Please enter a valid amount.';
            return;
        }

        try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        if (!response.ok) throw new Error(`Failed to fetch conversion rate: ${response.status}`);
        const data = await response.json();
        const result = amount * data.rates[toCurrency];
        document.getElementById('conversion-result').innerText = `${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`;
        } catch (error) {
            console.error('Error converting currency:', error);
            document.getElementById('conversion-result').innerText = 'Failed to convert currency. Please try again later.'; 
        }
    });

    fetchCurrencies();
