import React from "react"
import { HTML_ELEMENTS } from "lib/constants"
import { EventEmitter } from "lib/events"

import styles from "components/toolContainer.module.scss"

export default class ToolContainer extends React.Component {

    emButtons = [];

    constructor() {
        super();
        for (let [key, value] of Object.entries(HTML_ELEMENTS)) {
            this.emButtons.push(
                <button action="button" key={ key } style={{ backgroundColor: value.color}} onClick={ () => EventEmitter.dispatch
                ("createCanvasItem", key) }></button>
            );
        }
    }

    render() {
        return (
            <div id={ styles.mainContainer }>
                { this.emButtons }
            </div>
        )
    } 
}