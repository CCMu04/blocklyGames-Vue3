import * as Blockly from 'blockly';
import {javascriptGenerator} from 'blockly/javascript';

export function defineMiGongBlocks() {
    // 定义“向左转向”块
    Blockly.Blocks['turn_left'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("向左转向");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(270);
            this.setTooltip("");
            this.setHelpUrl("");
        }
    };

    // “向左转向”块的代码生成器
    javascriptGenerator['turn_left'] = function (block) {
        return `turn(-1);\n`;
    };

    // 定义“向右转向”块
    Blockly.Blocks['turn_right'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("向右转向");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(270);
            this.setTooltip("");
            this.setHelpUrl("");
        }
    };

    // “向右转向”块的代码生成器
    javascriptGenerator['turn_right'] = function (block) {
        return `turn(1);\n`;
    };

    // 定义“移动”块
    Blockly.Blocks['move'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("移动");
            this.appendDummyInput()
                .appendField(new Blockly.FieldNumber(1, 1, 10), "count")
                .appendField("步");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(270);
            this.setTooltip("");
            this.setHelpUrl("");
        }
    };

    // “移动”块的代码生成器
    javascriptGenerator['move'] = function (block) {
        const text_count = block.getFieldValue('count');
        let code = '';
        for (let i = 0; i < text_count; i++) {
            code += 'move();\n';
        }
        return code;
    };
}
