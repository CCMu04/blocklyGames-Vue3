import * as Blockly from 'blockly'
import {javascriptGenerator} from "blockly/javascript";

Blockly.Blocks['turn_left'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("向左转向");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

javascriptGenerator.forBlock['turn_left'] = function (block, generator) {
    return `turn(-1);\n`;
};

Blockly.Blocks['turn_right'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("向右转向");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

javascriptGenerator.forBlock['turn_right'] = function (block, generator) {
    return `turn(1);\n`;
};

Blockly.Blocks['move'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("移动");
        this.appendDummyInput()
            .appendField(new Blockly.FieldNumber(1, 1, 10), "count")
        this.appendDummyInput()
            .appendField("步");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

javascriptGenerator.forBlock['move'] = function (block, generator) {
    let text_count = block.getFieldValue('count');
    let code = '';
    for (let i = 0; i < text_count; i++) code += 'move();\n';
    return code;
};