
const params = new URLSearchParams(location.search)
const imdbID = params.get("id")

if (imdbID){
    searchMovie(imdbID.trim())
}

// params will search from location and imdbID will get ?id=value from that params
console.log(imdbID);

async function searchMovie(id) {
    try {
        let response = await fetch(`https://www.omdbapi.com/?apikey=3c8289a9&i=${id}`)
        // check if the http error 404/500
        if (!response.ok) {
            throw new Error(`Http Error! Status: ${response.status}`)
        }
        const data = await response.json();
        console.log(data);

        if (data.Response === "True"){
            // displayMovies(data["Search"]);
        } else{
            // movieHub.innerHTML = `<p>${data.Error}</p>`
        }

    } catch (error) {
        console.log(error.message);
    }
}



