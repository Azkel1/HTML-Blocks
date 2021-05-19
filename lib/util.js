import fetchJson from "lib/fetchJson";

export const parseDate = (date) => {
    const options = {
        weekday: "long", 
        month: "long", 
        year: "numeric", 
        day: "numeric", 
        hour: "numeric", 
        minute: "numeric"
    };

    return new Date(date).toLocaleDateString("es-ES", options);
};

export async function saveDesignToDB(designName, data) {
    return await fetchJson("/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: designName,
            data: data
        })
    });
}
