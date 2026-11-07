

const movieForm = document.querySelector("#movieForm");
const movieInput = document.querySelector("#movieInput");
const movieHub = document.querySelector("#movieHub");
const sectionHeading = document.querySelector("#sectionHeading");
const sectionSubtitle = document.querySelector("#sectionSubtitle");
const resetMixBtn = document.querySelector("#resetMixBtn");
const clearSearchBtn = document.querySelector("#clearSearchBtn");
const genreChips = document.querySelectorAll(".genre-chip");

// Curated mix of acclaimed movies across different genres for the landing page
const defaultMoviesMix = [
    {
        Title: "Oppenheimer",
        Year: "2023",
        Type: "movie",
        imdbID: "tt15398776",
        Poster: "https://m.media-amazon.com/images/M/MV5BN2JkMDc5MGQtZjg3YS00NmFiLWIyZmQtZTJmNTM5MjVmYTQ4XkEyXkFqcGc@._V1_SX300.jpg"
    },
    {
        Title: "Dune: Part Two",
        Year: "2024",
        Type: "movie",
        imdbID: "tt15239678",
        Poster: "https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGc@._V1_SX300.jpg"
    },
    {
        Title: "Interstellar",
        Year: "2014",
        Type: "movie",
        imdbID: "tt0816692",
        Poster: "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_SX300.jpg"
    },
    {
        Title: "Spider-Man: Across the Spider-Verse",
        Year: "2023",
        Type: "movie",
        imdbID: "tt9362722",
        Poster: "https://m.media-amazon.com/images/M/MV5BNThiZjA3MjItZGY5Ni00ZmJhLWEwN2EtOTBlYTA4Y2E0M2ZmXkEyXkFqcGc@._V1_SX300.jpg"
    },
    {
        Title: "Parasite",
        Year: "2019",
        Type: "movie",
        imdbID: "tt6751668",
        Poster: "https://m.media-amazon.com/images/M/MV5BYjk1Y2U4MjQtY2ZiNS00OWQyLWI3MmYtZWUwNmRjYWRiNWNhXkEyXkFqcGc@._V1_SX300.jpg"
    },
    {
        Title: "John Wick: Chapter 4",
        Year: "2023",
        Type: "movie",
        imdbID: "tt10366206",
        Poster: "https://m.media-amazon.com/images/M/MV5BY2Q2ZmI5ZjUtNWVhMC00YzJkLTlmYjMtY2RmZDhkNzEzYjZhXkEyXkFqcGc@._V1_SX300.jpg"
    },
    {
        Title: "The Godfather",
        Year: "1972",
        Type: "movie",
        imdbID: "tt0068646",
        Poster: "https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_SX300.jpg"
    },
    {
        Title: "Blade Runner 2049",
        Year: "2017",
        Type: "movie",
        imdbID: "tt1856101",
        Poster: "https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_SX300.jpg"
    },
    {
        Title: "Whiplash",
        Year: "2014",
        Type: "movie",
        imdbID: "tt2582802",
        Poster: "https://m.media-amazon.com/images/M/MV5BMDFjOWFkYzktYzhhMC00NmYyLTkwY2EtYjViMDhmNzg0OGFkXkEyXkFqcGc@._V1_SX300.jpg"
    },
    {
        Title: "Everything Everywhere All at Once",
        Year: "2022",
        Type: "movie",
        imdbID: "tt6710474",
        Poster: "https://m.media-amazon.com/images/M/MV5BYTdiOTIyZTQtNmQ1OS00NjZlLWIyMTgtYzk5Y2M3ZDVmMDk1XkEyXkFqcGc@._V1_SX300.jpg"
    }
];

// Global helper for image load failures
function handleImageError(img) {
    if (!img || !img.parentElement) return;
    img.parentElement.innerHTML = `
        <div class="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-neutral-900 to-neutral-950 text-neutral-500">
            <svg class="w-10 h-10 mb-2 text-red-600/40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
            </svg>
            <span class="font-tech text-xs text-neutral-400">Artwork Unavailable</span>
        </div>
    `;
}
window.handleImageError = handleImageError;
window.resetToDefault = resetToDefault;
function renderLoadingSkeletons(count = 10) {
    movieHub.innerHTML = "";
    for (let i = 0; i < count; i++) {
        const skeleton = document.createElement("div");
        skeleton.className = "skeleton-card flex flex-col";
        skeleton.innerHTML = `
            <div class="w-full aspect-[2/3] skeleton"></div>
            <div class="p-4 flex flex-col gap-2.5">
                <div class="h-4 skeleton rounded-md w-4/5"></div>
                <div class="h-3 skeleton rounded-md w-2/5"></div>
            </div>
        `;
        movieHub.appendChild(skeleton);
    }
}

