// News
async function fetchNews(query = '') {
    const apiKey = '7d347fd244a84458a5cf8a7947328c40';
    try {
    const response = await fetch(`https://newsapi.org/v2/top-headlines?language=en&q=${query}&apiKey=${apiKey}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    displayNews(data.articles);
} catch (error) {
    console.error('Error fetching news:', error);
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '<p>Error loading news. Please try again later.</p>';
}


function displayNews(articles) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';
    if (articles.length === 0) {
        newsContainer.innerHTML = '<p>No news found.</p>';
        return;
    }
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
}