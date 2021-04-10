const db = require("lib/db").instance;

export default async function handler(req, res) {
    try {
        const post = await db.one("SELECT * FROM tabla_prueba");
        res.status(200).json(post);
    } catch (e) {
        console.error(e);
        res.status(500).end();
    }
}