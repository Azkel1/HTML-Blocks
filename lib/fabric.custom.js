import { fabric } from "fabric"
import { HTML_ELEMENTS } from "lib/constants"

export class Canvas extends fabric.Canvas {
    constructor(id, options) {
        super(id, options);
    }

    /**
     * Get an object from the canvas by using its id.
     * @param {string} id ID of the object to return.
     * @returns Object with the specified id.
     */
    getObject(id = null) {
        let matching = this.getObjects().filter(obj => obj.id === id);
        return (matching) ? matching[0] : null;
    }
}

export class Rect extends fabric.Rect {
    constructor(top = 0, left = 0, emType, width = 100, height = 100) {
        super({
            //Custom properties
            id: generateUUID(),
            closestObject: null,
            childObjects: new Set(),
            parent: null,
            isContainer: HTML_ELEMENTS[emType].isContainer,
            //Inherited properties
            lockRotation: true,
            lockScalingFlip: true,
            lockScalingX: true,
            lockScalingY: true,
            rx: 6,
            ry: 6,
            hasControls: false,
            perPixelTargetFind: true,
            fill: HTML_ELEMENTS[emType].color,
            top: top,
            left: left,
            width: width,
            height: height,
            stroke: "red",
            strokeWidth: 0,
            padding: 0,
            borderColor: "transparent"
        });

        /**
         * Generate a randomly generated UUID.
         * @returns A randomly generated UUID.
         */
        function generateUUID() {
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
            );
        }

        //CONTINUE: When clicking on a container, create a group of itself and all of its childs, add that group to the canvas and set it as the currently selected item.
        this.on("mousedown:before", (e) => { //mousedown:before OR selected (don't know which one yet)
            if (this.isContainer && this.childObjects.size > 0 && !this.group) {
                const childObjects = [...e.target.childObjects].map((c) => {
                    return this.canvas.getObject(c);
                });
                const group = new Group([this, ...childObjects], {canvas: this.canvas});
                const canvas = this.canvas;
                
                canvas.discardActiveObject();
                canvas.add(group);
                canvas.setActiveObject(group);

                canvas.remove(...[this, ...childObjects]);

                canvas.renderAll();

                canvas.upperCanvasEl.dispatchEvent(new MouseEvent("mousedown", {
                    bubbles: true,
                    cancelable: true,
                    view: window
                }));
            }
        });

        this.on("mousedown", () => {
            const out = this.canvas.fire("object:mouseup", {target: this});
            /* this.canvas.upperCanvasEl.dispatchEvent(new MouseEvent("mouseup", {
                bubbles: true,
                cancelable: true,
                view: window
              })
            ); */
            console.log(out);
        })

        this.on("mouseup", () => {
            console.log("UP!");
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
    setPos(top = this.get("top"), left = this.get("left")) {
        this.set("top", top);
        this.set("left", left);

        //Update properties & rerender to update position
        this.setCoords();
        this.dirty = true;
    }

    /**
     * Get an object position
     * @returns Top left coordinates of the object.
     */
    getPos() {
        return {top: this.get("top"), left: this.get("left")};
    }

    /**
     * Reset the styles of the currently active object, the closest object and hides the line that joins them if it exists.
     */
    hideSnapStyles() {
        this.set({ strokeWidth: 0 });
        this.closestObject.set({ strokeWidth: 0 });
        this.closestObject = null;
    }
}

export class Group extends fabric.Group {
    constructor(objects, options) {
        super(objects, options);

        this.on("mousedown", (e) => {
            console.log(e);
        });

        this.on("mouseup", )

        this.on("modified", () => {
            this.toActiveSelection();
            options.canvas.discardActiveObject();
            options.canvas.renderAll();
        });
    }
}