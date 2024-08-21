import '@/blocks/MiGong'

export const toolboxs = [
    {
        id: 1,
        toolbox: [
            { // 第1关
                "kind": "flyoutToolbox",
                "contents": [
                    {
                        kind: "block",
                        type: "move"
                    }
                ]
            },
            { // 第2关
                "kind": "flyoutToolbox",
                "contents": [
                    {
                        kind: "block",
                        type: "turn_right"
                    },
                    {
                        kind: "block",
                        type: "turn_left"
                    },
                    {
                        kind: "block",
                        type: "move"
                    }
                ]
            },
            { // 第3关
                "kind": "flyoutToolbox",
                "contents": [
                    {
                        kind: "block",
                        type: "turn_right"
                    },
                    {
                        kind: "block",
                        type: "turn_left"
                    },
                    {
                        kind: "block",
                        type: "move"
                    }
                ]
            }
        ]
    }
];