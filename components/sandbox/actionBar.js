import { useModal, Modal } from "components";
import React, { Component } from "react";

import parentStyles from "styles/sandbox.module.scss";
import styles from "./actionBar.module.scss";

export default function ActionBar({ sandboxCanvasRef }) {
    const {isVisible: isSaveVisible, toggleModal: toggleSaveModal} = useModal();
    const {isVisible: isLoadVisible, toggleModal: toggleLoadModal} = useModal();

    const saveDesign = function(e) {
        e.preventDefault();

        const canvas = sandboxCanvasRef.current.canvas;
        const form = document.forms["design-save-form"];
        const includedProperties = ["id", "closestObject", "childObjects", "parent", "emType", "label", "isContainer", "lockRotation", "lockScalingFlip", "lockScalingX", "lockScalingY", "hasControls", "perPixelTargetFind", "borderColor", "padding"];

        console.log(canvas.toJSON(includedProperties));
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
                    {/* TODO: Add error message (if design with that name already exists) */}

                    <button type="submit" onClick={ saveDesign }>Guardar</button>
                </form>
            </Modal>
        </div>
    )
}