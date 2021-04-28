import Head from "next/head"
import Header from "components/header"
import SandboxCanvas from "components/canvas"
import styles from "styles/sandbox.module.scss"

export default function SandboxPage () {
    return (
        <>
            <Head>
                <title>Sandbox - HTML Blocks</title>
            </Head>
            
            <Header page="sandbox"/>

            <main id={ styles.sandboxMainContainer }>
                <div id={ styles.toolContainer }></div> {/* TODO: Make separate component */}
                <SandboxCanvas />
                <div id={ styles.renderedContentContainer }></div> {/* TODO: Make separate component */}
            </main>
        </>
    )
}