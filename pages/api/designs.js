import withSession from "lib/session";

const db = require("lib/db").instance;

export default withSession(async (req, res) => {
    const user = req.session.get("user");

    if (req.method === "POST") {
        return new Promise(async (resolve) => {
            try {
                await db.none("INSERT INTO designs (email, name, data) VALUES ($1, $2, $3);", [user.email, req.body.name, req.body.data])
                    .then(() => {
                        res.status(200).json({
                            ok: true,
                            body: {
                                text: "Diseño guardado corectamente"
                            }
                        });
                        return resolve();
                    })
                    .catch(err => {
                        res.status(200).json({
                            ok: false,
                            body: {
                                text: "Error al guardar el diseño"
                            }
                        });
                        return resolve();
                    });
            } catch (err) {
                res.status(500).json(err);
                return resolve();
            }
        });
    } else {

    }
});