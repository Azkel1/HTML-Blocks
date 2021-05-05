import withSession from "lib/session";

export default withSession(async (req, res) => {
    const user = req.session.get("user");

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
});