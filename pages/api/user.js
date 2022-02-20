const db = require("lib/db").instance;
const fs = require("fs");
const crypto = require("crypto");

import withSession from "lib/session";

export default withSession(async (req, res) => {
    const user = req.session.user;
    
    // Get user info
    if (req.method === "GET") {
        if (user) {
            //Get user designs from database
            res.json({
                isLoggedIn: true,
                ...user,
            });
        } else {
            res.json({
                isLoggedIn: false,
            });
        }
    } 
    // Update user info
    else {
        return new Promise(() => {
            // If an image has been provided by the user, store it in the server and save the reference in the DB.
            if (user) {
                const userImageFolder = "public/img/users/";
                const {data, type} = req.body.image;
                const newUserInfo = {
                    imageName: `${crypto.createHash("md5").update(user.email).digest("hex").toUpperCase()}.${type}`,
                    userName: req.body.name
                };

                if (data && type) {
                    const buffer = Buffer.from(data.replace(/^data:image\/\w+;base64,/, ""), "base64");
                    fs.writeFile(`${userImageFolder}${newUserInfo.imageName}`, buffer, () => {});
                }

                db.none("UPDATE users SET image = $1, name = $2 WHERE email = $3;", [newUserInfo.imageName, newUserInfo.userName, user.email]).then(() => {
                    req.session.user = {...user, name: newUserInfo.userName};
                    req.session.save().then(() => {
                        res.status(200).json({
                            ok: true,
                            body: {
                                text: "Datos actualizados correctamente"
                            }
                        });
                    });
                });
            }
        }); 
    }
});