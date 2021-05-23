// Predefined values according to element type
const constants = {};

constants.HTML_ELEMENTS = {
    div: {
        color: "darkgrey",
        defaultLabel: "Contenedor de bloque",
        isContainer: true
    },
    span: {
        color: "#5ee2ff",
        defaultLabel: "Contenedor en línea",
        isContainer: true
    },
    img: {
        color: "#5f7fff",
        defaultLabel: "Imagen",
        isContainer: false
    },
    a: {
        color: "#ea68ff",
        defaultLabel: "Enlace",
        isContainer: false
    },
    h1: {
        color: "#ff5757",
        defaultLabel: "Título (Nivel 1)",
        isContainer: false
    },
    h2: {
        color: "#b3ff80",
        defaultLabel: "Título (Nivel 2)",
        isContainer: false
    },
    h3: {
        color: "#ff8148",
        defaultLabel: "Título (Nivel 3)",
        isContainer: false
    },
    p: {
        color: "#ffd957",
        defaultLabel: "Párrafo",
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