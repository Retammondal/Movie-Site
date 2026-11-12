const movieForm = document.querySelector("#searchMovie");           // Form Selection
const movieInput = document.querySelector("#movieInput");           // Form Input Field Selection
const movieHub = document.querySelector("#movieHub")                // Movie Display Parent Div Selection

const pagination = document.querySelector("#pagination")            // Pagination Selection
const prevBtn = document.querySelector("#prevBtn")
const nextBtn = document.querySelector("#nextBtn")
const pageInfo = document.querySelector("#pageInfo")

const filterForm = document.querySelector("#filterForm")            // Filters containing Form
const yearFilter = document.querySelector("#yearFilter")
const typeFilter = document.querySelector("#typeFilter")

const noFilters = document.querySelector("#noFilters")
const activeFilters = document.querySelector("#activeFilters")

const filterTags = document.querySelector("#filterTags")            // Filtered values containing div
const showYearFilter = document.querySelector("#showYearFilter")
const showTypeFilter = document.querySelector("#showTypeFilter")

const resetFilterBtn = document.querySelector("#resetFiltersBtn")
const clearInputBtn = document.querySelector("#clearInputBtn")


let totalResult = 0
let currentPage = 1
let currentQuery = null
let currentType = "all"
let currentYear = "all"

clearInputBtn.addEventListener('click',(e)=>{
    movieInput.value = '';
    movieInput.focus();
})

function filterButton() {
    if (currentYear == "all" && currentType == "all") {
        noFilters.classList.remove("hidden")
        activeFilters.classList.add("hidden")
        resetFilterBtn.classList.add("hidden")
    } else {
        noFilters.classList.add("hidden")
        activeFilters.classList.remove("hidden")
        resetFilterBtn.classList.remove("hidden")
    }

    showYearFilter.textContent = currentYear;
    showYearFilter.classList.toggle("hidden", currentYear === "all");

    showTypeFilter.textContent = currentType;
    showTypeFilter.classList.toggle("hidden", currentType === "all");
}

movieForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let query = movieInput.value.trim();     // query => Movie Inputs Value
    if (!query) {                            // ? Why this? -- to stop the function and not run unnecessarily for null data
        movieHub.innerHTML = `
        <div class="col-span-full text-center py-12">
        <p class="text-yellow-400 text-lg font-semibold">
        Please enter a movie name.
        </p>
        </div>
        `;
        movieInput.focus()
        return
    }

    currentPage = 1                         // why? => whenever we are doing new search currentPage will be 1
    currentQuery = query                    // why we are storing this query? => To use this same data in Filters


    console.log(filterTags);

    // typeFilter.classList.remove("hidden")
    // yearFilter.classList.remove("hidden")
    console.log(currentQuery, currentPage, currentType, currentYear);
    searchMovies(currentQuery, currentPage, currentType, currentYear);
    filterButton();

})

prevBtn.addEventListener('click', (e) => {
    if (!currentQuery) return;
    searchMovies(currentQuery, currentPage - 1, currentType, currentYear)
})
nextBtn.addEventListener("click", (e) => {
    if (!currentQuery) return;
    searchMovies(currentQuery, currentPage + 1, currentType, currentYear)
})

filterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentQuery) return;                          // Optimisation

    currentPage = 1                                     // Reset page to 1 when filter changes
    currentYear = yearFilter.value;                      // year value from Input
    currentType = typeFilter.value;                      // type value from Input
    console.log(currentQuery, currentPage, currentYear, currentType);

    searchMovies(currentQuery, currentPage, currentType, currentYear)
    filterButton();
})


resetFilterBtn.addEventListener("click", ()=>{
    currentType = "all";
    currentYear = "all";
    currentPage = 1;
    searchMovies(currentQuery, currentPage, currentType, currentYear)
    filterButton();
})


