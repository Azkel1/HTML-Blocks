import Icon from "./icons"
import styles from "./header.module.scss"
import Image from "next/image"
import Link from "next/link"

export default function Header({ page }) {
    //Check if the current page is the homepage to show the "Try it!" button
    const headerButtons = function () {
        switch (page) {
            case "home":
                return (
                    <div id={ styles.buttonContainer }>
                        <Link href="/sandbox">
                            <a className={styles.headerButton}>Pruébalo!</a>
                        </Link>

                        <Link href="/login">
                            <a className={styles.headerButtonWithIcon}>
                                Iniciar sesión
                                <Icon icon="logIn" />
                            </a>
                        </Link>
                    </div>
                )
            case "sandbox":
                return (
                    <div id={ styles.buttonContainer }>
                        <Link href="/login">
                            <a className={styles.headerButtonWithIcon}>
                                Iniciar sesión
                                <Icon icon="logIn" />
                            </a>
                        </Link>
                    </div>
                )
        }
    }

    return (
        <header className={styles.header}>
            <Link href="/">
                <a>
                    <Image src="/svg/HTMLBlocks_logo_min.svg" width="300" height="50" alt="" />
                </a>
            </Link>

            <nav>
                <ul>
                    <li>
                        <Link href="/">
                            <a>Enlace 1</a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/">
                            <a>Enlace 2</a>
                        </Link>
                    </li>

                </ul>
            </nav>
            { headerButtons() }
        </header>
    )
}