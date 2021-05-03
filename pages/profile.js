import Head from "next/head"
import { Header, Footer } from "components"
import useUser from "lib/useUser"
import { parseDate } from "lib/util"
import Image from "next/image"

import styles from "styles/profile.module.scss"

export default function Profile() {
    const { user } = useUser({ redirectTo: "/auth" });

    if (!user?.isLoggedIn) {
        return <div className="loadingScreen">Cargando...</div>
    }

    return (
        <>
            <Head>
                <title>Perfil - HTML Blocks</title>
            </Head>

            <Header page="profile"/>
            <main id={ styles.profile }>
                <h1 id={ styles.welcomeMessage }>Bienvenido a tu perfil!</h1>
                
                <div id={ styles.userCard }>    {/* Implement ability to change user name and image */}
                    <Image src={"/img/users/" + user.image } layout="responsive" width="215" height="215" quality="100" alt=""/>
                    
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

                <div id={ styles.userDesigns}>
                    <h3 className={ styles.containerHeader }>Tus diseños</h3>

                {/* TESTING ONLY */}
                    <div className={ styles.containerContent }>
                        <div className={ styles.containerContentRow }>
                            <b>Nombre del diseño ----------------------</b>
                            <em>domingo, 18 de abril de 2021 23:14:12</em>
                            <button type="button">Editar</button>
                        </div>

                        <div className={ styles.containerContentRow }>
                            <b>Nombre del diseño ----------------------</b>
                            <em>domingo, 18 de abril de 2021 23:14:12</em>
                            <button type="button">Editar</button>
                        </div>
                        
                        <div className={ styles.containerContentRow }>
                            <b>Nombre del diseño ----------------------</b>
                            <em>domingo, 18 de abril de 2021 23:14:12</em>
                            <button type="button">Editar</button>
                        </div>

                        <div className={ styles.containerContentRow }>
                            <b>Nombre del diseño ----------------------</b>
                            <em>domingo, 18 de abril de 2021 23:14:12</em>
                            <button type="button">Editar</button>
                        </div>
                    </div>
                    {/* ------------ */}
                </div>

            </main>

            <Footer />
        </>
    )
}