import Image from "next/image"

import styles from "components/footer.module.scss"

export default function Footer () {
    return (
        <footer className={ styles.footer }>
            {/* <Image src="/svg/HTMLBlocks_logo_min.svg" width="300" height="50" alt="" /> */}
            <p>2021. HTML Blocks.</p>
        </footer>
    )
}