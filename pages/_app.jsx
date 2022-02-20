import { SWRConfig } from "swr";
import fetch from "lib/fetchJson";
import Head from "next/head";

import "styles/base.scss";

export default function App({ Component, pageProps }) {

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
            </Head>
            <SWRConfig
                value={{
                    fetcher: fetch,
                    onError: (err) => {
                        console.error(err);
                    },
                }}
            >
                <Component {...pageProps} />
            </SWRConfig>
        </>
    );
}