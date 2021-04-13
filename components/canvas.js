import { CustomCanvas, RectPreset } from "lib/fabric.custom"
import styles from "components/canvas.module.scss"
import React from "react"

export default class SandboxCanvas extends React.Component {
    canvas = null;
    newTop = 0;
    edgeDetection = 40;

    constructor() {
        super();
        this.canvasContainer = React.createRef(); //Create reference to canvasContainer DOM node.
    }

    componentDidMount() { //Wait for DOM to load
        this.canvas = new CustomCanvas("main-canvas", {
            width: this.canvasContainer.current.clientWidth,
            height: this.canvasContainer.current.clientHeight,
            selection: false
        });

        window.addEventListener("resize", async () => {
            //Set height & width to 0 so the parent div can resize
            document.querySelector(".canvas-container").style.width = 0;
            document.querySelector(".canvas-container").style.height = 0;

            //Get the current width & height from the parent div. Canvas properties will update automatically
            try { //FIXME: Sometimes it causes an exception, I don't know why. Maybe it has something to do with the browser live reload.
                this.canvas.setWidth(this.canvasContainer.current.clientWidth);
                this.canvas.setHeight(this.canvasContainer.current.clientHeight);
            } catch (e) {
                console.log(e);
            }
        })

        //TEMP: Testing purposes only
        this.canvas.add(new RectPreset(this.newTop, undefined, "div", 400, 200));
        this.newTop += 300;

        this.canvas.add(new RectPreset(this.newTop, undefined, "img"));
        this.newTop += 200;

        this.canvas.add(new RectPreset(this.newTop, undefined, "h1"));
        this.newTop += 200;
        /* ----------------------------------------- */

        this.canvas.on("object:moving", (e) => {
            //Set variables for ease of use
            let activeObject = e.target;
            let target = activeObject.closestObject;
        
            activeObject.setCoords(); // Update object coords as its moving. Used so the following calculations use the correct coordinates.
        
            if (activeObject.closestObject === null) {  //The object isn't close to any other object.
                this.canvas.forEachObject((obj) => {  //Check each Rect of the canvas to see if its close enough.
                    if (activeObject !== obj && obj.isType("rect")) {
                        if (activeObject.intersectsWithObject(obj)) {
                            activeObject.closestObject = obj;
                        }
                    }
                });
            } else {  //The object has a object close enough to snap to it
                if (!activeObject.intersectsWithObject(target)) { //If the object leaves the range
                    activeObject.hideSnapStyles();
                } else { //The object is close enough to snap
                    target.set({ strokeWidth: 2 });
                    activeObject.set({ strokeWidth: 2 });
                }
            }
        });

        this.canvas.on("object:modified", (e) => {
            let activeObject = e.target;
            let target = activeObject.closestObject;
        
            //Check if the object has been dragged outside the canvas. (Left-Right)
            if (activeObject.getPos().left >= (this.canvas.width - activeObject.width)) {  
                activeObject.setPos(undefined, (this.canvas.width - activeObject.width));
            } else if (activeObject.getPos().left < 0) {
                activeObject.setPos(undefined, 0);
            }

            //Check if the object has been dragged outside the canvas. (Top-Bottom)
            if (activeObject.getPos().top >= (this.canvas.height - activeObject.height)) {
                activeObject.setPos((this.canvas.height - activeObject.height));
            } else if (activeObject.getPos().top < 0){
                activeObject.setPos(0);
            }

            //Snap the current object to the target, add the activeObject id to the list of childs of the parent and set the activeObject parent to the target id.
            if (target !== null && target.isContainer) {
                activeObject.setPos(
                    target.top + 10, 
                    target.left + 10 + (activeObject.width * target.childObjects.size));
                target.childObjects.add(activeObject.id);
                activeObject.parent = target.id;
                activeObject.hideSnapStyles();
            } else { //Remove the childs from the parent & reset the objects parent.
                if (activeObject.parent !== null) {
                    this.canvas.getObject(activeObject.parent).childObjects.delete(activeObject.id);
                    activeObject.parent = null;
                }
            }
        });
    }

    render() {
        return (
            <div id={ styles.canvasContainer } ref={ this.canvasContainer }>
                <canvas id="main-canvas"></canvas>
            </div>
        )
    }
}