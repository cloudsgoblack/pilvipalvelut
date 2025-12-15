const BASE_URL = "https://jalostusnetti-proxy.ellinoora-tammi.workers.dev";

export async function fetchShows() {
    const res = await fetch(`${BASE_URL}/api/v1/events/shows`, {
        method: "GET",
        headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error(`Haku epäonnistui (${res.status})`);
    return res.json();
}