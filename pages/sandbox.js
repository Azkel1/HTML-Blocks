import Head from "next/head"
import Header from "components/header"
import SandboxCanvas from "components/canvas"
import styles from "styles/sandbox.module.scss"

export default function SandboxPage () {
    return (
        <div>
            <Head>
                <title>Sandbox - HTML Blocks</title>
            </Head>
            
            <Header page="sandbox"/>

            <main id={ styles.sandboxMainContainer }>
                <SandboxCanvas />
            </main>
        </div>
    )
}