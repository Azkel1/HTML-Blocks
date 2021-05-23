import React from "react";
import constants from "lib/constants";
import { EventEmitter } from "lib/events";
import { Icon } from "components";

import styles from "./toolContainer.module.scss";
import parentStyles from "styles/sandbox.module.scss";

/**
 * Container to the left of the canvas. Holds the buttons to add the different blocks to the it.
 */
export default class ToolContainer extends React.Component {
    constructor() {
        super();
        this.emButtons = [];

        // Loop through the elements in the constants file and create each one of the corresponding buttons.
        for (let [key, value] of Object.entries(constants.HTML_ELEMENTS)) {
            this.emButtons.push(
                <button type="button" key={ key } style={ {backgroundColor: value.color} } title={ value.defaultLabel } onClick={ () => EventEmitter.dispatch("createCanvasItem", {emType: key}) }>
                    <Icon icon="block" child={ key }/>
                </button>
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