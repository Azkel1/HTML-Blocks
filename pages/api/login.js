import withSession from "lib/session";

const db     = require("lib/db").instance;
const bcrypt = require("bcrypt");

export default withSession(async (req, res) => {
    return new Promise(async (resolve) => {
        const { email, password } = await req.body;

        const data = await db.oneOrNone("SELECT (email, name, image, register_date, passhash) FROM users WHERE email = $1", email);

        if (data) {
            const [userEmail, userName, userImage, userRegisterDate, userPasshash] = data.row.replace(/\(|\)|\"/g, "").split(",");
            const doPassMatch = await bcrypt.compare(password, userPasshash);
            let response = {};

            if (doPassMatch) {
                const user = {
                    name: userName,
                    email: userEmail,
                    image: userImage,
                    registerDate: userRegisterDate,
                    isLoggedIn: true 
                };

                req.session.set("user", user);
                await req.session.save()

                response = {
                    ok: true, 
                    body: {
                        text: "Inicio de sesión correcto",
                        user: user
                    }
                };
            } else {
                response = {
                    ok: false, 
                    body: {
                        text: "La contraseña introducida no es correcta"
                    }
                }
            }

            console.log(response);
            res.status(200).json(response);
        } else {
            res.status(200).json({
                body: {
                    text: "El usuario indicado no existe"
                }
            })
            res.end();
        }
            
        resolve();
    });
})