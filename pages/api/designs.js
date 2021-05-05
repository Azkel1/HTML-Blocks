import withSession from "lib/session";

const db = require("lib/db").instance;

export default withSession(async (req, res) => {
    const user = req.session.get("user");

    if (req.method === "POST") {
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
                    .catch(() => {
                        res.status(200).json({
                            ok: false,
                            body: {
                                text: "Error al guardar el diseño"
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
    } else {
        return new Promise(() => {
            // TODO: Diferentiate between getting the list of designs of a user and getting the data from a particular design
            try {
                db.any("SELECT (name, create_date) FROM designs WHERE email = $1", ["azk.alexis.com@gmail.com"]).then((userDesigns) => {
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
        });
        
    }
});