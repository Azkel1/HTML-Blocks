import Head from "next/head";
import Link from "next/link";
import { Header, Footer } from "components";

import styles from "styles/index.module.scss";

export default function HomePage() {
    return (
        <>
            <Head>
                <title>Inicio - HTML Blocks</title>
            </Head>

            <Header page="home"/>

            <main id={ styles.mainContainer }>
                <div>
                    <h1>Bienvenido a HTML Blocks!</h1>
                    <p>HTML Blocks es una plataforma de aprendizaje para HTML que permite crear páginas web usando intuitivos bloques.</p>
                    <Link href="/sandbox">
                        <a>Prúebalo!</a>
                    </Link>
                </div>
            </main>

            <Footer />
        </>
    );
}