import { fabric } from "fabric";
import { HTML_ELEMENTS } from "lib/constants";
import { EventEmitter } from "lib/events";

export class Canvas extends fabric.Canvas {
    
    constructor(id, options) {
        super(id, options);
        this.objectPadding = 10;

        this.on("object:moving", (e) => {
            if (e.target.isType("rect")) {
                //Set variables for ease of use
                let activeObject = e.target;
                let target = activeObject.closestObject;

                activeObject.setCoords(); // Update object coords as its moving. Used so the following calculations use the correct coordinates.

                if (activeObject.closestObject === null) {  //The object isn't close to any other object.
                    this.forEachObject((obj) => {  //Check each Rect of the canvas to see if its close enough.
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
            }
        });

        this.on("object:modified", (e) => {
            if (e.target.isType("rect")) {
                let activeObject = e.target;
                let target = activeObject.closestObject;

                //Check if the object has been dragged outside the canvas. (Left-Right)
                if (activeObject.getPos().left >= (this.width - activeObject.width)) {
                    activeObject.setPos(undefined, (this.width - activeObject.width));
                } else if (activeObject.getPos().left < 0) {
                    activeObject.setPos(undefined, 0);
                }

                //Check if the object has been dragged outside the canvas. (Top-Bottom)
                if (activeObject.getPos().top >= (this.height - activeObject.height)) {
                    activeObject.setPos((this.height - activeObject.height));
                } else if (activeObject.getPos().top < 0) {
                    activeObject.setPos(0);
                }

                //Snap the current object to the target, add the activeObject id to the list of childs of the parent and set the activeObject parent to the target id.
                if (target !== null && target.isContainer) {
                    let newTop = 0;
                    let newLeft = 0;

                    // CONTINUE: If the object doesn't fit to the right, put it below
                    activeObject.setPos(
                        target.top + 10,
                        target.left + 10 + (activeObject.width * target.childObjects.size));

                    target.childObjects.add(activeObject.id);
                    activeObject.parent = target.id;
                    target.update();
                    activeObject.hideSnapStyles();
                } else { //Remove the childs from the parent & reset the objects parent.
                    // TODO: Update the other childs' position inside the parent.
                    if (activeObject.parent !== null) {
                        this.getObject(activeObject.parent).childObjects.delete(activeObject.id);
                        this.getObject(activeObject.parent).update();
                        activeObject.parent = null;
                    }
                }
                
                EventEmitter.dispatch("renderHTML", this);
            }
        });
    }

    addCanvasBlock(item, top, left) {
        // TODO: If top (and/or) left are not defined, determine the best free position available.
        this.add(new Rect(300, undefined, item));
    }

    reorganizeCanvas() {
        // TODO: When called, go item by item and reposition each one.
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
            childObjects: new Set(), // ? Maybe its more correct to use a fabric.Collection
            parent: null,
            emType: emType,
            label: null,
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

                // FIXME: Right now you have to click once on the container for the group to create, and then click again and drag the group.
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
            /* console.log(out); */
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

    update() {
        // TODO: Called when the object needs to be resized or its childs repositioned
        if (this.isContainer) {
            let newWidth = 100;
            let newHeight = 100;

            // It has childs
            if (this.childObjects.size > 0) {
                for (let child of Array.from(this.childObjects)) {
                    child = this.canvas.getObject(child);

                    newWidth += child.width;
                }

                newWidth += this.canvas.objectPadding;
                newHeight += (this.canvas.objectPadding * 2);
            }
            // It doesn't have childs
            else {
                // FIXME: Width & height shouldn't be a fixed value, they should be the default for the shapes size;
                newWidth = 100;
                newHeight = 100;
            }

            this.set("width", newWidth);
            this.set("height", newHeight);
            this.setCoords();
            this.dirty = true;
        }
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

        /* this.on("mousedown", (e) => {
            console.log(e);
        }); */

        this.on("mouseup", );

        this.on("modified", () => {
            this.toActiveSelection();
            options.canvas.discardActiveObject();
            options.canvas.renderAll();
        });
    }
}