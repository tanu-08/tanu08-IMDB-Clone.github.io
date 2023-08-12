//Fetch all elements by id
const movieSearchBox = document.getElementById('search-bar');
const searchList = document.getElementById('search-feed');
const favList = document.getElementById('show-fav');

let favArray = [];//defined an empty array for storing fav movie

//showing list of fvrt movies on coming back from another page by fetching data from local storage
const storedFavorites = JSON.parse(localStorage.getItem('favorites'));
if (storedFavorites) {
    favArray = storedFavorites;
    displayFavList(favArray);
}

//clear fav movie list on reload
document.addEventListener('DOMContentLoaded', () => {
    localStorage.clear();
});

//fetching data from OMDB Api
async function loadItems(title){
    console.log(title)
    const URL = `https://omdbapi.com/?s=${title}&apikey=14d4337e`;
    // const URL = `https://omdbapi.com/?s=${title}&page=1&apikey=fc1fef96`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    console.log(data.Search);
    if(data.Response == "True") displayList(data.Search);
}

//collect search term from user and calling API
function searchMovie(){
    let searchTitle = (movieSearchBox.value).trim();
    if(searchTitle.length > 0){
        searchList.classList.remove('hide-search-list');
        loadItems(searchTitle);
    }
    else{
        searchList.classList.add('hide-search-list')
    }
}

//displaying fetched data in serach list every time we change search text
function displayList(movies) {
    searchList.innerHTML = ""; // Clear the existing content before adding new items
    for (let idx = 0; idx < movies.length; idx++) {
        let searchItem = document.createElement('div'); // Create a new container div
        searchItem.dataset.id = movies[idx].imdbID;
        searchItem.classList.add('search-item');
        let moviePoster = "";
        if (movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else
            moviePoster = "image_not_found.png";
        const isMovieInFavorites = favArray.some(item => item.id === movies[idx].imdbID);
        const addToFavButtonText = isMovieInFavorites ? 'Added to Fav' : 'Add to Fav';

        searchItem.innerHTML = `
                <span class="left-search" id="left-search">
                    <img alt="poster" class="poster" src="${moviePoster}">
                </span>
                <span class="right-search" id="right-search">
                    <h3 class="movie-name">${movies[idx].Title}</h3>
                    <p class="movie-year">${movies[idx].Year}</p>
                    <button class="add-to-fav-btn" type="submit">${addToFavButtonText}</button>
                </span>
        `;
        //handle click to navigate to movieDetails page
        searchItem.addEventListener('click', (event) => {
            if (!event.target.classList.contains('add-to-fav-btn')) {
                navigateToMovieDetails(movies[idx].imdbID);
            }
        });
        searchList.appendChild(searchItem); // Append the container to the searchList
    }
    addToFavourite()
}

//Adding movie to favourite list on clicking fvrt button
function addToFavourite(){
    const searchListMovies = searchList.querySelectorAll('.search-item');
    searchListMovies.forEach(movie => {
        const addToFavButton = movie.querySelector('.add-to-fav-btn');
        const movieID = movie.dataset.id;
        //checking if already added or not
        const isMovieInFavorites = favArray.some(item => item.id === movieID);
        if(!isMovieInFavorites && !addToFavButton.disabled) {
            addToFavButton.addEventListener('click', (event) => {
                event.preventDefault();
                const movieName = movie.querySelector('.movie-name').textContent;
                const movieYear = movie.querySelector('.movie-year').textContent;
                const moviePoster = movie.querySelector('.poster').src; // Use .src to get the poster source
                const movieID = movie.dataset.id;
                console.log(movieName,movieYear,moviePoster,movieID);
                
                // Create an object representing the movie and store it in local storage
                const movieData = {
                    name: movieName,
                    year: movieYear,
                    poster: moviePoster,
                    id: movieID
                };
                favArray.push(movieData);
                displayFavList(favArray);
                saveToLocalStorage(movieData);

                //  Provide visual feedback to the user that the movie has been added to favorites
                addToFavButton.textContent = 'Added to Fav';
                addToFavButton.disabled = true;
            });
        }
    })
}

//displaying fav list movies
function displayFavList(favArray){
    favList.innerHTML = ""; // Clear the existing content before adding new items
    if(favArray.length>0){
        favList.style.visibility = "visible"
    }
    else{
        favList.style.visibility = "hidden"
    }
    for (let idx = 0; idx < favArray.length; idx++) {
        let favItem = document.createElement('div'); // Create a new container div
        favItem.dataset.id = favArray[idx].id;
        favItem.classList.add('fav-items');
        let moviePoster = "";
        if (favArray[idx].poster != "N/A")
            moviePoster = favArray[idx].poster;
        else
            moviePoster = "image_not_found.png";

        favItem.innerHTML = `
                <span class="left-search" id="left-search">
                    <img alt="poster" class="poster" src="${moviePoster}">
                </span>
                <span class="right-search" id="right-search">
                    <h3 class="movie-name">${favArray[idx].name}</h3>
                    <p class="movie-year">${favArray[idx].year}</p>
                </span>
        `;
        favList.appendChild(favItem); // Append the container to the searchList
    }
}

//Saving to local storage
function saveToLocalStorage(movieData) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push(movieData);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

//navigation to Movie Details page
function navigateToMovieDetails(movieID) {
    // Generate the URL for the movie details page, including the movie ID
    const movieDetailsURL = `movieDetails.html?movieID=${movieID}`;
    window.location.href = movieDetailsURL;
}

//hiding search list
window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }
});