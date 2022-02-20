import React, { useState } from "react";
import useUser from "lib/useUser";
import Head from "next/head";
import { Header } from "components";
import fetchJson from "lib/fetchJson";

import styles from "styles/auth.module.scss";

export default function Login() {
    const { mutateUser } = useUser({
        redirectTo: "/profile",
        redirectIfFound: true,
    });

    const [message, setMessage] = useState("");
    const login = React.createRef();
    const register = React.createRef();

    async function handleLoginSubmit(e) {
        e.preventDefault();

        const body = {
            email: e.target.loginEmail.value.trim(),
            password: e.target.loginPassword.value.trim()
        };

        try {
            let response = {};
            await mutateUser( 
                response = await fetchJson("/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                })
            );
            
            if (!response.ok) setMessage({type: "err", text: response.body.text});
        } catch (error) {
            console.error("Error inesperado:", error);
            setMessage({type: "err", text: error.data?.message});
        }
    }

    async function handleRegisterSubmit(e) {
        e.preventDefault();

        if (e.target.registerPassword.value === e.target.registerPasswordConfirm.value) {
            const body = {
                email: e.target.registerEmail.value.trim(),
                password: e.target.registerPassword.value.trim()
            };
    
            try {
                const response = await fetchJson("/api/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                if (response.ok) setMessage({type: "ok", text: response.body.text});
                else setMessage({type: "err", text: response.body.text});

            } catch (error) {
                console.error(error);
            }
        } else {
            setMessage({type: "err", text: "Las contraseñas no coinciden"});
        }
    }

    function switchAuth() {
        if (register.current.classList.contains(styles.hidden)) {   //Login form is currently shown
            login.current.classList.add(styles.hidden);
            register.current.classList.remove(styles.hidden);
            login.current.reset();
        } else {    //Register form is currently shown
            register.current.classList.add(styles.hidden);
            login.current.classList.remove(styles.hidden);
            register.current.reset();
        }

        setMessage("");
    }
    
    return (
        <>
            <Head>
                <title>Inicio de sesión - HTML Blocks</title>
            </Head>

            <Header page="auth"/>
            <main className={ styles.cardsContainer }>
                <>
                    <form id={ styles.loginForm } className={ `${styles.form}` } onSubmit={ handleLoginSubmit } ref={ login }>
                        <label htmlFor="loginEmail">Email: </label>
                        <input id="loginEmail" type="email" autoComplete="email" required />

                        <label htmlFor="loginPassword">Contraseña: </label>
                        <input id="loginPassword" type="password" autoComplete="password" required />

                        { message && <p className={ (message.type === "err") ? "errorMessage" : "okMessage" }>{message.text}</p> }

                        <button className={ styles.formSubmitButton } type="submit">Iniciar sesión</button>
                        <button id={ styles.formSwitchToRegister } className={ styles.formSwitchButton } type="button" onClick={ switchAuth }>¿No tienes una cuenta? Regístrate</button>
                    </form>
                    
                    <form id={ styles.registerForm } className={ `${styles.form} ${styles.hidden}` } onSubmit={ handleRegisterSubmit } ref={ register }>
                        <button id={ styles.formSwitchToLogin } className={ styles.formSwitchButton } type="button" onClick={ switchAuth }>¿Ya tienes una cuenta? Inicia sesión</button>
                        
                        <label htmlFor="registerEmail">Email: </label>
                        <input id="registerEmail" type="email" autoComplete="email" required />

                        <label htmlFor="registerPassword">Contraseña: </label>
                        <input id="registerPassword" type="password" autoComplete="new-password" minLength="8" required />

                        <label htmlFor="registerPasswordConfirm">Confirmar contraseña: </label>
                        <input id="registerPasswordConfirm" type="password" autoComplete="new-password" minLength="8" required />

                        { message && <p className={ (message.type === "err") ? "errorMessage" : "okMessage" }>{message.text}</p> }

                        <button className={ styles.formSubmitButton } type="submit">Registrarse</button>
                    </form>
                </>
            </main>
        </>
    );
}

