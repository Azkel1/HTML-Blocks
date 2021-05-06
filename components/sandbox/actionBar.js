import { useModal, Modal } from "components";
import { useState } from "react";
import { EventEmitter } from "lib/events";
import fetchJson from "lib/fetchJson";
import useSWR from "swr";
import React from "react";

import parentStyles from "styles/sandbox.module.scss";
import styles from "./actionBar.module.scss";

export default function ActionBar({ sandboxCanvasRef }) {
    const {isVisible: isSaveVisible, toggleModal: toggleSaveModal} = useModal();
    const {isVisible: isLoadVisible, toggleModal: toggleLoadModal} = useModal();
    const [message, setMessage] = useState("");
    const loadDesignSelected = React.createRef();

    const saveDesign = async function(e) {
        e.preventDefault();

        const designName = document.forms["design-save-form"].querySelector("input").value.trim();
        
        if (!designName) {
            setMessage({type: "err", text: "El nombre del diseño no puede estar vacío"});
            return;
        }
        
        const canvas = sandboxCanvasRef.current.canvas;
        const includedProperties = ["id", "closestObject", "childObjects", "parent", "emType", "label", "isContainer", "lockRotation", "lockScalingFlip", "lockScalingX", "lockScalingY", "hasControls", "perPixelTargetFind", "borderColor", "padding"];

        const response = await fetchJson("/api/designs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: designName,
                data: canvas.toJSON(includedProperties)
            })
        });

        if (!response.ok) {
            setMessage({type: "err", text: response.body.text});
        } else {
            toggleSaveModal();
        }
    };

    // FIXME: Move to function in lib/util
    const getUserDesigns = function() {
        const { data } = useSWR("/api/designs");
        let userDesigns = [];

        if (data) {
            data.body.data.forEach(design => {
                userDesigns.push(<option key={ design.name }>
                    { design.name }
                </option>);
            });

            return (userDesigns.length > 0 ) ? userDesigns : [<option key="na" value="-1">Sin registros</option>];
        }
    };

    // FIXME: Move to function in lib/util
    const loadDesign = async function(e, designName) {
        e.preventDefault();
        
        const response = await fetchJson(`/api/designs?name=${designName}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        EventEmitter.dispatch("loadSavedDesign", response.body.data);
        toggleLoadModal();
    };

    return(
        <div id={ parentStyles.actionBar } className={ styles.mainContainer } >
            <button type="button" onClick={ toggleSaveModal }>Guardar diseño</button>
            <button type="button" onClick={ toggleLoadModal }>Cargar diseño</button>
            
            <Modal isVisible={ isSaveVisible } hideModal={ () => {toggleSaveModal(); setMessage("");} } title="Guardar tu diseño">
                <form id="design-save-form" onSubmit={ saveDesign }>
                    <label>
                        Nombre del diseño:
                        <input type="text" name="design-name" title="Introduce el nombre del diseño" required/>
                    </label>

                    { message && <p className={ (message.type === "err") ? "errorMessage" : "okMessage" }>{ message.text }</p>}

                    <button type="submit">Guardar</button>
                </form>
            </Modal>

            <Modal isVisible={ isLoadVisible } hideModal={ () => {toggleLoadModal(); setMessage("");} } title="Cargar uno de tus diseños">
                <form id="design-load-form" onSubmit={ (e) => {loadDesign(e, loadDesignSelected.current.value);} }>
                    <label>
                        Diseño:
                        {/* TODO: USE https://react-select.com/ to replace the select with a prettier one */}
                        <select ref={ loadDesignSelected }>
                            { getUserDesigns() }
                        </select>
                    </label>

                    { message && <p className={ (message.type === "err") ? "errorMessage" : "okMessage" }>{ message.text }</p>}

                    <button type="submit">Cargar</button>
                </form>
            </Modal>
        </div>
    );
}