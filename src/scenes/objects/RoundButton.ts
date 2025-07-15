import Phaser from "phaser";
import { BUTTON_PALETTE } from "./palette";

interface ButtonText {
    readonly text: string;
    readonly size: number;
}

type ButtonType = 0 | 1 | 2;

class RoundButton extends Phaser.GameObjects.Container {
    private readonly bg: Phaser.GameObjects.Graphics;
    private readonly stroke: Phaser.GameObjects.Graphics;
    private readonly label: Phaser.GameObjects.Text;

    private currentBgColor: number;
    private currentStrokeColor: number;
    private currentTextColor: number;

    private readonly btnWidth: number;
    private readonly btnHeight: number;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        btnWidth: number,
        btnHeight: number,
        type: ButtonType,
        text: ButtonText,
        onClick: () => void
    ) {
        super(scene, x, y);

        this.btnWidth = btnWidth;
        this.btnHeight = btnHeight;

        this.setSize(btnWidth, btnHeight);
        this.setInteractive(
            new Phaser.Geom.Rectangle(0, 0, btnWidth, btnHeight),
            Phaser.Geom.Rectangle.Contains,
        );

        const palettes = {
            0: [BUTTON_PALETTE.RED_1, BUTTON_PALETTE.RED_2, BUTTON_PALETTE.RED_3],
            1: [BUTTON_PALETTE.BLUE_1, BUTTON_PALETTE.BLUE_2, BUTTON_PALETTE.BLUE_3],
            2: [BUTTON_PALETTE.GRAY_1, BUTTON_PALETTE.GRAY_2, BUTTON_PALETTE.GRAY_3],
        };

        const [bgColor, strokeColor, hoverStrokeColor] = palettes[type];

        this.currentBgColor = bgColor;
        this.currentStrokeColor = strokeColor;
        this.currentTextColor = BUTTON_PALETTE.TEXT_DEFAULT;

        this.bg = scene.add.graphics().setPosition(-btnWidth / 2, -btnHeight / 2);
        this.stroke = scene.add.graphics().setPosition(-btnWidth / 2, -btnHeight / 2);

        this.label = scene.add.text(0, 0, text.text, {
            font: `${text.size}px switch`,
            color: this.colorNumToHex(this.currentTextColor),
        }).setOrigin(0.5);

        this.add([this.bg, this.stroke, this.label]);

        this.redraw(this.currentBgColor, this.currentStrokeColor);

        this.on("pointerover", () => {
            scene.input.setDefaultCursor('pointer');
            scene.tweens.add({ targets: this, scale: 1.05, duration: 100, ease: "Power2" });
            this.tweenColors(this.currentBgColor, strokeColor, this.currentStrokeColor, hoverStrokeColor, this.currentTextColor, BUTTON_PALETTE.TEXT_ON_MOUSE);
            this.currentBgColor = strokeColor;
            this.currentStrokeColor = hoverStrokeColor;
        });

        this.on("pointerout", () => {
            scene.input.setDefaultCursor('default');
            scene.tweens.add({ targets: this, scale: 1, duration: 100, ease: "Power2" });
            this.tweenColors(this.currentBgColor, bgColor, this.currentStrokeColor, strokeColor, this.currentTextColor, BUTTON_PALETTE.TEXT_DEFAULT);
            this.currentBgColor = bgColor;
            this.currentStrokeColor = strokeColor;
        });

        this.on("pointerdown", () => {
            scene.input.setDefaultCursor('default');
            onClick();
        });
    }

    private redraw(bgColor: number, strokeColor: number) {
        const r = 25, s = 10;
        this.bg.clear().fillStyle(bgColor, 1).fillRoundedRect(0, 0, this.btnWidth, this.btnHeight, r);
        this.stroke.clear().lineStyle(s, strokeColor, 1).strokeRoundedRect(0, 0, this.btnWidth, this.btnHeight, r);
    }

    private tweenColors(bgFrom: number, bgTo: number, strokeFrom: number, strokeTo: number, textFrom: number, textTo: number) {
        const cBgF = Phaser.Display.Color.IntegerToColor(bgFrom), cBgT = Phaser.Display.Color.IntegerToColor(bgTo);
        const cStF = Phaser.Display.Color.IntegerToColor(strokeFrom), cStT = Phaser.Display.Color.IntegerToColor(strokeTo);
        const cTxF = Phaser.Display.Color.IntegerToColor(textFrom), cTxT = Phaser.Display.Color.IntegerToColor(textTo);
        this.scene.tweens.addCounter({
            from: 0, to: 1, duration: 150, ease: "Linear",
            onUpdate: tween => {
                const t = tween.getValue() ?? 0;
                const bg = this.lerpColor(cBgF, cBgT, t);
                const stroke = this.lerpColor(cStF, cStT, t);
                const text = this.lerpColor(cTxF, cTxT, t);
                this.redraw(bg, stroke);
                this.label.setColor(this.colorNumToHex(text));
                this.currentTextColor = text;
            }
        });
    }

    private lerpColor(cFrom: Phaser.Display.Color, cTo: Phaser.Display.Color, t: number): number {
        const r = Phaser.Math.Interpolation.Linear([cFrom.red, cTo.red], t);
        const g = Phaser.Math.Interpolation.Linear([cFrom.green, cTo.green], t);
        const b = Phaser.Math.Interpolation.Linear([cFrom.blue, cTo.blue], t);
        return Phaser.Display.Color.GetColor(r, g, b);
    }

    private colorNumToHex(c: number): string {
        return Phaser.Display.Color.RGBToString((c >> 16) & 0xff, (c >> 8) & 0xff, c & 0xff, 0, "#");
    }
}

export { RoundButton };