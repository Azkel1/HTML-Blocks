import { fabric } from "fabric"
import styles from "components/canvas.module.scss"
import React from "react"

class RectPreset extends fabric.Rect {
    constructor(width = 100, height = 100) {
        super({
            lockRotation: true,
            lockScalingFlip: true,
            lockScalingX: true,
            lockScalingY: true,
            rx: 5,
            ry: 5,
            hasControls: false,
            perPixelTargetFind: true,
            width: width,
            height: height,
            strokeWidth: 0,
            borderColor: "transparent"
        });
    }

    /**
     * Calculates the distance in pixels from the center of the currently active object to the center of the target object.
     * @param {Object} currentTarget Target object.
     * @returns Distance in pixels to the center of the target.
     */
    distanceToCenter(currentTarget) {
        if (currentTarget) {
            return Math.sqrt(
                Math.pow(currentTarget.getCenterPoint().x - this.getCenterPoint().x, 2) +
                Math.pow(currentTarget.getCenterPoint().y - this.getCenterPoint().y, 2)
            );
        }
    }

    /**
     * Move the object to the coords given. The object is positioned by the top left corner.
     * @param {number} top Pixels to the top of the canvas.
     * @param {number} left Pixels to the left of the canvas.
     */
    setPos(top, left) {
        this.set("top", top);
        this.set("left", left);

        //Update properties & rerender to update position
        this.setCoords();
        this.dirty = true;
    }
}

export default class SandboxCanvas extends React.Component {
    canvas = null;

    constructor() {
        super();
        this.canvasContainer = React.createRef(); //Create reference to canvasContainer DOM node.
    }

    componentDidMount() { //Wait for DOM to load
        this.canvas = new fabric.Canvas("main-canvas", {
            width: this.canvasContainer.current.clientWidth,
            height: this.canvasContainer.current.clientHeight,
            selection: false
        });

        window.addEventListener("resize", () => {
            //Set height & width to 0 so the parent div can resize
            document.querySelector(".canvas-container").style.width = 0;
            document.querySelector(".canvas-container").style.height = 0;

            //Get the current width & height from the parent div. Canvas properties will update automatically
            this.canvas.setWidth(this.canvasContainer.current.clientWidth);
            this.canvas.setHeight(this.canvasContainer.current.clientHeight);
        })

        this.canvas.add(new RectPreset());
    }

    render() {
        return (
            <div id={ styles.canvasContainer } ref={ this.canvasContainer }>
                <canvas id="main-canvas"></canvas>
            </div>
        )
    }
}