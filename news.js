// News
async function fetchNews(query = '') {
    const apiKey = 7d347fd244a84458a5cf8a7947328c40;
    const response = await fetch(`https://newsapi.org/v2/top-headlines?language=en&q=${query}&apiKey=${apiKey}`);
    const data = await response.json();
    displayNews(data.articles);
}

function displayNews(articles) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';
    articles.forEach(article => {
        const newsItem = `
        <div class="news-item">
        <h3>${article.title}</h3>
        <p>${article.description || ''}</p>
        <a href="${article.url}" target="_blank">Read More</a>
        </div>
        `;
        newsContainer.innerHTML += newsItem;
    });
}
fetchNews();