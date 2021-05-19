import { useModal, Modal } from "components";
import React, { useEffect, useState } from "react";
import { EventEmitter } from "lib/events";
import { saveDesignToDB, saveDesignToCookie } from "lib/util";
import constants from "lib/constants";
import fetchJson from "lib/fetchJson";
import useUser from "lib/useUser";
import Select from "react-select";

import parentStyles from "styles/sandbox.module.scss";
import styles from "./actionBar.module.scss";
import { useRouter } from "next/router";

export default function ActionBar({ sandboxCanvasRef }) {
    const {isVisible: isSaveVisible, toggleModal: toggleSaveModal} = useModal();
    const {isVisible: isLoadVisible, toggleModal: toggleLoadModal} = useModal();
    const {isVisible: isLoginNoticeVisible, toggleModal: toggleLoginNotice} = useModal();
    const [message, setMessage] = useState("");
    const [canvas, setCanvas] = useState("");
    const [userDesigns, setUserDesigns] = useState([]);
    const [selectedDesign, setSelectedDesign] = useState("");
    const { user } = useUser();
    const router = useRouter();

    // Update the canvas variable every time the reference updates.
    useEffect(() => {
        setCanvas(sandboxCanvasRef.current.canvas);
    }, [{sandboxCanvasRef}]);

    const saveDesign = async function(e, target) {
        if (target === "db") {
            e.preventDefault();
            const designName = document.forms["design-save-form"].querySelector("input").value.trim();
            
            if (!designName) {
                setMessage({type: "err", text: "El nombre del diseño no puede estar vacío"});
                return;
            }

            const response = await saveDesignToDB(designName, canvas.toJSON(constants.CANVAS_PROPERTIES));

            if (!response.ok) {
                setMessage({type: "err", text: response.body.text});
            } else {
                toggleSaveModal();
            }
        } else {
            window.localStorage.setItem("tempDesign", JSON.stringify(canvas.toJSON(constants.CANVAS_PROPERTIES)));
            router.push("/auth");
        }
    };

    const getUserDesigns = async function() {
        const { body: {data}} = await fetchJson("/api/designs");
        let response = [];

        if (data) {
            data.forEach(design => {
                response.push(
                    {
                        value: design.name,
                        label: design.name
                    }
                );
            });

            setUserDesigns((response.length > 0 ) ? response : [{ value: -1, label: "Sin registros" }]);
        }
    };

    const loadDesign = async function(e) {
        e.preventDefault();
        
        if (selectedDesign) {
            const response = await fetchJson(`/api/designs?name=${selectedDesign.value}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
    
            EventEmitter.dispatch("loadSavedDesign", response.body.data);
            toggleLoadModal();
        }
    };

    return(
        <div id={ parentStyles.actionBar } className={ styles.mainContainer } >
            <button type="button" onClick={ user?.isLoggedIn ? toggleSaveModal : toggleLoginNotice }>Guardar diseño</button>
            <button type="button" onClick={ user?.isLoggedIn ? () => {toggleLoadModal(); getUserDesigns(); setSelectedDesign("");} : toggleLoginNotice }>Cargar diseño</button>
            
            <Modal isVisible={ isSaveVisible } hideModal={ () => {toggleSaveModal(); setMessage("");} } title="Guardar tu diseño">
                <form id="design-save-form" onSubmit={ (e) => { saveDesign(e, "db"); } }>
                    <label>
                        Nombre del diseño:
                        <input type="text" name="design-name" title="Introduce el nombre del diseño" required/>
                    </label>

                    { message && <p className={ (message.type === "err") ? "errorMessage" : "okMessage" }>{ message.text }</p>}

                    <button type="submit">Guardar</button>
                </form>
            </Modal>

            <Modal isVisible={ isLoadVisible } hideModal={ () => {toggleLoadModal(); setMessage("");} } title="Cargar uno de tus diseños">
                <form id="design-load-form" onSubmit={ (e) => {loadDesign(e);} }>
                    <label>
                        Diseño:
                        <Select onChange={ setSelectedDesign } options={ userDesigns } className="custom-select" classNamePrefix="custom-select" placeholder="Elige un diseño"/>
                    </label>

                    { message && <p className={ (message.type === "err") ? "errorMessage" : "okMessage" }>{ message.text }</p>}

                    <button type="submit">Cargar</button>
                </form>
            </Modal>

            <Modal isVisible={ isLoginNoticeVisible } hideModal={ toggleLoginNotice } title="Inicio de sesión necesario">
                <p>Para poder guardar o cargar diseños primero es necesario iniciar sesión.</p>
                <button type="button" onClick={ (e) => { saveDesign(e, "local"); } }>Iniciar sesión</button>
            </Modal>
        </div>
    );
}