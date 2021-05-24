import withSession from "lib/session";

const db = require("lib/db").instance;

export default withSession(async (req, res) => {
    const user = req.session.get("user");

    switch(req.method) {
    case "POST":
        return uploadDesign();

    default:
    case "GET":
        return getDesign();

    case "DELETE":
        return deleteDesign();

    }

    /**
     * Insert a new row in the "designs" table in the DB with the given data.
     * @returns Promise to be resolved by the client.
     */
    function uploadDesign() {
        return new Promise(() => {
            try {
                db.none("INSERT INTO designs (email, name, data) VALUES ($1, $2, $3);", [user.email, req.body.name, req.body.data])
                    .then(() => {
                        res.status(200).json({
                            ok: true,
                            body: {
                                text: "Diseño guardado corectamente"
                            }
                        });
                    })
                    .catch((e) => {
                        res.status(200).json({
                            ok: false,
                            body: {
                                text: (e.code === "23505") ? "Ya existe un diseño con ese nombre" : "Error al guardar el diseño"
                            }
                        });
                    });
            } catch (err) {
                res.status(500).json({
                    ok: false,
                    body: err
                });
            }
        });
    }

    /**
     * Gets the given design's info from the DB.
     * @returns Promise to be resolved by the client.
     */
    function getDesign() {
        return new Promise(() => {
            // A name parameter is given, get the design from the user that matches it.
            if (req.query.name) {
                try {
                    db.one("SELECT (data) FROM designs WHERE email = $1 AND name = $2;", [user.email, req.query.name]).then((designData) => {
                        // The query is resolved correctly, a design is found with the given name
                        res.status(200).json({
                            ok: true,
                            body: designData
                        });
                    }, () => {
                        // The query is rejected, there isn't a design with that name.
                        res.status(200).json({
                            ok: false,
                            body: {
                                data: "No se ha encontrado ningún diseño con ese nombre"
                            }
                        });
                    }
                    );
                } catch (err) {
                    res.status(500).json({
                        ok: false,
                        body: err
                    });
                }
            } 
            // No parameter is given, the name & creation date of all designs created by the user are returned
            else if (Object.values(req.query).length === 0) {
                try {
                    db.any("SELECT (name, create_date) FROM designs WHERE email = $1", [user.email]).then((userDesigns) => {
                        let result = [];
    
                        userDesigns.forEach(d => {
                            const [name, creationDate] = d.row.replace(/\(|\)|"/g, "").split(",");
                            result.push({name: name, creationDate: creationDate});
                        });
    
                        res.status(200).json({
                            ok: true,
                            body: {
                                data: result
                            }
                        });
                    });
                } catch (err) {
                    res.status(500).json({
                        ok: false,
                        body: err
                    });
                }
            }
        });
    }

    /**
     * Delete the given design from the DB.
     * @returns Promise to be resolved by the client.
     */
    function deleteDesign() {
        return new Promise(() => {
            try {
                db.none("DELETE FROM designs WHERE email = $1 AND name = $2;", [user.email, req.body.name])
                    .then(() => {
                        res.status(200).json({
                            ok: true,
                            body: {
                                text: "Diseño eliminado corectamente"
                            }
                        });
                    })
                    .catch(() => {
                        res.status(200).json({
                            ok: false,
                            body: {
                                text: "Error al eliminar el diseño"
                            }
                        });
                    });
            } catch (err) {
                res.status(500).json({
                    ok: false,
                    body: err
                });
            }
        });
    }
});