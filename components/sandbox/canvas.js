import { Canvas } from "lib/fabric.custom";
import { EventEmitter } from "lib/events";
import React from "react";

import styles from "./canvas.module.scss";

export default class SandboxCanvas extends React.Component {
    constructor() {
        super();
        this.canvasContainer = React.createRef(); //Create reference to canvasContainer DOM node.
        this.newTop = 0;
        this.edgeDetection = 40;
    }

    componentDidMount() { //Wait for DOM to load
        this.canvas = new Canvas("main-canvas", {
            width: this.canvasContainer.current.clientWidth,
            height: this.canvasContainer.current.clientHeight,
            selection: false
        });
        this.canvas.includeDefaultValues = false;

        window.addEventListener("resize", () => {
            // Set height & width to 0 so the parent div can resize
            document.querySelector(".canvas-container").style.width = 0;
            document.querySelector(".canvas-container").style.height = 0;

            // Get the current width & height from the parent div. Canvas properties will update automatically
            try { // FIXME: Sometimes it causes an exception, I don't know why. Maybe it has something to do with the browser live reload.
                this.canvas.setWidth(this.canvasContainer.current.clientWidth);
                this.canvas.setHeight(this.canvasContainer.current.clientHeight);
            } catch (e) {
                console.error(e);
            }
        });

        EventEmitter.subscribe("createCanvasItem", (itemType, top, left) => {
            this.canvas.addCanvasBlock(itemType, top, left);
        });

        // * Testing purposes only
        /* this.canvas.add(new Rect(0, undefined, "div", 400, 200));
        this.canvas.add(new Rect(300, undefined, "img"));
        this.canvas.add(new Rect(500, undefined, "h1")); */
        /* ----------------------------------------- */
    }

    render() {
        return (
            <div id={styles.canvasContainer} ref={this.canvasContainer}>
                <canvas id="main-canvas"></canvas>
            </div>
        );
    }
}