import React from "react";
import constants from "lib/constants";
import { EventEmitter } from "lib/events";

import styles from "./toolContainer.module.scss";
import parentStyles from "styles/sandbox.module.scss";

export default class ToolContainer extends React.Component {


    constructor() {
        super();
        this.emButtons = [];

        for (let [key, value] of Object.entries(constants.HTML_ELEMENTS)) {
            this.emButtons.push(<button type="button" key={ key } style={ {backgroundColor: value.color} } onClick={ () => EventEmitter.dispatch("createCanvasItem", {emType: key}) }></button>
            );
        }
    }

    render() {
        return (
            <div id={ parentStyles.toolContainer } className={ styles.mainContainer }>
                { this.emButtons }
            </div>
        );
    } 
}