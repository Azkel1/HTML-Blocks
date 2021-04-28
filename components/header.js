import useUser from 'lib/useUser'
import fetchJson from 'lib/fetchJson'

import Icon from "components/icons"
import styles from "components/header.module.scss"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from 'next/router'

export default function Header({ page }) {
    const { user, mutateUser } = useUser();
    const router = useRouter();

    const headerButtons = function () {
        return (
            <div id={ styles.buttonContainer }>
                { page !== "sandbox" &&
                    <Link href="/sandbox">
                        <a className={ styles.headerButton }>Pruébalo!</a>
                    </Link>
                }
                { page !== "auth" && !user?.isLoggedIn &&
                    <Link href="/auth">
                        <a className={ styles.headerButtonWithIcon }>
                            Iniciar sesión
                                <Icon icon="logIn" />
                        </a>
                    </Link>
                }
                { user?.isLoggedIn &&
                    <Link href="/profile">
                        <a className={ styles.headerButtonWithIcon }>
                            <Icon icon="user" />
                        </a>
                    </Link>
                }
                { user?.isLoggedIn &&
                    <Link href="/api/logout">
                        <a className={ styles.headerButtonWithIcon } onClick={ async (e) => {
                            e.preventDefault();
                            await mutateUser(fetchJson("/api/logout"));
                            router.push("/auth");
                        }}><Icon icon="logOut" /></a>
                    </Link>
                }
            </div>
        )
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
            { headerButtons()}
        </header>
    )
}
