import React, { useEffect } from "react";
import Head from "next/head";
import Header from "components/header";
import { SandboxCanvas, ToolContainer, ActionBar } from "components/sandbox";
import { EventEmitter } from "lib/events";
import constants from "lib/constants";
import fetchJson from "lib/fetchJson";

import styles from "styles/sandbox.module.scss";

export default function SandboxPage() {
    const toolContainer = React.useRef();
    const sandboxCanvas = React.useRef();
    const contentContainer = React.useRef();
    
    useEffect(() => {
        const paramDesign = new URLSearchParams(window.location.search).get("design");
        if (paramDesign) {
            fetchJson(`/api/designs?name=${paramDesign}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            }).then(response => {
                EventEmitter.dispatch("loadSavedDesign", response.body.data);
            });
        }

        // Check the browser's local storage for a saved design, if found load it.
        const tempDesign = window.localStorage.getItem("tempDesign");
        if (tempDesign) EventEmitter.dispatch("loadSavedDesign", JSON.parse(tempDesign));
    });

    // When the "renderHTML" event is fired, get all the elements from the canvas and create the corresponding HTML structure.
    EventEmitter.subscribe("renderHTML", (canvas) => {
        if (contentContainer.current) {
            contentContainer.current.textContent = "";
            canvas.forEachObject((obj) => (createElement)(obj, contentContainer.current));
        }

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
                em.style.backgroundColor = constants.HTML_ELEMENTS[obj.emType].color;
                if (obj.emType === "img") em.src = "/svg/empty_image.svg";
                if (obj.emType === "a") em.href = "#";
            
                label.textContent = obj.label || constants.HTML_ELEMENTS[obj.emType].defaultLabel;
                em.appendChild(label);

                if (obj.isContainer && obj.childObjects.length > 0) {
                    obj.childObjects.forEach((childObj) => (createElement)(canvas.getObject(childObj), em));
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
                <ToolContainer ref={ toolContainer }/>
                <SandboxCanvas ref={ sandboxCanvas }/>
                <div id={ styles.renderedContentContainer } ref={ contentContainer }></div>
            </main>
        </>
    );
}