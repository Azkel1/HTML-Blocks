// Predefined values according to element type
const constants = {};

constants.HTML_ELEMENTS = {
    div: {
        color: "darkgrey",
        defaultLabel: "Contenedor de bloque",
        description: "Dentro de este bloque se pueden meter otros bloques, que se ponen uno encima de otro",
        isContainer: true
    },
    span: {
        color: "#5ee2ff",
        defaultLabel: "Contenedor en línea",
        description: "Dentro de este bloque se pueden meter otros bloques, que se ponen uno encima al lado del otro",
        isContainer: true
    },
    img: {
        color: "#5f7fff",
        defaultLabel: "Imagen",
        description: "Este bloque representa una imagen, de lo que más te guste.",
        isContainer: false
    },
    a: {
        color: "#ea68ff",
        defaultLabel: "Enlace",
        description: "Al hacer clic en este bloque te lleva a otra parte.",
        isContainer: false
    },
    h1: {
        color: "#ff5757",
        defaultLabel: "Título (Nivel 1)",
        description: "Un título, el más grande que hay.",
        isContainer: false
    },
    h2: {
        color: "#b3ff80",
        defaultLabel: "Título (Nivel 2)",
        description: "Otro título, pero no tan importante como el anterior.",
        isContainer: false
    },
    h3: {
        color: "#ff8148",
        defaultLabel: "Título (Nivel 3)",
        description: "El título menos importante, pero no el menos valioso.",
        isContainer: false
    },
    p: {
        color: "#ffd957",
        defaultLabel: "Párrafo",
        description: "Este bloque representa un texto, nada más y nada menos.",
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