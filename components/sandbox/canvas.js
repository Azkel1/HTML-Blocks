import { Canvas } from "lib/fabric.custom";
import { EventEmitter } from "lib/events";
import React from "react";

import styles from "./canvas.module.scss";

/**
 * Page canvas, where the blocks are added.
 */
export default class SandboxCanvas extends React.Component {
    constructor() {
        super();
        this.canvasContainer = React.createRef(); //Create reference to canvasContainer DOM node.
    }

    // Wait for the component to be mounted into the page
    componentDidMount() {
        this.canvas = new Canvas("main-canvas", {
            width: this.canvasContainer.current.clientWidth,
            height: this.canvasContainer.current.clientHeight,
            selection: false
        });
        this.canvas.includeDefaultValues = false;

        // When this event is captured create a new block with the given data
        EventEmitter.subscribe("createCanvasItem", (data) => {
            this.canvas.addBlock(data);
            EventEmitter.dispatch("renderHTML", this.canvas);
        });

        // When this event is captured empty the canvas and load the given data onto it.
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

        // When this event is captured empty the canvas
        EventEmitter.subscribe("emptyCanvas", () => {
            this.canvas.clear();
            EventEmitter.dispatch("renderHTML", this.canvas);
        });

        // Event listener used to resize the canvas when the page's size changes.
        // FIXME: When the page has to grow downwards to accomodate the newly created blocks, it doesn't fire a "resize" event, so the canvas dimensions don't get updated :(
        window.addEventListener("resize", () => {
            const container = document.querySelector(".canvas-container");
            
            // Set height & width to 0 so the parent div can resize
            container.style.width = 0;
            container.style.height = 0;

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