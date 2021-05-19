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

    componentDidMount() {
        this.canvas = new Canvas("main-canvas", {
            width: this.canvasContainer.current.clientWidth,
            height: this.canvasContainer.current.clientHeight,
            selection: false
        });
        this.canvas.includeDefaultValues = false;

        EventEmitter.subscribe("createCanvasItem", (data) => {
            this.canvas.addBlock(data);
            EventEmitter.dispatch("renderHTML", this.canvas);
        });

        // TODO: If currently the canvas is not empty, ask the user before erasing all of his progress.
        EventEmitter.subscribe("loadSavedDesign", (data) => {
            if (data.objects) {
                this.canvas.clear();

                data.objects.forEach(o => {
                    this.canvas.addBlock(o);
                });

                this.canvas.renderAll();
                this.canvas.calcOffset();
                EventEmitter.dispatch("renderHTML", this.canvas);
            }
        });

        // TODO: Remove
        /* this.canvas.addBlock({ top: 0, emType: "div", width: 400, height: 200 });
        this.canvas.addBlock({ top: 300, emType: "img" });
        this.canvas.addBlock({ top: 500, emType: "h1" }); */
        /* ----------------------------------------- */
    }

    componentDidUpdate() {
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
    }

    render() {
        return (
            <div id={ styles.canvasContainer } ref={ this.canvasContainer }>
                <canvas id="main-canvas"></canvas>
            </div>
        );
    }
}