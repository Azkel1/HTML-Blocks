import { withIronSessionApiRoute } from "iron-session/next";

export default function withSession(handler) {
    return withIronSessionApiRoute(handler, {
        password: process.env.SECRET_COOKIE_PASSWORD,
        cookieName: "html_blocks/session",
        cookieOptions: {
            secure: process.env.NODE_ENV === "production"
        }
    });
}