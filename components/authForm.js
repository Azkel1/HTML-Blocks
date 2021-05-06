import React from "react";

import styles from "./authForm.module.scss";

export default function AuthForm({ message, onLoginSubmit, onRegisterSubmit }) {
    const login = React.createRef();
    const register = React.createRef();

    function switchAuth() {
        if (register.current.classList.contains(styles.hidden)) {   //Login form is currently shown
            login.current.classList.add(styles.hidden);
            register.current.classList.remove(styles.hidden);
        } else {
            register.current.classList.add(styles.hidden);
            login.current.classList.remove(styles.hidden);
        }
    }

    return (
        <div>
            <form id={ styles.loginForm } className={ `${styles.form}` } onSubmit={ onLoginSubmit } ref={ login }>
                <label htmlFor="loginEmail">Email: </label>
                <input id="loginEmail" type="email" autoComplete="email" required />

                <label htmlFor="loginPassword">Contraseña: </label>
                <input id="loginPassword" type="password" autoComplete="password" required />

                {message && <p className={ (message.type === "err") ? "errorMessage" : "okMessage" }>{message.text}</p>}

                <button className={ styles.formSubmitButton } type="submit">Iniciar sesión</button>
                <button id={ styles.formSwitchToRegister } className={ styles.formSwitchButton } type="button" onClick={ switchAuth }>¿No tienes una cuenta? Regístrate</button>
            </form>
            
            <form id={ styles.registerForm } className={ `${styles.form} ${styles.hidden}` } onSubmit={ onRegisterSubmit } ref={ register }>
                <button id={ styles.formSwitchToLogin } className={ styles.formSwitchButton } type="button" onClick={ switchAuth }>¿Ya tienes una cuenta? Inicia sesión</button>
                
                <label htmlFor="registerEmail">Email: </label>
                <input id="registerEmail" type="email" autoComplete="email" required />

                <label htmlFor="registerPassword">Contraseña: </label>
                <input id="registerPassword" type="password" autoComplete="new-password" required />

                <label htmlFor="registerPasswordConfirm">Confirmar contraseña: </label>
                <input id="registerPasswordConfirm" type="password" autoComplete="new-password" required />

                {message && <p className={ (message.type === "err") ? "errorMessage" : "okMessage" }>{message.text}</p>}

                <button className={ styles.formSubmitButton } type="submit">Registrarse</button>
            </form>
        </div>
    );
}