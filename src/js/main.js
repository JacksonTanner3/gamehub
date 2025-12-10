import ExternalServices from "./ExternalServices.mjs";

const dataSource = new ExternalServices();

const searchBtn = document.querySelector("#search-btn");
const searchInput = document.querySelector("#search-input");
const genreSelect = document.querySelector("#genre-select");
const listElement = document.querySelector("#game-list");
const sectionTitle = document.querySelector("#section-title");

function renderGameList(games) {
  if (games && games.length > 0) {
    const html = games.map(game => `
            <div class="game-card">
                <a href="/game.html?id=${game.id}">
                    <img src="${game.cover ? game.cover.url.replace('t_thumb', 't_cover_big') : 'https://placehold.co/200x300?text=No+Image'}" alt="${game.name}">
                </a>
                <h3>${game.name}</h3>
                <p>Rating: ${game.rating ? Math.round(game.rating) : 'N/A'}</p>
                <p>Released: ${game.first_release_date ? new Date(game.first_release_date * 1000).getFullYear() : 'N/A'}</p>
            </div>
        `).join("");
    listElement.innerHTML = html;
  } else {
    listElement.innerHTML = '<p>No games found. Try a different search or genre.</p>';
  }
}

async function handleSearch() {
  const query = searchInput.value;
  const genreId = genreSelect.value;

  if (!query) return;

  listElement.innerHTML = '<p class="loading">Searching IGDB...</p>';
  if (sectionTitle) sectionTitle.textContent = `Search Results for "${query}"`;

  try {
    const games = await dataSource.searchGames(query, genreId);

    const mainGames = games.filter(game => game.category === 0 || game.category === undefined);

    mainGames.sort((a, b) => (b.first_release_date || 0) - (a.first_release_date || 0));

    renderGameList(mainGames);

  } catch (err) {
    console.error(err);
    listElement.innerHTML = `<p class="loading" style="color:red">Error: ${err.message}</p>`;
  }
}

async function init() {
  try {
    const games = await dataSource.getTrending();

    const mainGames = games.filter(game => game.category === 0 || game.category === undefined);
    const topGames = mainGames.slice(0, 12);

    renderGameList(topGames);
  } catch (err) {
    console.error(err);
    listElement.innerHTML = `<p class="loading" style="color:red">Error loading trending games.</p>`;
  }
}

if (searchBtn) searchBtn.addEventListener("click", handleSearch);
init();