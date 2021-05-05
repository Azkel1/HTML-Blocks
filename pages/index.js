import Head from "next/head";
import { Header, Footer } from "components";

export default function HomePage() {
    return (
        <>
            <Head>
                <title>Inicio - HTML Blocks</title>
            </Head>

            <Header page="home"/>
            <main>
                <h1>Bienvenido a HTML Blocks!</h1>
                <p>Salu2</p>
            </main>

            <Footer />
        </>
    );
}