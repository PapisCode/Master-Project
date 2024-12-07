// News
    const apiKey = '7d347fd244a84458a5cf8a7947328c40';
    // Fetch and Display news based on query, category, or country
    async function fetchNews(query = '', category = '', country = '') {
    try {
    const url = `https://newsapi.org/v2/top-headlines?language=en&q=${query}&category=${category}&country=${country}&apiKey=${apiKey}`;
    const response = await fetch(url);
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
}

//Display news articles
function displayNews(articles) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';
    if (!articles.length === 0) {
        newsContainer.innerHTML = '<p>No news found.</p>';
        return;
    }
    articles.forEach(article => {
        const newsItem = `
        <div class="news-item">
        <h3>${article.title}</h3>
        <p>${article.description || 'No description available'}</p>
        <a href="${article.url}" target="_blank">Read More</a>
        </div>
        `;
        newsContainer.innerHTML += newsItem;
    });

    //bookmark button
    document.querySelectorAll('bookmark-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const title = event.target.getAttribute('data-title');
            const url = event.target.getAttribute('data-url');
            saveBookmark(title, url);
        });
    });
}

// Save bookmark to local storage
function saveBookmark(title, url) {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    bookmarks.push({ title, url });
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    alert('Bookmark saved!');
}

// Show bookmarks in the news container
function showBookmarks(){
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';
    if (bookmarks.length === 0) {
        newsContainer.innerHTML = '<p>No bookmarks saved.</p>';
        return;
    }
    bookmarks.forEach(bookmark => {
        const newsItem = `
        <div class="news-item">
        <h3>${bookmark.title}</h3>
        <a href="${bookmark.url}" target="_blank">Read More</a>
        </div> 
        `;
        newsContainer.innerHTML += newsItem;
});
}

//Category Filter
document.getElementById('news-category').addEventListener('change', (event) => {
    const category = event.target.value;
    fetchNews('', category);
});

// input field to detect "Enter" key
document.getElementById('news-search').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const query = event.target.value.trim();
        fetchNews(query);
    } else {
        document.getElementById('news-container').innerHTML = '<p>Please enter a search.</p>';
    }
});

// showing bookmarks
document.getElementById('show-bookmarks').addEventListener('click', showBookmarks);

fetchNews();
