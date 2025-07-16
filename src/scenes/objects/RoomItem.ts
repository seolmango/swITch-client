import Phaser from "phaser";
import { BUTTON_PALETTE } from "./palette";

interface roomInfo {
    room_id: string;
    room_name: string;
    owner_name: string;
    password_exist: boolean;
    player_count: number;
    room_status: boolean;
    map_id: number;
}

class RoomItem extends Phaser.GameObjects.Container {
    private readonly bg: Phaser.GameObjects.Graphics;
    private readonly stroke: Phaser.GameObjects.Graphics;
    private readonly roomNameText: Phaser.GameObjects.Text;
    private readonly roomIdText: Phaser.GameObjects.Text;
    private readonly roomOwnerText: Phaser.GameObjects.Text;
    private readonly roomInfoText: Phaser.GameObjects.Text;

    private currentBgColor: number;
    private currentStrokeColor: number;
    private currentTextColor: number;

    private readonly Info: roomInfo;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        info: roomInfo,
        onclick: () => void
    ) {
        super(scene, x, y);
        this.Info = info;
        this.setSize(750, 185);
        this.setInteractive(
            new Phaser.Geom.Rectangle(0, 0, 750, 185),
            Phaser.Geom.Rectangle.Contains,
        )
        this.currentBgColor = BUTTON_PALETTE.GRAY_1;
        this.currentStrokeColor = BUTTON_PALETTE.GRAY_2;
        this.currentTextColor = BUTTON_PALETTE.TEXT_DEFAULT;

        this.bg = scene.add.graphics().setPosition(-375, -92.5);
        this.stroke = scene.add.graphics().setPosition(-375, -92.5);

        this.roomNameText = scene.add.text(-360, -80, info.room_name, {
            font: "70px switch",
            color: this.colorNumToHex(this.currentTextColor),
        })
        this.roomIdText = scene.add.text(80, -70, `#${info.room_id}`, {
            font: "50px switch",
            color: BUTTON_PALETTE.TEXT_ON_MOUSE_HEX,
        })
        this.roomOwnerText = scene.add.text(-360, 20, info.owner_name, {
            font: "40px switch",
            color: BUTTON_PALETTE.TEXT_DEFAULT_HEX
            }
        )
        this.roomInfoText = scene.add.text(80, 20, `① ${info.player_count} ${info.password_exist ? "⑥" : "⑤"} ${info.room_status ? "playing" : "waiting"}`, {
            font: "40px switch",
            color: this.colorNumToHex(this.currentTextColor),
        });

        this.add([this.bg, this.stroke, this.roomNameText, this.roomIdText, this.roomInfoText, this.roomOwnerText]);

        this.redraw(this.currentBgColor, this.currentStrokeColor);

        this.on("pointerover", () => {
            scene.input.setDefaultCursor('pointer');
            scene.tweens.add({targets: this, scale: 1.05, duration: 100, ease: 'Power2'});
            this.tweenColors(this.currentBgColor, BUTTON_PALETTE.GRAY_2, this.currentStrokeColor, BUTTON_PALETTE.GRAY_3, this.currentTextColor, BUTTON_PALETTE.TEXT_ON_MOUSE);
            this.currentBgColor = BUTTON_PALETTE.GRAY_2;
            this.currentStrokeColor = BUTTON_PALETTE.GRAY_3;
        });

        this.on("pointerout", () => {
            scene.input.setDefaultCursor('default');
            scene.tweens.add({targets: this, scale: 1, duration: 100, ease: 'Power2'});
            this.tweenColors(this.currentBgColor, BUTTON_PALETTE.GRAY_1, this.currentStrokeColor, BUTTON_PALETTE.GRAY_2, this.currentTextColor, BUTTON_PALETTE.TEXT_DEFAULT);
            this.currentBgColor = BUTTON_PALETTE.GRAY_1;
            this.currentStrokeColor = BUTTON_PALETTE.GRAY_2;
        })

        this.on("pointerdown", () => {
            scene.input.setDefaultCursor("default");
            onclick();
        })
    }

    private redraw(bgColor: number, strokeColor: number) {
        const r = 25, s = 10;
        this.bg.clear().fillStyle(bgColor, 1).fillRoundedRect(0, 0, 750, 185, r);
        this.stroke.clear().lineStyle(s, strokeColor, 1).strokeRoundedRect(0, 0, 750, 185, r);
    }

    private tweenColors(bgFrom: number, bgTo: number, strokeFrom: number, strokeTo: number, textFrom: number, textTo: number) {
        const cBgF = Phaser.Display.Color.IntegerToColor(bgFrom), cBgT = Phaser.Display.Color.IntegerToColor(bgTo);
        const cStrokeF = Phaser.Display.Color.IntegerToColor(strokeFrom), cStrokeT = Phaser.Display.Color.IntegerToColor(strokeTo);
        const cTextF = Phaser.Display.Color.IntegerToColor(textFrom), cTextT = Phaser.Display.Color.IntegerToColor(textTo);
        this.scene.tweens.addCounter({
            from: 0, to: 1, duration: 150, ease: "Linear",
            onUpdate: tween => {
                const t = tween.getValue() ?? 0;
                const bg = this.lerpColor(cBgF, cBgT, t);
                const stroke = this.lerpColor(cStrokeF, cStrokeT, t);
                const text = this.lerpColor(cTextF, cTextT, t);
                this.redraw(bg, stroke);
                this.roomNameText.setColor(this.colorNumToHex(text));
                this.currentTextColor = text;
            }
        })
    }

    private lerpColor(cFrom: Phaser.Display.Color, cTo: Phaser.Display.Color, t: number): number {
        const r = Phaser.Math.Interpolation.Linear([cFrom.red, cTo.red], t);
        const g = Phaser.Math.Interpolation.Linear([cFrom.green, cTo.green], t);
        const b = Phaser.Math.Interpolation.Linear([cFrom.blue, cTo.blue], t);
        return Phaser.Display.Color.GetColor(r, g, b);
    }

    private colorNumToHex(c: number): string {
        return Phaser.Display.Color.RGBToString((c >> 16) & 0xFF, (c >> 8) & 0xFF, c & 0xFF, 0, "#");
    }
}

export { RoomItem }