// Reset view back to default curated mix
function resetToDefault() {
    if (movieInput) {
        movieInput.value = "";
    }
    if (clearSearchBtn) {
        clearSearchBtn.classList.remove("visible");
    }
    if (sectionHeading) {
        sectionHeading.textContent = "Curated Recommendations";
    }
    if (sectionSubtitle) {
        sectionSubtitle.textContent = "Handpicked cinematic milestones & audience favorites";
    }
    if (resetMixBtn) {
        resetMixBtn.classList.add("hidden");
        resetMixBtn.classList.remove("inline-flex");
    }
    displayMovies(defaultMoviesMix);
}

// Form submit event listener
if (movieForm) {
    movieForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let query = movieInput.value.trim();

        if (!query) {
            return;
        }

        console.log(query);
        searchMovies(query);
    });
}

// Input change listener for clear button toggle
if (movieInput) {
    movieInput.addEventListener("input", () => {
        if (clearSearchBtn) {
            if (movieInput.value.trim().length > 0) {
                clearSearchBtn.classList.add("visible");
            } else {
                clearSearchBtn.classList.remove("visible");
            }
        }
    });
}

// Clear button event listener
if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", () => {
        resetToDefault();
    });
}

// Reset button event listener
if (resetMixBtn) {
    resetMixBtn.addEventListener("click", () => {
        resetToDefault();
    });
}

