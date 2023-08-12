document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const movieID = urlParams.get('movieID');
    if (movieID) {
        // Fetch movie details based on the movieID and display them on the page
        fetchMovieDetails(movieID);
    }
});

//fetching movie details from API using movie unique id
async function fetchMovieDetails(movieID) {
    const result = await fetch(`https://omdbapi.com/?i=${movieID}&apikey=14d4337e`);
    const movieDetails = await result.json();
    console.log(movieDetails)
    displayMovieDetails(movieDetails);
}

//Displaying movie details
function displayMovieDetails(details) {
    const movieDetailsContainer = document.getElementById('movie-details');
    movieDetailsContainer.innerHTML = `
        <div class="movie-poster">
            <img src="${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt="movie poster">
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${details.Title}</h3>
            <ul class="movie-misc-info">
                <li class="year">Year: ${details.Year}</li>
                <li class="rated">Ratings: ${details.Rated}</li>
                <li class="released">Released: ${details.Released}</li>
            </ul>
            <p class="genre"><b>Genre:</b> ${details.Genre}</p>
            <p class="writer"><b>Writer:</b> ${details.Writer}</p>
            <p class="actors"><b>Actors:</b> ${details.Actors}</p>
            <p class="plot"><b>Plot:</b> ${details.Plot}</p>
            <p class="language"><b>Language:</b> ${details.Language}</p>
            <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
        </div>
    `;
}
