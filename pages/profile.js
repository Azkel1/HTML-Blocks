import Head from "next/head";
import Link from "next/link";
import { Header, Footer, Icon } from "components";
import useUser from "lib/useUser";
import fetchJson from "lib/fetchJson";
import { parseDate } from "lib/util";
import Image from "next/image";
import useSWR from "swr";
import React, { useState } from "react";

import styles from "styles/profile.module.scss";

export default function Profile() {
    let userDesigns = [];
    const { user, mutateUser: refreshUserData } = useUser({ redirectTo: "/auth" });
    const { data } = useSWR("/api/designs");
    const [newUserImage, setNewUserImage] = useState("");
    const [newUserName, setNewUserName] = useState("");

    // Element references
    const userDetailsButtonContainer = React.useRef();
    const saveUserDetailsButton = React.useRef();
    const cancelUserDetailsButton = React.useRef();
    const userNameInput = React.useRef();
    const userNameLabel = React.useRef();

    if (!user?.isLoggedIn) {
        return <div className="loadingScreen">Cargando...</div>;
    }

    if (data) {
        data.body.data.forEach(design => {
            userDesigns.push(
                <div key={ design.name + design.creationDate } className={ styles.containerContentRow }>
                    <b>{ design.name }</b>
                    <em>{ parseDate(design.creationDate) }</em>
                    <Link href={ `/sandbox?design=${design.name}` }>
                        <a>Editar</a>
                    </Link>
                </div>
            );
        });

        if (userDesigns.length === 0) {
            userDesigns.push(
                <div key={ "emptyDesign" } className={ styles.containerEmptyContentRow }>
                    <b>
                        ------------------------------------------ Todavía no tienes ningún diseño&nbsp; 
                        <Link href="/sandbox">
                            <a>¡Crea uno!</a>
                        </Link>
                        &nbsp;------------------------------------------
                    </b>
                </div>
            );
        }
    }

    async function saveChanges() {
        const response = await fetchJson("/api/user",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: newUserName || user.name,
                image: {
                    data: newUserImage.data || null,
                    type: newUserImage.type || null,
                }
            })
        });

        if (response.ok) {
            refreshUserData({...user, name: newUserName}, true);        
            setEditModeVisibility(false);
        }
    }

    const uploadProfilePicture = (e) => {
        const {target: {files}} = e;
        const reader = new FileReader();

        // Check if the file is smaller than 500kb
        if (files.length > 0 && (files[0].size / 1024) < (0.5 * 1024) ) {
            reader.readAsDataURL(files[0]);
        
            reader.addEventListener("loadend", () => {
                setNewUserImage({data: reader.result, type: files[0].name.split(".").pop()});
            });

            userDetailsButtonContainer.current.style.display = "grid";
        } else {
            alert("La imagen no puede ser mayor de 500kb");
        }
    };

    const setEditModeVisibility = (mode) => {
        if (mode) {
            userNameLabel.current.style.display = "none";
            userNameInput.current.style.display = "block";
            userDetailsButtonContainer.current.style.display = "grid";

            userNameInput.current.focus();

            
        } else {
            userNameLabel.current.style.display = "block";
            userNameInput.current.style.display = "none";
            userDetailsButtonContainer.current.style.display = "none";

            setNewUserName("");
            setNewUserImage("");
        }
    };

    return (
        <>
            <Head>
                <title>Perfil - HTML Blocks</title>
            </Head>

            <Header page="profile" />
            <main id={ styles.profile }>
                <h1 id={ styles.welcomeMessage }>Bienvenido a tu perfil!</h1>

                <div id={ styles.userCard }> 
                    <label>
                        <Icon icon="file"/>
                        <input type="file" accept="image/*" onChange={ uploadProfilePicture }></input>
                    </label>
                    
                    <Image src={ user.image ? "/img/users/" + user.image : "/svg/empty_image.svg" } layout="responsive" width="215" height="215" quality="100" alt="Imagen del usuario" />

                    <input type="text" id={ styles.userNameInput } ref={ userNameInput } onChange={ (e) => {setNewUserName(e.target.value);} } defaultValue={ user.name || "Nombre de usuario" } maxLength="16"/>
                    <h3 id={ styles.userNameLabel } onClick={ () => (setEditModeVisibility(true)) } ref={ userNameLabel }>{ user.name || "Nombre de usuario" }</h3>

                    {/* FIXME: Don't use so many refs */}
                    <div id={ styles.detailsButtonsContainer } ref={ userDetailsButtonContainer }>
                        <button type="button" ref={ cancelUserDetailsButton } id={ styles.cancelUserDetailsButton } onClick={ () => (setEditModeVisibility(false)) }>X</button>
                        <button type="button" ref={ saveUserDetailsButton } id={ styles.saveUserDetailsButton } onClick={ saveChanges }>Guardar cambios</button>
                    </div>
                </div>

                <div id={ styles.userInfo }>
                    <h3 className={ styles.containerHeader }>Información personal</h3>

                    <div className={ styles.containerContent }>
                        <div className={ styles.containerContentRow }>
                            <b>Email: </b>
                            <i>{ user.email }</i>
                        </div>

                        <div className={ styles.containerContentRow }>
                            <b>Fecha de registro: </b>
                            <i>{ parseDate(user.registerDate) }</i>
                        </div>
                    </div>

                </div>

                <div id={ styles.userDesigns }>
                    <h3 className={ styles.containerHeader }>Tus diseños</h3>

                    <div className={ styles.containerContent }>
                        { userDesigns }
                    </div>
                </div>

            </main>

            <Footer />
        </>
    );
}