// * searchMovies --> Function which takes input MovieName,page,type,year --> it will give result by API fetch based on that..
async function searchMovies(movieName, page = 1, type = null, year = null) {
    try {
        // Given Here Tailwind Default rounding loading animmation
        movieHub.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-16 gap-4">
            <div class="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-gray-400">Finding your movies...</p>
        </div>
        `
        const typeParam = type && type !== "all" ? `&type=${type}` : "";
        const yearParam = year && year !== "all" ? `&y=${year}` : "";
        let response = await fetch(`https://www.omdbapi.com/?apikey=3c8289a9&s=${movieName}&page=${page}${typeParam}${yearParam}`);
        // check if the http error 404/500
        if (!response.ok) {
            throw new Error(`Http Error! Status: ${response.status}`)
        }
        const data = await response.json();
        // console.log(data);
        totalResult = data.totalResults
        currentPage = page
        // console.log(totalResult,displayedResult);

        if (data.Response === "True") {
            displayMovies(data["Search"]);
            paginationSet(page)
        } else {
            movieHub.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-4xl mb-4">🎬</div>
                <h2 class="text-xl font-semibold text-white">No movies found</h2>
                <p class="text-gray-400 mt-2">
                    Try another movie title or check your spelling.
                </p>
            </div>
            `
            movieInput.focus();
            pagination.classList.add("hidden");
        }

    } catch (error) {
        console.log("Movie Search Failed :", error);            // If Error came, error comes in console

        movieHub.innerHTML = `
        <div class="col-span-full text-center py-12">
            <p class="text-red-400 text-lg font-semibold">
                Something went wrong!
            </p>
            <p class="text-gray-400 mt-2">
                Please check your internet connection and try again.
            </p>
        </div>
        `
    }
}

function displayMovies(data) {
    movieHub.innerHTML = "";
    data.forEach(movie => {
        // console.log(movie);
        const div = document.createElement("div")
        div.dataset.imdbID = movie.imdbID
        div.setAttribute("class", `
            movie-card group overflow-hidden rounded-xl
            bg-[#171723] border border-white/10
            hover:border-purple-500/60
            hover:-translate-y-1 hover:shadow-xl
            hover:shadow-purple-900/20
            transition-all duration-300 cursor-pointer
        `);

        div.innerHTML = `
            <!-- Movie Poster -->
            <div class="aspect-[2/3] overflow-hidden bg-[#20202d]">
                <img
                    class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-400"
                    src="${movie.Poster === "N/A"
                ? "https://placehold.co/300x450/171723/ffffff?text=No+Poster"
                : movie.Poster}"
                    alt="${movie.Title}"
                    onerror="this.onerror=null; this.src='https://placehold.co/300x450/171723/ffffff?text=No+Poster'"
                >
            </div>

            <!-- Movie Information -->
            <div class="p-4 space-y-2">

                <div class="flex items-center justify-between gap-2">
                    <span class="text-xs font-semibold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md">
                        ${movie.Type}
                    </span>

                    <span class="text-xs text-gray-400">
                        ${movie.Year}
                    </span>
                </div>

                <h3 class="text-white font-semibold text-base leading-snug line-clamp-2 group-hover:text-purple-400 transition-colors">
                    ${movie.Title}
                </h3>

            </div>
        `;

        movieHub.append(div)
    });

}

// * Want to Give Event Listener to each div...Use concept of Event Listener 
// movieHub.addEventListener('click', (e) => {
//     e.stopPropagation();
//     const movieCard = e.target.closest(".movie-card")

//     const imdbID = movieCard.dataset.imdbID
//     console.log(imdbID);
//     location.href = `movie-details.html?id=${imdbID}`
// })



// ! Problem : During loading image is coming later and text is coming first...how to give all come together..or any other thing...

// ! location.href
// ! img onerror attribute
// ! button.disabled = true ; disabled the button working


function paginationSet(page) {
    pagination.classList.remove("hidden")
    let pageNeeded = Math.ceil(Number(totalResult) / 10);                     // e.g. 102 result - 11 pages
    pageInfo.innerHTML = `Page ${currentPage} of ${pageNeeded} | ${totalResult} `
    if (currentPage == 1) {
        prevBtn.disabled = true
    } else {
        prevBtn.disabled = false
    }
    if (currentPage == pageNeeded) {
        nextBtn.disabled = true
    } else {
        nextBtn.disabled = false
    }
}
