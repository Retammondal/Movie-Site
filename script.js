const movieForm = document.querySelector("#searchMovie");
const movieInput = document.querySelector("#movieInput");
const movieHub = document.querySelector("#movieHub")

movieForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let query = movieInput.value.trim();
    if (!query) {                            // ? Why this? -- to stop the function and not run unnecessarily for null data
        return
    }
    // console.log(query);
    searchMovie(query);
})

async function searchMovie(movieName) {
    try {
        movieHub.innerHTML = `<div class="loader"></div>`
        let response = await fetch(`https://www.omdbapi.com/?apikey=3c8289a9&s=${movieName}`)
        // check if the http error 404/500
        if (!response.ok) {
            throw new Error(`Http Error! Status: ${response.status}`)
        }
        const data = await response.json();
        console.log(data);
        displayMovies(data["Search"]);

    } catch (error) {
        console.log(error.message);
    }
}

function displayMovies(data) {
    movieHub.innerHTML = "";
    data.forEach(movie => {
        console.log(movie);
        const div = document.createElement("div")
        div.innerHTML = `
            <div>
                <img src=${movie.Poster} alt="">
            </div>
            <div>
                <h3>${movie.Title}</h3>
                <p>${movie.Year}</p>
            </div>
        `
        movieHub.append(div)
    });

}

// ! Problem : During loading image is coming later and text is coming first...how to give all come together..or any other thing...