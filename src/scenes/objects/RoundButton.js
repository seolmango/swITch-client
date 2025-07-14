import Phaser from "phaser";
import { BUTTON_PALETTE } from "./palette.js";

class RoundButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, type, text, onClick) {
        super(scene, x, y);
        this.scene = scene;
        this.width = width;
        this.height = height;
        this.text = text;
        this.onClick = onClick;

        const palette = {
            0: ["RED_1", "RED_2", "RED_3"],
            1: ["BLUE_1", "BLUE_2", "BLUE_3"],
        }[type] || ["GRAY_1", "GRAY_2", "GRAY_3"];

        this.color_1 = BUTTON_PALETTE[palette[0]];
        this.color_2 = BUTTON_PALETTE[palette[1]];
        this.color_3 = BUTTON_PALETTE[palette[2]];

        this.createButton();
        scene.add.existing(this);
    }

    createButton() {
        const CORNER_RADIUS = 25;
        const STROKE_THICKNESS = 10;

        this.setSize(this.width, this.height);
        this.setInteractive();

        this.buttonBackground = this.scene.add.graphics();
        this.drawBackground(this.color_1);
        this.add(this.buttonBackground);

        this.buttonStroke = this.scene.add.graphics();
        this.drawStroke(this.color_2);
        this.add(this.buttonStroke);

        this.buttonText = this.scene.add.text(0, 0, this.text.text, {
            font: `${this.text.size}px switch`,
            color: BUTTON_PALETTE.TEXT_DEFAULT,
        }).setOrigin(0.5);
        this.add(this.buttonText);

        this.on("pointerover", () => {
            this.scene.tweens.add({
                targets: this,
                scale: 1.05,
                duration: 100,
                ease: "Power2",
            });

            this.drawBackground(this.color_2);
            this.drawStroke(this.color_3);
            this.buttonText.setColor(BUTTON_PALETTE.TEXT_ON_MOUSE);
        });

        this.on("pointerout", () => {
            this.scene.tweens.add({
                targets: this,
                scale: 1,
                duration: 100,
                ease: "Power2",
            });

            this.drawBackground(this.color_1);
            this.drawStroke(this.color_2);
            this.buttonText.setColor(BUTTON_PALETTE.TEXT_DEFAULT);
        });

        this.on("pointerdown", this.onClick);
    }

    drawBackground(color) {
        const CORNER_RADIUS = 25;
        this.buttonBackground.clear();
        this.buttonBackground.fillStyle(color, 1);
        this.buttonBackground.fillRoundedRect(-this.width / 2, -this.height / 2, this.width, this.height, CORNER_RADIUS);
    }

    drawStroke(color) {
        const CORNER_RADIUS = 25;
        const STROKE_THICKNESS = 10;
        this.buttonStroke.clear();
        this.buttonStroke.lineStyle(STROKE_THICKNESS, color, 1);
        this.buttonStroke.strokeRoundedRect(-this.width / 2, -this.height / 2, this.width, this.height, CORNER_RADIUS);
    }
}

export { RoundButton };
