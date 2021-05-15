const db = require("lib/db").instance;
const bcrypt = require("bcryptjs");

export default async function createUser(req, res) {
    return new Promise(() => {
        try {
            bcrypt.genSalt(10, function(err, salt) {
                if (err) {
                    res.status(500).json(err);
                }

                bcrypt.hash(req.body.password, salt, async function(err, hash) {
                    if (err) {
                        res.status(500).json(err);
                    }

                    db.none("INSERT INTO users (email, passhash) VALUES ($1, $2);", [req.body.email, hash])
                        .then(() => {
                            res.status(200).json({
                                ok: true,
                                body: {
                                    text: "Usuario creado correctamente"
                                }
                            });
                        })
                        .catch(err => {
                            switch (err.code) {
                            case "23505": 
                                res.json({
                                    body: {
                                        text: "La cuenta indicada ya existe."
                                    }
                                });
                                break;
                            default:
                                console.log(err);
                            }
                        });
                });
            }); 
        } catch (err) {
            res.status(500).json(err);
        }
    });
}