// Quick filter tags
if (genreChips) {
    genreChips.forEach((chip) => {
        chip.addEventListener("click", () => {
            const query = chip.dataset.query || chip.textContent.trim();
            if (movieInput) {
                movieInput.value = query;
                if (clearSearchBtn) clearSearchBtn.classList.add("visible");
            }
            searchMovies(query);
            // Smooth scroll to movieHub if needed
            movieHub.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
}

async function searchMovies(movieName) {
    // Show loading skeleton immediately for polished UX feedback
    renderLoadingSkeletons(10);

    if (sectionHeading) {
        sectionHeading.innerHTML = `Searching for "<span class="text-red-500">${movieName}</span>"`;
    }
    if (sectionSubtitle) {
        sectionSubtitle.textContent = "Querying the cinema database...";
    }
    if (resetMixBtn) {
        resetMixBtn.classList.remove("hidden");
        resetMixBtn.classList.add("inline-flex");
    }

    try {
        let response = await fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=37763429&s=${encodeURIComponent(movieName)}`);
        let data = await response.json();
        console.log(data);

        if (data.Response === "True") {
            if (sectionHeading) {
                sectionHeading.innerHTML = `Search Results for "<span class="text-red-500">${movieName}</span>"`;
            }
            if (sectionSubtitle) {
                const total = data.totalResults ? `${data.totalResults} titles found` : "Top matching titles";
                sectionSubtitle.textContent = `${total} • Click any poster to view details`;
            }
            displayMovies(data.Search);

        } else {
            if (sectionHeading) {
                sectionHeading.innerHTML = `No Results for "<span class="text-red-500">${movieName}</span>"`;
            }
            if (sectionSubtitle) {
                sectionSubtitle.textContent = "Try another search keyword or browse our curated collection";
            }

            movieHub.innerHTML = `
                <div class="col-span-full py-12 px-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-md text-center flex flex-col items-center justify-center max-w-lg mx-auto">
                    <div class="w-14 h-14 rounded-full bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-4">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 class="font-display text-xl font-bold text-white mb-2">${data.Error || "No Movies Found"}</h3>
                    <p class="font-tech text-xs sm:text-sm text-neutral-400 mb-6 max-w-xs">
                        We couldn't find any titles matching "${movieName}". Check for typos or try searching for a franchise or actor.
                    </p>
                    <button onclick="resetToDefault()" class="font-tech text-xs uppercase tracking-wider font-bold text-white bg-red-600 hover:bg-red-500 px-6 py-2.5 rounded-lg transition-colors shadow-[0_0_20px_rgba(229,9,20,0.4)]">
                        Back to Curated Movies
                    </button>
                </div>
            `;
        }
    } catch (err) {
        console.error("Fetch error:", err);
        movieHub.innerHTML = `
            <div class="col-span-full py-10 px-6 rounded-xl bg-neutral-900/80 border border-red-600/50 text-center">
                <p class="font-tech text-sm text-neutral-300">Unable to connect to the cinema service. Please check your connection and try again.</p>
            </div>
        `;
    }
}

function displayMovies(movies) {
    movieHub.innerHTML = "";

    movies.forEach((movie, index) => {
        const div = document.createElement("div");

        div.dataset.imdbID = movie.imdbID;
        div.style.animationDelay = `${index * 45}ms`;
        div.setAttribute(
            "class",
            "movie-card group bg-neutral-900/85 backdrop-blur-sm border border-neutral-800/90 rounded-2xl overflow-hidden cursor-pointer flex flex-col shadow-lg"
        );

        // Fallback artwork if poster is unavailable
        const hasValidPoster = movie.Poster && movie.Poster !== "N/A";
        const posterSrc = hasValidPoster ? movie.Poster : "";
        const movieType = movie.Type ? movie.Type.toUpperCase() : "MOVIE";

        const safeTitle = (movie.Title || "Movie").replace(/"/g, '&quot;');

        div.innerHTML = `
            <div class="poster-container w-full aspect-[2/3] bg-neutral-950 overflow-hidden border-b border-neutral-800/80 relative">
                ${
                    hasValidPoster
                        ? `<img src="${posterSrc}" alt="${safeTitle}" loading="lazy" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" onerror="handleImageError(this)">`
                        : `<div class="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-neutral-900 to-neutral-950 text-neutral-500">
                             <svg class="w-10 h-10 mb-2 text-red-600/50" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
                             </svg>
                             <span class="font-tech text-xs text-neutral-400">Artwork Unavailable</span>
                           </div>`
                }
                
                <!-- Floating Badges -->
                <div class="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    <span class="glass-pill px-2.5 py-1 rounded-md text-[10px] font-tech font-bold uppercase tracking-wider text-white shadow-sm">
                        ${movie.Year}
                    </span>
                    <span class="px-2 py-0.5 rounded-md text-[9px] font-tech font-bold uppercase tracking-widest text-red-400 bg-red-950/80 border border-red-800/60 backdrop-blur-sm">
                        ${movieType}
                    </span>
                </div>

                <!-- Hover Details Cue Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 pointer-events-none">
                    <span class="font-tech text-xs font-semibold text-white flex items-center gap-1.5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <span class="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white">
                            <svg class="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </span>
                        View Details
                    </span>
                </div>
            </div>

            <div class="p-3.5 sm:p-4 flex flex-col justify-between flex-1 gap-2 bg-gradient-to-b from-neutral-900/60 to-neutral-950">
                <p class="font-tech text-sm sm:text-[15px] font-bold text-neutral-100 line-clamp-2 leading-snug group-hover:text-red-500 transition-colors">
                    ${movie.Title}
                </p>
                <div class="flex items-center justify-between pt-1 text-xs font-tech">
                    <span class="font-semibold text-red-500 tracking-wider">${movie.Year}</span>
                    <span class="text-neutral-500 text-[11px] group-hover:text-neutral-300 transition-colors flex items-center gap-1">
                        Explore
                        <svg class="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </span>
                </div>
            </div>
        `;

        movieHub.append(div);
    });
}

movieHub.addEventListener("click", (e) => {
    e.stopPropagation();
    const movieCard = e.target.closest(".movie-card");

    if (!movieCard) return;

    const imdbID = movieCard.dataset.imdbID;

    console.log(imdbID);

    movieCard.classList.add("poster-clicked");

    setTimeout(() => {
        location.href = `movie-detail.html?id=${imdbID}`;
    }, 180);
});

// Load the diverse mix of movies on initial page load
displayMovies(defaultMoviesMix);

