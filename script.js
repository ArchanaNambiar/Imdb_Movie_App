const searchButton = document.getElementById('searchButton');
const apiKeyInput = document.getElementById('apiKeyInput');
const movieTitleInput = document.getElementById('movieTitleInput');
const loader = document.getElementById('loader');
const resultsContainer = document.getElementById('results');

movieTitleInput.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("searchButton").click();
  }
});

searchButton.addEventListener('click', async () => {
  const apiKey = apiKeyInput.value;
  const movieTitle = movieTitleInput.value;
  document.getElementById('errormessage').style.display = 'none'
  if (!apiKey || !movieTitle) {
    // alert('Please provide both API key and movie title.');
    document.getElementById('errormessage').style.display = 'block'
    document.getElementById('errormessage').innerHTML="Please provide both API key and movie title";
    return;
  }

  loader.style.display = 'block';
  resultsContainer.innerHTML = '';

  const apiUrl = `https://www.omdbapi.com/?s=${encodeURIComponent(movieTitle)}&apikey=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.hasOwnProperty('Error')){
      document.getElementById('errormessage').style.display = 'block'
      document.getElementById('errormessage').innerHTML=data.Error;
    }
    if (data.Search) {
      
      data.Search.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
        <a href="https://www.imdb.com/title/${movie.imdbID}" target="_blank"><img src="${movie.Poster}" alt="${movie.Title}"></a>
          <div class="details"><h3>${movie.Title}</h3>
          <p>Year: ${movie.Year}</p>
          <p>Type: ${movie.Type}</p>
          <a href="https://www.imdb.com/title/${movie.imdbID}" target="_blank">More Details</a></div>
        `;
        resultsContainer.appendChild(movieCard);
      });
    } else {
      resultsContainer.innerHTML = '<p>No results found.</p>';
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    document.getElementById('errormessage').innerHTML=error;
  } finally {
    loader.style.display = 'none';
  }
});
