import { useModal, Modal } from "components";
import { useState } from "react";
import fetchJson from "lib/fetchJson";

import parentStyles from "styles/sandbox.module.scss";
import styles from "./actionBar.module.scss";

export default function ActionBar({ sandboxCanvasRef }) {
    const {isVisible: isSaveVisible, toggleModal: toggleSaveModal} = useModal();
    const {isVisible: isLoadVisible, toggleModal: toggleLoadModal} = useModal();
    const [message, setMessage] = useState("");

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

        console.log(response);

        if (response.ok) {
            setMessage({type: "ok", text: response.body.text});
        } else {
            setMessage({type: "err", text: response.body.text});
        }
    };

    const loadDesign = function(json) {
        canvas.loadFromJSON(json);
    }

    return(
        <div id={ parentStyles.actionBar } className={ styles.mainContainer } >
            <button type="button" onClick={ toggleSaveModal }>Guardar diseño</button>
            <button type="button">Cargar diseño</button>
            
            <Modal isVisible={isSaveVisible} hideModal={toggleSaveModal} title="Guardar tu diseño">
                <form id="design-save-form">
                    <label>
                        Nombre del diseño:
                        <input type="text" name="design-name" title="Introduce el nombre del diseño" required/>
                    </label>
                    {message && <p className={ (message.type === "err") ? "errorMessage" : "okMessage"}>{message.text}</p>}
                    {/* TODO: Add error message (if design with that name already exists) */}

                    <button type="submit" onClick={ saveDesign }>Guardar</button>
                </form>
            </Modal>
        </div>
    )
}