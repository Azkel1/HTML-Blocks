import Head from "next/head";
import Link from "next/link";
import constants from "lib/constants";
import { chunkArrayInGroups } from "lib/util";
import { Header, Footer, Icon } from "components";

import styles from "styles/index.module.scss";

export default function HomePage() {
    
    const blocks = chunkArrayInGroups(Object.entries(constants.HTML_ELEMENTS), 4).map((group, index) => {
        return <div key={ index } className={ styles.blockDisplay }>
            {group.map(([key, value]) => {
                return <div key={ key } style={ {backgroundColor: value.color, border: "2px solid rgba(0, 0, 0, 0.3)", boxShadow: "5px 5px 0 0 rgba(0, 0, 0, 0.3)"} }>
                    <span>
                        <Icon icon="block" child={ key }/>
                        { value.defaultLabel }
                    </span>
                    <p>{ value.description }</p>
                </div>;
            })}
        </div>;
    });

    return (
        <>
            <Head>
                <title>Inicio - HTML Blocks</title>
            </Head>

            <Header page="home"/>

            <main id={ styles.mainContainer }>
                <div id={ styles.welcomeContainer }>
                    <h1>Bienvenido a HTML Blocks!</h1>
                    <p>HTML Blocks es una plataforma de aprendizaje para HTML que permite crear páginas web usando intuitivos bloques.</p>
                </div>

                <div id={ styles.blocksContainer }>
                    <h1>Los bloques</h1>
                    <p>A continuación te presentamos los distintos bloques con los que puedes crear diseños increíbles.</p>
                    { blocks }
                </div>

                <div id={ styles.tryItContainer }>
                    <h3>¿Te parece interesante? ¡Te invitamos a crear algo!</h3>
                    <Link href="/sandbox">
                        <a>Prúebalo!</a>
                    </Link>
                </div>
            </main>

            <Footer />
        </>
    );
}