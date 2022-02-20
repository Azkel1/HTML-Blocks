import withSession from "lib/session";

const db     = require("lib/db").instance;
const bcrypt = require("bcryptjs");

export default withSession(async (req, res) => {
    const { email, password } = await req.body;
    const data = await db.oneOrNone("SELECT (email, name, image, register_date, passhash) FROM users WHERE email = $1", email);

    return new Promise(() => {
        if (data) {
            const [userEmail, userName, userImage, userRegisterDate, userPasshash] = data.row.replace(/\(|\)|"/g, "").split(",");
            bcrypt.compare(password, userPasshash).then((doPassMatch) => {
                if (doPassMatch === true) {
                    const user = {
                        name: userName,
                        email: userEmail,
                        image: userImage,
                        registerDate: userRegisterDate,
                        isLoggedIn: true 
                    };
    
                    req.session.user = user;
                    req.session.save().then(() => {
                        res.status(200).json({
                            ok: true, 
                            body: {
                                text: "Inicio de sesión correcto",
                                user: user
                            }
                        });
                    });
                } else {
                    res.status(200).json({
                        ok: false, 
                        body: {
                            text: "La contraseña introducida no es correcta"
                        }
                    });
                }
            });
        } else {
            res.status(200).json({
                body: {
                    text: "El usuario indicado no existe"
                }
            });
        }
    });
});