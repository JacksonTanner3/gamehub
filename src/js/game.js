import ExternalServices from "./ExternalServices.mjs";

const dataSource = new ExternalServices();
const detailsElement = document.querySelector("#game-details");

function getParam(param) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param);
}

function isFavorite(id) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    return favorites.includes(id);
}

function toggleFavorite(id) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
        alert("Removed from Favorites");
    } else {
        favorites.push(id);
        alert("Added to Favorites!");
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderGameDetails(); // Re-render to update button text
}

async function renderGameDetails() {
    const gameId = getParam("id");

    if (!gameId) {
        detailsElement.innerHTML = "<p>No game selected.</p>";
        return;
    }

    try {
        const game = await dataSource.findGameById(gameId);
        const videos = await dataSource.getTrailer(game.name);
        const videoId = videos.length > 0 ? videos[0].id.videoId : null;
        const bigCover = game.cover ? game.cover.url.replace('t_thumb', 't_cover_big') : 'https://placehold.co/300x400';

        // Check if favorite
        const favoriteBtnText = isFavorite(gameId) ? "💔 Remove from Favorites" : "❤️ Add to Favorites";

        let html = `
        <div class="detail-header">
            <img src="${bigCover}" alt="${game.name}">
            <div class="detail-info">
                <h1>${game.name}</h1>
                <p class="rating">⭐ ${game.rating ? Math.round(game.rating) : 'N/A'}</p>
                <button id="fav-btn">${favoriteBtnText}</button>
                <p class="genres">Genres: ${game.genres ? game.genres.map(g => g.name).join(", ") : "N/A"}</p>
                <p class="summary">${game.summary || "No description available."}</p>
            </div>
        </div>
      `;

        if (videoId) {
            html += `
            <div class="video-container">
                <h2>Trailer</h2>
                <iframe width="100%" height="400" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
            </div>
          `;
        } else {
            html += `<p>No trailer available.</p>`;
        }

        detailsElement.innerHTML = html;

        document.getElementById("fav-btn").addEventListener("click", () => toggleFavorite(gameId));

    } catch (err) {
        console.error(err);
        detailsElement.innerHTML = `<p class="error">Error loading game details.</p>`;
    }
}

renderGameDetails();