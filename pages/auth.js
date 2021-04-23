import { useState } from 'react'
import useUser from 'lib/useUser'
import Head from "next/head"
import Header from "components/header"
import AuthForm from "components/authForm"
import fetchJson from "lib/fetchJson"

import utilStyles from "styles/util.module.scss"

export default function Login() {

    const { mutateUser } = useUser({
        redirectTo: '/profile',
        redirectIfFound: true,
    })

    const [message, setMessage] = useState('');

    async function handleLoginSubmit(e) {
        e.preventDefault()

        const body = {
            email: e.target.loginEmail.value.trim(),
            password: e.target.loginPassword.value.trim()
        }

        try {
            let response = {};
            await mutateUser( 
                response = await fetchJson('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                })
            )
            
            if (!response.ok) setMessage({type: "err", text: response.body.text})
        } catch (error) {
            console.error('Error inesperado:', error)
            setMessage({type: "err", text: error.data?.message})
        }
    }

    async function handleRegisterSubmit(e) {
        e.preventDefault();

        if (e.target.registerPassword.value === e.target.registerPasswordConfirm.value) {
            const body = {
                email: e.target.registerEmail.value.trim(),
                password: e.target.registerPassword.value.trim()
            }
    
            try {
                const response = await fetchJson('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });

                if (response.ok) setMessage({type: "ok", text: response.body.text});
                else setMessage({type: "err", text: response.body.text})

            } catch (error) {
                console.error(error);
            }
        } else {
            setMessage({type: "err", text: "Las contraseñas no coinciden"});
        }
    }
    
    return (
        <div>
            <Head>
                <title>Inicio de sesión - HTML Blocks</title>
            </Head>

            <Header page="auth"/>
            <main className={`${utilStyles.flexContainer} ${utilStyles.noMargin} ${utilStyles.hideOverflow}`}>
                <AuthForm message={message} onLoginSubmit={handleLoginSubmit} onRegisterSubmit={handleRegisterSubmit}/>
            </main>
        </div>
    )
}

