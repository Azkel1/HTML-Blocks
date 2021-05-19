// Predefined values according to element type
const constants = {};

constants.HTML_ELEMENTS = {
    div: {
        color: "darkgrey",
        defaultLabel: "Contenedor de bloque",
        isContainer: true
    },
    img: {
        color: "cornflowerblue",
        defaultLabel: "Imagen",
        isContainer: false
    },
    h1: {
        color: "firebrick",
        defaultLabel: "Título (Nivel 1)",
        isContainer: false
    },
    h2: {
        color: "green",
        defaultLabel: "Título (Nivel 2)",
        isContainer: false
    }
};

constants.BLOCK_SIZES = {
    big: {
        width: 100,
        height: 100
    },
    medium: {
        width: 50,
        height: 50
    },
    small: {
        width: 25,
        height: 25
    },
};

constants.CANVAS_PROPERTIES = [
    "id", 
    "closestObject", 
    "childObjects", 
    "parent", 
    "emType", 
    "label", 
    "isContainer", 
    "lockRotation", 
    "lockScalingFlip", 
    "lockScalingX", 
    "lockScalingY", 
    "hasControls", 
    "perPixelTargetFind", 
    "borderColor", 
    "padding"
];

module.exports = constants;