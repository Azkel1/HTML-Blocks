import Head from "next/head"
import Header from "components/header"
import styles from "styles/login.module.scss"
import utilStyles from "styles/util.module.scss"

export default function Login () {
    return (
        <div>
            <Head>
                <title>Inicio de sesión - HTML Blocks</title>
            </Head>
            
            <Header />
            <main className={ utilStyles.flexContainer }>
                <LoginForm />
            </main>
        </div>
    )
}

function LoginForm () {
    const userLogin = event => {
        event.preventDefault()
    }

    return (
        <form className={ styles.loginForm } onSubmit={ userLogin }>
            <label htmlFor="username">Usuario: </label>
            <input id="username" type="text" autoComplete="username" required />

            <label htmlFor="password">Contraseña: </label>
            <input id="password" type="password" autoComplete="password" required />

            <button className={ `${utilStyles.button} ${styles.formSubmitButton}` } type="submit">Iniciar sesión</button>
            
            <button className={ styles.formSwitchButton }>¿No tienes una cuenta? Regístrate</button>
        </form>
    )
}