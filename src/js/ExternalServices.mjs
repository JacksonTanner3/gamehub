const baseURL = "https://corsproxy.io/?https://api.igdb.com/v4/";

async function convertToJson(res) {
    const jsonResponse = await res.json();
    if (res.ok) {
        return jsonResponse;
    } else {
        console.error("IGDB Error:", jsonResponse);
        throw new Error("Bad Response from API");
    }
}

export default class ExternalServices {
    constructor() {
        this.clientId = import.meta.env.VITE_CLIENT_ID;
        this.accessToken = import.meta.env.VITE_ACCESS_TOKEN;
        this.youtubeKey = import.meta.env.VITE_YOUTUBE_KEY;
    }

    // Search Games
    async searchGames(query, genreId = null) {
        let body = `search "${query}"; fields name, cover.url, rating, first_release_date, category; limit 50;`;

        if (genreId) {
            body += ` where genres = (${genreId});`;
        }

        const options = {
            method: "POST",
            headers: {
                "Client-ID": this.clientId,
                "Authorization": `Bearer ${this.accessToken}`,
                "Content-Type": "text/plain"
            },
            body: body
        };

        const response = await fetch(`${baseURL}games`, options);
        return await convertToJson(response);
    }

    // Get Trending Games
    async getTrending() {
        const body = `fields name, cover.url, rating, first_release_date, category; where first_release_date > 1704067200 & total_rating_count > 5; sort popularity desc; limit 50;`;

        const options = {
            method: "POST",
            headers: {
                "Client-ID": this.clientId,
                "Authorization": `Bearer ${this.accessToken}`,
                "Content-Type": "text/plain"
            },
            body: body
        };

        const response = await fetch(`${baseURL}games`, options);
        return await convertToJson(response);
    }

    // Find specific game details
    async findGameById(id) {
        const body = `fields name, cover.url, rating, summary, first_release_date, genres.name, platforms.name; where id = ${id};`;

        const options = {
            method: "POST",
            headers: {
                "Client-ID": this.clientId,
                "Authorization": `Bearer ${this.accessToken}`,
                "Content-Type": "text/plain"
            },
            body: body
        };

        const response = await fetch(`${baseURL}games`, options);
        const data = await convertToJson(response);
        return data[0];
    }

    // Get YouTube Trailer
    async getTrailer(gameName) {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${gameName} video game official trailer&key=${this.youtubeKey}`;
        const response = await fetch(url);
        const data = await convertToJson(response);
        return data.items;
    }
}