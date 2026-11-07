const movieDetail = document.querySelector("#movie-detail");
const params = new URLSearchParams(location.search);
const imdbID = params.get("id");
const shareBtn = document.querySelector("#shareBtn");
const toastNotice = document.querySelector("#toastNotice");

// Copy share link helper
function copyShareLink() {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showToast();
        }).catch(() => {
            fallbackCopyText();
        });
    } else {
        fallbackCopyText();
    }
}

function fallbackCopyText() {
    const dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.value = window.location.href;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    showToast();
}

function showToast() {
    if (!toastNotice) return;
    toastNotice.classList.add("show");
    setTimeout(() => {
        toastNotice.classList.remove("show");
    }, 2800);
}

if (shareBtn) {
    shareBtn.addEventListener("click", copyShareLink);
}

if (imdbID) {
    searchMovie(imdbID.trim());
} else {
    renderNotFound("No movie ID was specified in the URL.");
}

async function searchMovie(id) {
    try {
        let response = await fetch(`https://www.omdbapi.com/?apikey=37763429&i=${id}&plot=full`);
        let data = await response.json();
        console.log(data);

        if (data.Response === "True") {
            displayMovie(data);
        } else {
            console.log(data.Error);
            renderNotFound(data.Error || "Unable to find movie details.");
        }
    } catch (err) {
        console.error("Error fetching movie detail:", err);
        renderNotFound("Could not retrieve movie details. Please check your internet connection.");
    }
}

function renderNotFound(message) {
    if (!movieDetail) return;
    movieDetail.style.removeProperty("--poster-bg");
    movieDetail.className = "rounded-2xl p-8 sm:p-14 bg-neutral-950 border border-neutral-800 text-center flex flex-col items-center justify-center max-w-xl mx-auto shadow-2xl";
    movieDetail.innerHTML = `
        <div class="w-16 h-16 rounded-full bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-5">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
        </div>
        <h2 class="font-display text-2xl font-bold text-white mb-2">Movie Not Found</h2>
        <p class="font-tech text-sm text-neutral-400 mb-8 max-w-sm">${message}</p>
        <a href="index.html" class="font-tech text-xs uppercase tracking-wider font-bold text-white bg-red-600 hover:bg-red-500 px-6 py-3 rounded-xl transition-colors shadow-[0_0_20px_rgba(229,9,20,0.4)]">
            ← Return to Movie Hub
        </a>
    `;
}

