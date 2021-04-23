import { SWRConfig } from 'swr'
import fetch from 'lib/fetchJson'

import 'styles/base.scss'

export default function App({ Component, pageProps }) {

    return (
        <SWRConfig
            value={{
                fetcher: fetch,
                onError: (err) => {
                    console.error(err)
                },
            }}
        >
            <Component {...pageProps} />
        </SWRConfig>
    )
}