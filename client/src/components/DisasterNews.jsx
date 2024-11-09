import React, { useEffect, useState } from 'react';

function DisasterNews() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const API_KEY = import.meta.env.VITE_APP_API_KEY; // Properly declared as a constant

  useEffect(() => {
    fetch(`https://newsapi.org/v2/everything?q=disaster&apiKey=${'2bfc2d4881a84f0eb3807b5d0b18a660'}`)
      .then(response => response.json())
      .then(data => {
        if (data.articles) {
          setNews(data.articles);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching disaster news:', error);
        setNews([]); // Reset the news to an empty array in case of an error
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Latest Disaster News</h2>
      {isLoading ? (
        <p className="text-center text-gray-500">Loading news...</p>
      ) : (
        Array.isArray(news) && news.length ? (
          <ul className="space-y-4">
            {news.map((article, index) => (
              <li key={index} className="border-b pb-4">
                <h3 className="text-xl font-semibold text-blue-600">{article.title}</h3>
                <p className="text-gray-700 mt-2">{article.description}</p>
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-block mt-2 text-blue-500 hover:underline"
                >
                  Read more
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No news available or failed to fetch news.</p>
        )
      )}
    </div>
  );
}

export default DisasterNews;
