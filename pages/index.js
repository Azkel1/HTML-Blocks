import Head from "next/head"
import Header from "components/header"
import Footer from "components/footer"

export default function HomePage() {
    return (
        <div>
            <Head>
                <title>Inicio - HTML Blocks</title>
            </Head>

            <Header page="home"/>
            <main>
                <h1>Bienvenido a HTML Blocks!</h1>
                <p>Salu2</p>
            </main>

            <Footer />
        </div>
    )
}