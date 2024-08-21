import * as Blockly from "blockly";

export const themes = {};

themes.sftTheme = Blockly.Theme.defineTheme('SKY_AND_FOREST_THEME', {
    'base': Blockly.Themes.Classic,
    'blockStyles': {},
    'categoryStyles': {},
    'fontStyle': {
        "family": "Noto Sans SC, ZCOOL KuaiLe, sans-serif",
        "weight": "bold",
        "size": 12
    },
    'componentStyles': {
        workspaceBackgroundColour: '#E0F2F199',
        flyoutBackgroundColour: '#E0F2F1',
        scrollbarColour: '#6F8F6F99',
    }
});