function displayMovie(data) {
    // Sets the movie poster as the blurred ambient background of #movie-detail
    const hasPoster = data.Poster && data.Poster !== "N/A";
    if (hasPoster) {
        movieDetail.style.setProperty("--poster-bg", `url("${data.Poster}")`);
    } else {
        movieDetail.style.removeProperty("--poster-bg");
    }

    // Set page title to the movie name
    if (data.Title) {
        document.title = `${data.Title} (${data.Year || ""}) — MovieHub`;
    }

    // Parse Genres into chips
    const genres = data.Genre && data.Genre !== "N/A" 
        ? data.Genre.split(",").map(g => g.trim()) 
        : [];

    const genrePillsHTML = genres.map(g => 
        `<span class="glass-pill text-neutral-200 text-xs font-semibold px-3 py-1 rounded-md tracking-wide">${g}</span>`
    ).join("");

    // Find Rotten Tomatoes rating if present in data.Ratings
    let rottenRating = null;
    if (Array.isArray(data.Ratings)) {
        const rt = data.Ratings.find(r => r.Source === "Rotten Tomatoes");
        if (rt) rottenRating = rt.Value;
    }

    // Awards Section HTML
    const hasAwards = data.Awards && data.Awards !== "N/A";
    const awardsHTML = hasAwards ? `
        <div class="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 backdrop-blur-md">
            <span class="text-xl">🏆</span>
            <div>
                <span class="font-tech text-[10px] uppercase font-bold tracking-[0.2em] text-amber-400/80 block">Accolades & Honors</span>
                <span class="font-tech text-xs sm:text-sm font-semibold text-amber-200">${data.Awards}</span>
            </div>
        </div>
    ` : "";

    // Box Office HTML
    const hasBoxOffice = data.BoxOffice && data.BoxOffice !== "N/A";
    const boxOfficeHTML = hasBoxOffice ? `
        <section class="stat-card flex flex-col gap-1">
            <span class="font-tech text-[11px] font-bold uppercase tracking-[0.18em] text-red-500 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Box Office
            </span>
            <p class="font-tech text-sm font-semibold text-neutral-100">${data.BoxOffice}</p>
        </section>
    ` : "";

    const safeTitle = (data.Title || "Movie").replace(/"/g, '&quot;');

    movieDetail.className = "grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[340px_1fr] gap-8 lg:gap-12 bg-neutral-950 border border-neutral-800/90 rounded-2xl p-6 sm:p-8 md:p-12 items-start";

    movieDetail.innerHTML = `
        <!-- Left Column: Poster & Quick Action Links -->
        <div class="flex flex-col gap-4 w-full max-w-[280px] md:max-w-none mx-auto md:row-span-2">
            <div class="detail-poster-box w-full bg-neutral-950 border border-neutral-800/90 rounded-2xl overflow-hidden relative group">
                ${
                    hasPoster
                        ? `<img src="${data.Poster}" alt="${safeTitle}" class="w-full h-auto object-cover block" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'aspect-[2/3] w-full flex flex-col items-center justify-center p-6 text-center bg-neutral-900 text-neutral-400\\'><svg class=\\'w-16 h-16 text-red-600/60 mb-3\\' fill=\\'currentColor\\' viewBox=\\'0 0 24 24\\'><path d=\\'M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z\\'/></svg><span class=\\'font-tech text-xs text-neutral-500 mt-1\\'>Artwork Unavailable</span></div>';">`
                        : `<div class="aspect-[2/3] w-full flex flex-col items-center justify-center p-6 text-center bg-neutral-900 text-neutral-400">
                             <svg class="w-16 h-16 text-red-600/60 mb-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
                             </svg>
                             <span class="font-display font-bold text-sm text-white">${safeTitle}</span>
                             <span class="font-tech text-xs text-neutral-500 mt-1">Poster Not Available</span>
                           </div>`
                }
            </div>

            <!-- Quick Action Buttons -->
            <div class="flex flex-col gap-2.5 pt-2">
                <a href="https://www.imdb.com/title/${data.imdbID}" target="_blank" rel="noopener noreferrer" class="font-tech flex items-center justify-center gap-2 w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-[0.16em] py-3.5 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:shadow-[0_0_30px_rgba(229,9,20,0.7)] text-center">
                    <span>View on IMDb</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                </a>
                
                <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(data.Title + ' official trailer')}" target="_blank" rel="noopener noreferrer" class="font-tech flex items-center justify-center gap-2 w-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700/80 font-bold text-xs uppercase tracking-[0.16em] py-3 px-4 rounded-xl transition-colors text-center">
                    <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                    </svg>
                    <span>Watch Trailer</span>
                </a>
            </div>
        </div>

        <!-- Right Column: Metadata, Ratings & Detailed Specs -->
        <div class="flex flex-col gap-6">
            
            <!-- Title & Basic Info -->
            <div class="flex flex-col gap-3">
                <div class="flex items-center gap-2.5 flex-wrap">
                    <span class="px-2.5 py-0.5 rounded-md text-[10px] font-tech font-bold uppercase tracking-widest text-red-400 bg-red-950/80 border border-red-800/60">
                        ${data.Type ? data.Type.toUpperCase() : "CINEMA"}
                    </span>
                    <span class="font-tech text-xs text-neutral-400 font-semibold tracking-wide">
                        ${data.Year || ""}
                    </span>
                    <span class="text-neutral-600">•</span>
                    <span class="font-tech text-xs text-neutral-400 font-semibold tracking-wide">
                        ${data.Runtime || ""}
                    </span>
                </div>

                <h1 class="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.08] drop-shadow-md">
                    ${data.Title}
                </h1>
            </div>

            <!-- Meta Badges & Genres -->
            <div class="font-tech flex flex-wrap items-center gap-2">
                ${data.Rated && data.Rated !== "N/A" ? `<span class="bg-white/10 border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">${data.Rated}</span>` : ""}
                ${data.Released && data.Released !== "N/A" ? `<span class="glass-pill text-neutral-300 text-xs font-semibold px-3 py-1 rounded-md">${data.Released}</span>` : ""}
                ${genrePillsHTML}
            </div>

            <!-- Ratings Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <!-- IMDb Rating -->
                <div class="stat-card flex flex-col justify-between">
                    <span class="font-tech text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-1.5">
                        <span class="text-amber-400">★</span> IMDb Rating
                    </span>
                    <div class="mt-1 flex items-baseline gap-1.5">
                        <span class="font-tech text-xl sm:text-2xl font-bold text-white">${data.imdbRating || "N/A"}</span>
                        <span class="font-tech text-xs text-neutral-500">/ 10</span>
                    </div>
                    ${data.imdbVotes && data.imdbVotes !== "N/A" ? `<span class="font-tech text-[10px] text-neutral-400 mt-0.5">${data.imdbVotes} votes</span>` : ""}
                </div>

                <!-- Rotten Tomatoes / Metascore -->
                ${rottenRating ? `
                <div class="stat-card flex flex-col justify-between">
                    <span class="font-tech text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-1.5">
                        🍅 Rotten Tomatoes
                    </span>
                    <div class="mt-1 flex items-baseline gap-1">
                        <span class="font-tech text-xl sm:text-2xl font-bold text-red-400">${rottenRating}</span>
                    </div>
                    <span class="font-tech text-[10px] text-neutral-400 mt-0.5">Audience & Critics</span>
                </div>` : (data.Metascore && data.Metascore !== "N/A" ? `
                <div class="stat-card flex flex-col justify-between">
                    <span class="font-tech text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-1.5">
                        🎯 Metascore
                    </span>
                    <div class="mt-1 flex items-baseline gap-1">
                        <span class="font-tech text-xl sm:text-2xl font-bold text-emerald-400">${data.Metascore}</span>
                        <span class="font-tech text-xs text-neutral-500">/ 100</span>
                    </div>
                    <span class="font-tech text-[10px] text-neutral-400 mt-0.5">Critic Score</span>
                </div>` : "")}

                <!-- Status / Language quick stat -->
                <div class="stat-card flex flex-col justify-between">
                    <span class="font-tech text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-1.5">
                        🌐 Primary Audio
                    </span>
                    <div class="mt-1 flex items-baseline gap-1">
                        <span class="font-tech text-sm sm:text-base font-bold text-neutral-200 line-clamp-1">${data.Language ? data.Language.split(",")[0] : "N/A"}</span>
                    </div>
                    <span class="font-tech text-[10px] text-neutral-400 mt-0.5">${data.Country ? data.Country.split(",")[0] : ""}</span>
                </div>
            </div>

            <!-- Awards Ribbon (if available) -->
            ${awardsHTML}

            <!-- Plot Overview -->
            <div class="flex flex-col gap-2 pt-2">
                <span class="font-tech text-xs font-bold uppercase tracking-[0.2em] text-red-500 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-red-600"></span>
                    Plot Synopsis
                </span>
                <p class="text-sm sm:text-base text-neutral-200/90 leading-relaxed font-normal bg-neutral-900/40 p-4 sm:p-5 rounded-xl border border-white/5">
                    ${data.Plot && data.Plot !== "N/A" ? data.Plot : "No plot synopsis provided for this title."}
                </p>
            </div>

            <!-- Cast & Crew Technical Breakdown -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <section class="stat-card flex flex-col gap-1">
                    <span class="font-tech text-[11px] font-bold uppercase tracking-[0.18em] text-red-500 flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        Director
                    </span>
                    <p class="font-tech text-sm font-semibold text-neutral-200">${data.Director || "N/A"}</p>
                </section>

                <section class="stat-card flex flex-col gap-1">
                    <span class="font-tech text-[11px] font-bold uppercase tracking-[0.18em] text-red-500 flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        Writer
                    </span>
                    <p class="font-tech text-sm font-semibold text-neutral-200">${data.Writer || "N/A"}</p>
                </section>

                <section class="stat-card flex flex-col gap-1 sm:col-span-2">
                    <span class="font-tech text-[11px] font-bold uppercase tracking-[0.18em] text-red-500 flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        Starring Cast
                    </span>
                    <p class="font-tech text-sm font-semibold text-neutral-200">${data.Actors || "N/A"}</p>
                </section>

                <section class="stat-card flex flex-col gap-1">
                    <span class="font-tech text-[11px] font-bold uppercase tracking-[0.18em] text-red-500 flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
                        Languages
                    </span>
                    <p class="font-tech text-sm font-semibold text-neutral-200">${data.Language || "N/A"}</p>
                </section>

                <section class="stat-card flex flex-col gap-1">
                    <span class="font-tech text-[11px] font-bold uppercase tracking-[0.18em] text-red-500 flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Country of Origin
                    </span>
                    <p class="font-tech text-sm font-semibold text-neutral-200">${data.Country || "N/A"}</p>
                </section>

                ${boxOfficeHTML}
            </div>

        </div>
    `;
}

