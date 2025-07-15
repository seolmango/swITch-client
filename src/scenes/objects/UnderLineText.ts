import Phaser from 'phaser';

interface fontSettings {
    font: string;
    align: string;
    color: color;
}

interface color {
    default: number;
    hex: string;
}

class UnderLineText extends Phaser.GameObjects.Container {
    private readonly text: Phaser.GameObjects.Text
    private readonly underline: Phaser.GameObjects.Graphics;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        textContent: string,
        settings: fontSettings,
        onMouseColor: color
    ) {
        super(scene, x, y);
        this.text = scene.add.text(
            0,
            0,
            textContent,
            {
                font: settings.font,
                align: settings.align,
                color: settings.color.hex
            }
        ).setOrigin(0.5).setInteractive(
            {useHandCursor: true}
        )
        this.underline = scene.add.graphics()
        this.underline.lineStyle(5, settings.color.default)
        this.underline.beginPath();
        this.underline.moveTo(-this.text.width / 2, this.text.height / 2);
        this.underline.lineTo(this.text.width / 2, this.text.height / 2);
        this.underline.closePath();
        this.underline.strokePath();
        this.text.on('pointerover', () => {
            this.text.setStyle({ color: onMouseColor.hex });
            this.underline.clear();
            this.underline.lineStyle(5, onMouseColor.default);
            this.underline.beginPath();
            this.underline.moveTo(-this.text.width / 2, this.text.height / 2);
            this.underline.lineTo(this.text.width / 2, this.text.height / 2);
            this.underline.closePath();
            this.underline.strokePath();
        }).on('pointerout', () => {
            this.text.setStyle({ color: settings.color.hex });
            this.underline.clear();
            this.underline.lineStyle(5, settings.color.default);
            this.underline.beginPath();
            this.underline.moveTo(-this.text.width / 2, this.text.height / 2);
            this.underline.lineTo(this.text.width / 2, this.text.height / 2);
            this.underline.closePath();
            this.underline.strokePath();
        });
        this.add(this.text);
        this.add(this.underline);
    }
}

export { UnderLineText };