import Phaser from "phaser";
import { BUTTON_PALETTE } from "./palette";

class RoundCheckbox extends Phaser.GameObjects.Container {
    private readonly box: Phaser.GameObjects.Graphics;
    private readonly inner: Phaser.GameObjects.Graphics;
    private isChecked: boolean = false;
    private readonly size: number;
    private readonly onChange: (checked: boolean) => void;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        size: number,
        onChange: (checked: boolean) => void
    ) {
        super(scene, 0, 0);
        this.setPosition(x, y);

        this.size = size;
        this.onChange = onChange;

        this.setSize(size, size);

        this.box = scene.add.graphics().setPosition(0,0);
        this.inner = scene.add.graphics().setPosition(0,0);

        this.box.setInteractive(
            new Phaser.Geom.Rectangle(0, 0, size, size),
            Phaser.Geom.Rectangle.Contains
        );
        this.add([this.box, this.inner]);

        this.redraw();

        this.box.on("pointerover", () => {
            scene.input.setDefaultCursor("pointer");
            scene.tweens.add({ targets: this, scale: 1.05, duration: 100, ease: "Power2" });
        });

        this.box.on("pointerout", () => {
            scene.input.setDefaultCursor("default");
            scene.tweens.add({ targets: this, scale: 1, duration: 100, ease: "Power2" });
        });

        this.box.on("pointerdown", () => {
            this.isChecked = !this.isChecked;
            this.redraw();
            this.onChange(this.isChecked);
        });
    }

    private redraw() {
        const r = 6;
        this.box.clear()
            .lineStyle(4, BUTTON_PALETTE.GRAY_2, 1)
            .fillStyle(0xffffff, 1)
            .fillRoundedRect(0, 0, this.size, this.size, r)
            .strokeRoundedRect(0, 0, this.size, this.size, r);

        const innerSize = this.size * 0.5;
        const offset = (this.size - innerSize) / 2;
        const color = this.isChecked ? BUTTON_PALETTE.BLUE_2 : BUTTON_PALETTE.RED_2;

        this.inner.clear()
            .fillStyle(color, 1)
            .fillRect(offset, offset, innerSize, innerSize);
    }

    get checked() {
        return this.isChecked;
    }

    set checked(value: boolean) {
        if (this.isChecked !== value) {
            this.isChecked = value;
            this.redraw();
            this.onChange(this.isChecked);
        }
    }
}

export { RoundCheckbox };