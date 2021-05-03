import React from "react"
import Head from "next/head"
import Header from "components/header"
import { SandboxCanvas, ToolContainer, ActionBar } from "components/sandbox"
import { EventEmitter } from "lib/events"
import { HTML_ELEMENTS } from "lib/constants"

import styles from "styles/sandbox.module.scss"

export default function SandboxPage () {
    const toolContainer = React.createRef();
    const sandboxCanvas = React.createRef();
    const contentContainer = React.createRef();

    // When the "renderHTML" event is fired, get all the elements from the canvas and create the corresponding HTML structure.
    EventEmitter.subscribe("renderHTML", (canvas) => {
        contentContainer.current.textContent = "";
        
        canvas.forEachObject((obj) => (createElement)(obj, contentContainer.current));

        /**
         * Create a HTML element from a fabric object.
         * TODO: Find a more appropiate type for the target
         * @param {fabric.Object} obj Object to be created & added
         * @param {object} target Container to which the object will be appended.
         */
        function createElement(obj, target) {
            if (obj.isType("rect") && !document.getElementById(obj.id)) {
                const em = document.createElement(obj.emType);
                const label = document.createElement("span");

                em.id = obj.id;
                em.style.backgroundColor = HTML_ELEMENTS[obj.emType].color;
                if (obj.emType === "img") em.src = "/svg/empty_image.svg";
                
                label.textContent = obj.label || HTML_ELEMENTS[obj.emType].defaultLabel;
                em.appendChild(label);

                if (obj.isContainer && obj.childObjects.size > 0) {
                    Array.from(obj.childObjects).forEach((childObj) => (createElement)(canvas.getObject(childObj), em));
                    target.appendChild(em);
                } else {
                    // If the object has a parent make sure the element is being added to it
                    if (obj.parent) {
                        if (obj.parent === target.id) target.appendChild(em);
                    } 
                    // If not it means its parent is the container, add it.
                    else {
                        target.appendChild(em);
                    }
                }
            }
        }
    });
    
    return (
        <>
            <Head>
                <title>Sandbox - HTML Blocks</title>
            </Head>
            
            <Header page="sandbox"/>

            <main id={ styles.sandboxMainContainer }>
                <ActionBar sandboxCanvasRef={ sandboxCanvas }/>
                <ToolContainer ref={ toolContainer }/> {/* TODO: Make separate component */}
                <SandboxCanvas ref={ sandboxCanvas }/>
                <div id={ styles.renderedContentContainer } ref={ contentContainer }></div> {/* TODO: Make separate component */}
            </main>
        </>
    )
}