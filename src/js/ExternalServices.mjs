const baseURL = "https://api.igdb.com/v4/";

async function convertToJson(res) {
    if (res.ok) {
        return res.json();
    } else {
        throw new Error("Bad Response");
    }
}

export default class ExternalServices {
    constructor() {
        this.clientId = import.meta.env.VITE_CLIENT_ID;
        this.accessToken = import.meta.env.VITE_ACCESS_TOKEN;
        this.youtubeKey = import.meta.env.VITE_YOUTUBE_KEY;
    }

    // 1. Search for Games (IGDB)
    async searchGames(query) {
        // IGDB uses a weird text format for queries, not JSON.
        // We ask for the name, cover url, rating, and summary.
        const body = `search "${query}"; fields name, cover.url, rating, summary, first_release_date; limit 10;`;

        // We have to use a CORS proxy because IGDB blocks browser requests.
        // For this class, we often use a demo proxy or local workaround.
        // Let's try hitting the API directly first. If it blocks us, we'll fix CORS.
        const options = {
            method: "POST",
            headers: {
                "Client-ID": this.clientId,
                "Authorization": `Bearer ${this.accessToken}`,
                "Content-Type": "text/plain"
            },
            body: body
        };

        // Note: If you get a CORS error, we will need to add a proxy URL here.
        const response = await fetch(`${baseURL}games`, options);
        return await convertToJson(response);
    }

    // 2. Get Game Trailers (YouTube)
    async getTrailer(gameName) {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${gameName} trailer&key=${this.youtubeKey}`;
        const response = await fetch(url);
        const data = await convertToJson(response);
        return data.items;
    }
}