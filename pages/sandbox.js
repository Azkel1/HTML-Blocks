import Head from "next/head"
import Header from "components/header"

export default function SandboxPage () {
    return (
        <div>
            <Head>
                <title>Sandbox - HTML Blocks</title>
            </Head>
            
            <Header page="sandbox"/>

            Texto
        </div>
    )
}