import Head from "next/head";
import Link from "next/link";
import { Header, Footer } from "components";
import useUser from "lib/useUser";
import { parseDate } from "lib/util";
import Image from "next/image";
import useSWR from "swr";

import styles from "styles/profile.module.scss";

export default function Profile() {
    const { user } = useUser({ redirectTo: "/auth" });
    const { data } = useSWR("/api/designs");
    let userDesigns = [];

    if (!user?.isLoggedIn) {
        return <div className="loadingScreen">Cargando...</div>;
    }
    
    if (data) {
        data.body.data.forEach(design => {
            userDesigns.push(
                <div key={ design.name + design.creationDate } className={ styles.containerContentRow }>
                    <b>{ design.name }</b>
                    <em>{ parseDate(design.creationDate) }</em>
                    <Link href={ `/sandbox?design=${design.name}` }>
                        <a>Editar</a>
                    </Link>
                </div>
            );
        });

        if (userDesigns.length === 0) {
            userDesigns.push(
                <div key={ "emptyDesign" } className={ styles.containerEmptyContentRow }>
                    <b>
                        ------------------------------------------ Todavía no tienes ningún diseño&nbsp; 
                        <Link href="/sandbox">
                            <a>¡Crea uno!</a>
                        </Link>
                        &nbsp;------------------------------------------
                    </b>
                </div>
            );
        }
    }

    return (
        <>
            <Head>
                <title>Perfil - HTML Blocks</title>
            </Head>

            <Header page="profile" />
            <main id={ styles.profile }>
                <h1 id={ styles.welcomeMessage }>Bienvenido a tu perfil!</h1>

                <div id={ styles.userCard }>    {/* Implement ability to change user name and image */}
                    <Image src={ user.image ? "/img/users/" + user.image : "/svg/empty_image.svg" } layout="responsive" width="215" height="215" quality="100" alt="Imagen del usuario" />

                    <h3>{ user.name || "Nombre de usuario" }</h3>
                </div>

                <div id={ styles.userInfo }>
                    <h3 className={ styles.containerHeader }>Información personal</h3>

                    <div className={ styles.containerContent }>
                        <div className={ styles.containerContentRow }>
                            <b>Email: </b>
                            <i>{ user.email }</i>
                        </div>

                        <div className={ styles.containerContentRow }>
                            <b>Fecha de registro: </b>
                            <i>{ parseDate(user.registerDate) }</i>
                        </div>
                    </div>

                </div>

                <div id={ styles.userDesigns }>
                    <h3 className={ styles.containerHeader }>Tus diseños</h3>

                    <div className={ styles.containerContent }>
                        { userDesigns }
                    </div>
                </div>

            </main>

            <Footer />
        </>
    );
}