import { useState } from "react";
import { createPortal } from "react-dom";

import styles from "./modal.module.scss";

export const useModal = () => {
    const [isVisible, setVisibility] = useState(false);
    
    function toggleModal() {
        setVisibility(!isVisible);
    }

    return {
        isVisible,
        toggleModal,
    };
};

export function Modal({ isVisible, hideModal, children, title }) {
    return isVisible ? createPortal(
        <div id={ styles.mainContainer }>
            <div id={ styles.content }>
                <span>
                    <h3>{ title }</h3>
                    <button id= { styles.closeModal } onClick={ hideModal }>X</button>
                </span>
                <div>
                    { children }
                </div>
            </div>
        </div>
        , document.body) : null;
}