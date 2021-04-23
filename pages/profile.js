import Head from "next/head"
import Header from "components/header"
import Footer from "components/footer"

export default function Profile() {
    return (
        <div>
            <Head>
                <title>Perfil - HTML Blocks</title>
            </Head>

            <Header page="profile"/>
            <main>
                <h1>Bienvenido a tu perfil!</h1>
            </main>

            <Footer />
        </div>
    )
}