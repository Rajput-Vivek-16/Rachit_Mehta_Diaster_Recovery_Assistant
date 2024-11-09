import React, { useEffect, useState } from 'react';

function DisasterNews() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8); // Initial number of visible cards
  const [userCountry, setUserCountry] = useState(null);

  useEffect(() => {
    // Get user's location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Fetch the country code based on latitude and longitude
        try {
          const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const locationData = await response.json();
          setUserCountry(locationData.countryName);
        } catch (error) {
          console.error('Error fetching location data:', error);
        }
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  }, []);

  useEffect(() => {
    if (userCountry) {
      setIsLoading(true);
      fetch(`https://newsapi.org/v2/everything?q=disaster+${userCountry}&apiKey=2bfc2d4881a84f0eb3807b5d0b18a660`)
        .then((response) => response.json())
        .then((data) => {
          if (data.articles) {
            // Filter out articles with the word "removed" in the title or description
            const filteredArticles = data.articles.filter(
              (article) =>
                !article.title.toLowerCase().includes('removed') &&
                (!article.description || !article.description.toLowerCase().includes('removed'))
            );
            setNews(filteredArticles); // Set filtered articles
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching disaster news:', error);
          setNews([]);
          setIsLoading(false);
        });
    }
  }, [userCountry]);

  // Handle "Show More" button click
  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 4); // Show 4 more cards each time
  };

  return (
    <div className="container mx-auto p-12 bg-gray-100 shadow-md rounded-lg">
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">Latest Disaster News</h2>
      {isLoading ? (
        <p className="text-center text-gray-500">Loading news...</p>
      ) : (
        Array.isArray(news) && news.length ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {news.slice(0, visibleCount).map((article, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200 flex flex-col">
                  {/* Image Condition */}
                  {article.urlToImage ? (
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-full h-24 sm:h-32 md:h-40 lg:h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-24 sm:h-32 md:h-40 lg:h-48 bg-gray-200 flex justify-center items-center text-gray-500">No Image Available</div>
                  )}

                  <div className="p-4 flex flex-col flex-grow">
                    {/* Title */}
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">{article.title}</h3>
                    
                    {/* Description Condition */}
                    <p className="text-gray-600 text-xs sm:text-sm mb-4 overflow-hidden text-ellipsis whitespace-nowrap">
                      {article.description ? article.description : 'No Description Available'}
                    </p>
                  </div>

                  {/* "Read more" Link */}
                  <div className="p-4 mt-auto">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-red-500 hover:text-red-600 hover:underline font-medium text-xs sm:text-sm"
                    >
                      Read more
                    </a>
                  </div>
                </div>
              ))}
            </div>
            {visibleCount < news.length && (
              <div className="text-center mt-6">
                <button
                  onClick={handleShowMore}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                >
                  Show More
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500">No news available or failed to fetch news.</p>
        )
      )}
    </div>
  );
}

export default DisasterNews;
