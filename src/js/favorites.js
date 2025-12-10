import ExternalServices from "./ExternalServices.mjs";

const dataSource = new ExternalServices();
const listElement = document.querySelector("#fav-list");

async function renderFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.length === 0) {
        listElement.innerHTML = "<p>You haven't added any favorites yet.</p>";
        return;
    }

    listElement.innerHTML = '<p class="loading">Loading your collection...</p>';

    try {
        const promises = favorites.map(id => dataSource.findGameById(id));
        const games = await Promise.all(promises);

        const html = games.map(game => `
            <div class="game-card">
                <a href="/game.html?id=${game.id}">
                    <img src="${game.cover ? game.cover.url.replace('t_thumb', 't_cover_big') : 'https://placehold.co/200x300?text=No+Image'}" alt="${game.name}">
                </a>
                <h3>${game.name}</h3>
                <p>Rating: ${game.rating ? Math.round(game.rating) : 'N/A'}</p>
            </div>
        `).join("");

        listElement.innerHTML = html;

    } catch (err) {
        console.error(err);
        listElement.innerHTML = `<p class="error">Error loading favorites.</p>`;
    }
}

renderFavorites();