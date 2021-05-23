import { fabric } from "fabric";
import constants from "lib/constants";
import { EventEmitter } from "lib/events";

export class Canvas extends fabric.Canvas {
    
    constructor(id, options) {
        super(id, options);
        this.objectPadding = 10;

        // When an object is currently being moved
        this.on("object:moving", (e) => {
            if (e.target.isType("rect")) { // Check if its a rectangle
                //Set variables for convenience
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

        // When an object has been moved
        this.on("object:modified", (e) => {
            if (e.target.isType("rect")) { // Check if its a rectangle
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

                    // TODO: If the object doesn't fit to the right, put it below
                    activeObject.setPos(
                        target.top + this.objectPadding,
                        target.left + this.objectPadding + (activeObject.width * target.childObjects.length) 
                    );

                    target.addChild(activeObject.id);
                    activeObject.parent = target.id;
                    target.update();
                    activeObject.bringToFront();
                    activeObject.hideSnapStyles();
                } else { //Remove the childs from the parent & reset the objects parent.
                    if (activeObject.parent !== null) {
                        this.getObject(activeObject.parent).removeChild(activeObject.id);
                        this.getObject(activeObject.parent).update();
                        activeObject.parent = null;
                    }
                }
                
                EventEmitter.dispatch("renderHTML", this);
            }
        });
    }

    /**
     * Add a new block with the given properties to the canvas.
     * @param {object} data Properties of the new block.
     */
    addBlock(data) {
        // TODO: If top (and/or) left are not defined, determine the best free position available.
        if (!data.top) data.top = 300;
        this.add(new Rect(data));
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
    constructor(data) {
        super({
            //Custom properties
            id: data.id || generateUUID(),
            closestObject: data.closestObject || null,
            childObjects: (data.childObjects && data.childObjects.length > 0) ? data.childObjects : [],
            parent: data.parent || null,
            emType: data.emType,
            label: data.label || null,
            isContainer: constants.HTML_ELEMENTS[data.emType].isContainer,

            //Inherited properties
            lockRotation: true,
            lockScalingFlip: true,
            lockScalingX: true,
            lockScalingY: true,
            rx: 6,
            ry: 6,
            hasControls: false,
            perPixelTargetFind: true,
            fill: constants.HTML_ELEMENTS[data.emType].color,
            top: data.top || 0,
            left: data.left || 0,
            width: data.width || 100,
            height: data.height || 100,
            stroke: "red",
            strokeWidth: 0,
            padding: 0,
            borderColor: "transparent"
        });

        /**
         * Generate a randomly generated UUID.
         * @returns The randomly generated UUID.
         */
        function generateUUID() {
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
            );
        }

        // When a object with the property isContainer is clicked
        this.on("mousedown:before", (e) => { 
            if (this.isContainer && this.childObjects.length > 0 && !this.group) {
                const childObjects = e.target.childObjects.map((c) => {
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
    }

    /**
     * Add a child to the current object.
     * @param {string} id ID of the child.
     */
    addChild(id) {
        let currentChildren = new Set(this.childObjects);
        currentChildren.add(id);
        this.childObjects = Array.from(currentChildren);
    }

    /**
     * Remove a child from the current object.
     * @param {string} id ID of the child to be removed.
     */
    removeChild(id) {
        let currentChildren = new Set(this.childObjects);
        currentChildren.delete(id);
        this.childObjects = Array.from(currentChildren);
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
        if (this.isContainer) {
            let newWidth = 100;
            let newHeight = 100;

            // It has childs
            if (this.childObjects.length > 0) {
                for (let i in this.childObjects) {
                    const child = this.canvas.getObject(this.childObjects[i]);
                    child.setPos(undefined, this.left + this.canvas.objectPadding + (child.width * i));

                    newWidth += child.width;
                }

                newWidth += this.canvas.objectPadding * 2;
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

        this.on("modified", () => {
            this.toActiveSelection();
            options.canvas.discardActiveObject();
            options.canvas.renderAll();
        });
    }
}