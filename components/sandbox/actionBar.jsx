import { useModal, Modal } from "components";
import React, { useEffect, useState } from "react";
import { EventEmitter } from "lib/events";
import constants from "lib/constants";
import fetchJson from "lib/fetchJson";
import useUser from "lib/useUser";
import Select from "react-select";

import parentStyles from "styles/sandbox.module.scss";
import styles from "./actionBar.module.scss";
import { useRouter } from "next/router";

/**
 * Bar located on the top of the page. Used to add buttons that modify the canvas in some way.
 * @param {React.MutableRefObject<undefined>} param0 Reference to the current canvas
 */
export default function ActionBar({ sandboxCanvasRef }) {
    // Visibility variables and setter functions for the modals
    const {isVisible: isSaveVisible, toggleModal: toggleSaveModal} = useModal();
    const {isVisible: isLoadVisible, toggleModal: toggleLoadModal} = useModal();
    const {isVisible: isLoginNoticeVisible, toggleModal: toggleLoginNotice} = useModal();

    const [currentDesign, setCurrentDesign] = useState("Diseño sin guardar");
    const [message, setMessage] = useState(""); // Message shown in the modals
    const [canvas, setCanvas] = useState(""); // Sandbox's canvas. Used to save/load designs
    const [userDesigns, setUserDesigns] = useState([]); // User designs loaded from the DB
    const [selectedDesign, setSelectedDesign] = useState(""); // Selected design in the load design dropdown
    const { user } = useUser(); // User info saved in the cookies
    const router = useRouter(); // Used to redirect the user

    // Update the canvas variable every time the reference updates.
    useEffect(() => {
        setCanvas(sandboxCanvasRef.current.canvas);
    }, [{ sandboxCanvasRef }]);

    /**
     * 
     * @param {Event} e Event originated when clicking the "Save design" button. Used to prevent the form from refreshing the page.
     * @param {"db" | "local"} target Location where the design should be saved. The options are:
     *  - "db": The design is uploaded to the database. Default
     *  - "local": The design is saved to the browsers' local storage. This is used when the user is going to be redirected somewhere else  
     *  and you don't want him to lose its progress.
     * @returns 
     */
    const saveDesign = async function(e, target = "db") {
        e.preventDefault(); // Prevent the page from reloading
        const canvasData = canvas.toJSON(constants.CANVAS_PROPERTIES);

        if (canvasData.objects.length === 0) {
            if (target === "db") setMessage({type: "err", text: "No se puede guardar un diseño vacío"});
        }
        else {
            // Save the design to the DB
            if (target === "db") {
                const designName = document.forms["design-save-form"].querySelector("input").value.trim();
                
                if (!designName) { //Error messag if the input is empty
                    setMessage({type: "err", text: "El nombre del diseño no puede estar vacío"});
                    return;
                }

                // Send the design info to the database to be saved
                const response = await fetchJson("/api/designs", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: designName.toLowerCase(),
                        data: canvasData
                    })
                });

                // If there is an error while saving the design, show a message
                if (!response.ok) {
                    setMessage({type: "err", text: response.body.text});
                } 
                // If not, show an ok message
                else {
                    setCurrentDesign(designName);
                    setMessage({type: "ok", text: response.body.text});
                }
            } 
            // Save the design to the browsers' local storage
            else {
                window.localStorage.setItem("tempDesign", JSON.stringify(canvas.toJSON(constants.CANVAS_PROPERTIES)));
                router.push("/auth");
            }
        }
    };

    /**
     * Fetch all of the current user designs from the DB and save them to be used by the load design dropdown
     */
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

    /**
     * Get the info from the selected design in the dropdown and fire and event for it to be loaded into the canvas.
     * @param {Event} e Event originated when clicking the "Load design" button. Used to prevent the form from refreshing the page.
     */
    const loadDesign = async function(e) {
        e.preventDefault();
        
        if (selectedDesign) {
            const response = await fetchJson(`/api/designs?name=${selectedDesign.value}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
    
            setCurrentDesign(selectedDesign.value);
            EventEmitter.dispatch("loadSavedDesign", response.body.data);
            toggleLoadModal();
        }
    };

    /**
     * Empty the current canvas.
     */
    const emptyCanvas = () => {
        EventEmitter.dispatch("emptyCanvas");
    };

    return(
        <div id={ parentStyles.actionBar } className={ styles.mainContainer } >
            <button type="button" onClick={ user?.isLoggedIn ? toggleSaveModal : toggleLoginNotice }>Guardar diseño</button>
            <button type="button" onClick={ user?.isLoggedIn ? () => {toggleLoadModal(); getUserDesigns(); setSelectedDesign("");} : toggleLoginNotice }>Cargar diseño</button>
            <button type="button" onClick={ emptyCanvas }>Vaciar canvas</button>
            <b id={ styles.designName }>{ currentDesign }</b>
            
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