import ExternalServices from "./ExternalServices.mjs";

const dataSource = new ExternalServices();

// Select elements
const searchBtn = document.querySelector("#search-btn");
const searchInput = document.querySelector("#search-input");
const listElement = document.querySelector("#game-list");

// Function to handle the search
async function handleSearch() {
  const query = searchInput.value;
  if (!query) return;

  listElement.innerHTML = '<p class="loading">Searching IGDB...</p>';

  try {
    // 1. Get the data
    const games = await dataSource.searchGames(query);
    console.log("IGDB Results:", games); // Check console to see the data!

    // 2. Render the list (Temporary basic render)
    if (games && games.length > 0) {
      const html = games.map(game => `
            <div class="game-card">
                <h3>${game.name}</h3>
                <p>Rating: ${game.rating ? Math.round(game.rating) : 'N/A'}</p>
            </div>
        `).join("");
      listElement.innerHTML = html;
    } else {
      listElement.innerHTML = '<p>No games found.</p>';
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