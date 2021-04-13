import { fabric } from "fabric"

export class CustomCanvas extends fabric.Canvas {
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

export class RectPreset extends fabric.Rect {
    // Predefined values according to element type
    static htmlElements = {
        div: {
            color: "darkgrey",
            isContainer: true
        },
        img: {
            color: "cornflowerblue",
            isContainer: false
        },
        h1: {
            color: "firebrick",
            isContainer: false
        }
    }

    constructor(top = 0, left = 0, emType, width = 100, height = 100) {
        super({
            //Custom properties
            id: generateUUID(),
            closestObject: null,
            childObjects: new Set(),
            parent: null,
            isContainer: RectPreset.htmlElements[emType].isContainer,
            //Inherited properties
            lockRotation: true,
            lockScalingFlip: true,
            lockScalingX: true,
            lockScalingY: true,
            rx: 6,
            ry: 6,
            hasControls: false,
            perPixelTargetFind: true,
            fill: RectPreset.htmlElements[emType].color,
            top: top,
            left: left,
            width: width,
            height: height,
            stroke: "red",
            strokeWidth: 0,
            borderColor: "transparent",
        });

        /**
         * Generate a randomly generated UUID.
         * @returns A randomly generated UUID.
         */
        function generateUUID() {
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
            );
        }
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