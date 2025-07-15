import Phaser from "phaser";
import { BUTTON_PALETTE } from "./palette";

class RoundBox extends Phaser.GameObjects.Container {
    private readonly boxBackground: Phaser.GameObjects.Graphics;
    private readonly boxStroke: Phaser.GameObjects.Graphics;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        type: 0 | 1 | 2
    ) {
        super(scene, x, y);
        this.setSize(width, height);

        const CORNER_RADIUS = 25;
        const STROKE_THICKNESS = 10;

        const colors = {
            0: { bg: BUTTON_PALETTE.RED_1, stroke: BUTTON_PALETTE.RED_2 },
            1: { bg: BUTTON_PALETTE.BLUE_1, stroke: BUTTON_PALETTE.BLUE_2 },
            2: { bg: BUTTON_PALETTE.GRAY_1, stroke: BUTTON_PALETTE.GRAY_2 },
        };

        const { bg, stroke } = colors[type]

        this.boxBackground = scene.add.graphics();
        this.boxBackground.fillStyle(bg, 1);
        this.boxBackground.fillRoundedRect(
            -width / 2,
            -height / 2,
            width,
            height,
            CORNER_RADIUS
        );

        this.boxStroke = scene.add.graphics();
        this.boxStroke.lineStyle(STROKE_THICKNESS, stroke, 1);
        this.boxStroke.strokeRoundedRect(
            -width / 2 + STROKE_THICKNESS / 2,
            -height / 2 + STROKE_THICKNESS / 2,
            width - STROKE_THICKNESS,
            height - STROKE_THICKNESS,
            CORNER_RADIUS - STROKE_THICKNESS / 2
        );

        this.add(this.boxBackground);
        this.add(this.boxStroke);
    }
}

export { RoundBox };