export const parseDate = (date) => {
    const options = {
        weekday: "long", 
        month: "long", 
        year: "numeric", 
        day: "numeric", 
        hour: "numeric", 
        minute: "numeric"
    }

    return new Date(date).toLocaleDateString("es-ES", options);
}