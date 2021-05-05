import { withIronSession } from "next-iron-session";

export default function withSession(handler) {
    return withIronSession(handler, {
        password: process.env.SECRET_COOKIE_PASSWORD,
        cookieName: "html_blocks/session",
        cookieOptions: {
            secure: process.env.NODE_ENV === "production"
        }
    });
}