// News
async function fetchNews(query = '') {
    const apiKey = 7d347fd244a84458a5cf8a7947328c40;
    const response = await fetch(`https://newsapi.org/v2/top-headlines?language=en&q=${query}&apiKey=${apiKey}`);
    const data = await response.json();
    displayNews(data.articles);
}



