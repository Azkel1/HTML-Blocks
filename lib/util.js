/**
 * Parse a date string to a valid Date object.
 * @param {string} date Date string to be parsed
 * @returns A valid Date object.
 */
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

/**
 * Split an array in groups of a given length.
 * @param {Array} ar Array to be splitted
 * @param {number} num Number of elements in each group
 * @returns Array containing the splitted groups.
 */
export const chunkArrayInGroups = (ar, num) => {
    return ar.reduce(function(r, v, i) {
        if (i % num === 0) r.push(ar.slice(i, i + num));
        return r;
    }, []);
};
