const baseURL = "https://corsproxy.io/?https://api.igdb.com/v4/";

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

    async searchGames(query, genreId = null) {
        // Build query with standard fields
        let body = `search "${query}"; fields name, cover.url, rating, summary, first_release_date; limit 20;`;

        // Add genre filter if selected
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

    async getTrailer(gameName) {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${gameName} trailer&key=${this.youtubeKey}`;
        const response = await fetch(url);
        const data = await convertToJson(response);
        return data.items;
    }
}