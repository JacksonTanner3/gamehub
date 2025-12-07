import ExternalServices from "./ExternalServices.mjs";

const dataSource = new ExternalServices();

// Select elements
const searchBtn = document.querySelector("#search-btn");
const searchInput = document.querySelector("#search-input");
const genreSelect = document.querySelector("#genre-select"); // NEW: Select the dropdown
const listElement = document.querySelector("#game-list");

// Function to handle the search
async function handleSearch() {
  const query = searchInput.value;
  const genreId = genreSelect.value; // NEW: Get the value (like "10" for Racing)

  if (!query) return;

  listElement.innerHTML = '<p class="loading">Searching IGDB...</p>';

  try {
    // 1. Get the data (Pass both the text query and the genre ID)
    const games = await dataSource.searchGames(query, genreId);
    console.log("IGDB Results:", games);

    // 2. Render the list
    if (games && games.length > 0) {
      const html = games.map(game => `
            <div class="game-card">
                <img src="${game.cover ? game.cover.url.replace('t_thumb', 't_cover_big') : 'https://placehold.co/200x300?text=No+Image'}" alt="${game.name}">
                <h3>${game.name}</h3>
                <p>Rating: ${game.rating ? Math.round(game.rating) : 'N/A'}</p>
            </div>
        `).join("");
      listElement.innerHTML = html;
    } else {
      listElement.innerHTML = '<p>No games found. Try a different search or genre.</p>';
    }

  } catch (err) {
    console.error(err);
    listElement.innerHTML = `<p class="loading" style="color:red">Error: ${err.message}</p>`;
  }
}

// Add event listener
if (searchBtn) {
  searchBtn.addEventListener("click", handleSearch);
}