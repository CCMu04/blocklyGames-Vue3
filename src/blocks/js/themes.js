import * as Blockly from "blockly";

export const themes = {};

themes.sftTheme = Blockly.Theme.defineTheme('SKY_AND_FOREST_THEME', {
    'base': Blockly.Themes.Classic,
    'blockStyles': {},
    'categoryStyles': {},
    'fontStyle': {
        "weight": "bolder",
        "size": 14
    },
    'componentStyles': {
        workspaceBackgroundColour: '#E0F2F199',
        flyoutBackgroundColour: '#E0F2F1DD',
        scrollbarColour: '#6F8F6F99',
    }
});