import Phaser from "phaser";
import { BUTTON_PALETTE } from "./palette.js";

class RoundBox extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, type) {
        super(scene, x, y);
        this.scene = scene;
        this.width = width;
        this.height = height;
        if(type === 0){
            this.backgroundColor = BUTTON_PALETTE.RED_1;
            this.strokeColor = BUTTON_PALETTE.RED_2;
        }else if (type === 1){
            this.backgroundColor = BUTTON_PALETTE.BLUE_1;
            this.strokeColor = BUTTON_PALETTE.BLUE_2;
        }else{
            this.backgroundColor = BUTTON_PALETTE.GRAY_1;
            this.strokeColor = BUTTON_PALETTE.GRAY_2;
        }
        this.createBox();
        scene.add.existing(this);
    }

    createBox() {
        const CORNER_RADIUS = 25;
        const STROKE_THICKNESS = 10;

        this.setSize(this.width, this.height);

        this.boxBackground = this.scene.add.graphics();
        this.boxBackground.clear()
        this.boxBackground.fillStyle(this.backgroundColor, 1);
        this.boxBackground.fillRoundedRect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height,
            CORNER_RADIUS
        );
        this.add(this.boxBackground);
        this.boxStroke = this.scene.add.graphics();
        this.boxStroke.clear()
        this.boxStroke.lineStyle(STROKE_THICKNESS, this.strokeColor, 1);
        this.boxStroke.strokeRoundedRect(
            -this.width / 2 + STROKE_THICKNESS / 2,
            -this.height / 2 + STROKE_THICKNESS / 2,
            this.width - STROKE_THICKNESS,
            this.height - STROKE_THICKNESS,
            CORNER_RADIUS
        );
        this.add(this.boxStroke);
    }
}

export { RoundBox };