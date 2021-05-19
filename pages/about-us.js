import Head from "next/head";
import Link from "next/link";
import { Header, Footer } from "components";

import styles from "styles/about-us.module.scss";

export default function AboutUs() {
    return (
        <>
            <Head>
                <title>Sobre nosotros - HTML Blocks</title>
            </Head>

            <Header page="about-us"/>

            <main id={ styles.mainContainer }>
                <div>
                    <h1>Sobre nosotros</h1>

                    <p>
                        HTML Blocks fue creado con la idea de facilitar la introducción a la programación a los niños desde temprana edad. Actualmente el proyecto es desarrollado únicamente por mí (Alexis) y hay muchas cosas que me gustaría añadir o cambiar.
                    </p>
                    
                    <p>
                        Si tienes alguna idea puedes dejarla en el repositorio de <Link href="https://github.com/Azkel1/HTML-Blocks"><a>GitHub</a></Link>.
                    </p>
                </div>
            </main>

            <Footer />
        </>
    );
}