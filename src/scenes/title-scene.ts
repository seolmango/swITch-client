import Phaser from "phaser";
import { RoundButton } from "./objects/RoundButton";
import logoTitle from "../assets/title_logo.webp"
import { BUTTON_PALETTE } from "./objects/palette";

class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    preload() {
        this.load.image("logo", logoTitle);

    }

    create() {
        const logo = this.add.image(960, 255, "logo").setOrigin(0.5);
        logo.setScale(0.5);

        const startButton = new RoundButton(
            this,
            960,
            600,
            720,
            120,
            1,
            {
                text: "Start Game",
                size: 80
            },
            () => {
                this.scene.start('roomListScene');
            }
        )

        const howtoplayButton = new RoundButton(
            this,
            960,
            820,
            720,
            120,
            0,
            {
                text: "How to Play",
                size: 80
            },
            () => {
                this.scene.start('SettingsScene');
            }
        );

        const userButton = new RoundButton(
            this,
            1692,
            990,
            120,
            120,
            2,
            {
                text: "①",
                size: 80
            },
            () => {
                this.scene.start('UserProfileScene'); // Assuming you have a UserProfileScene to start
            }
        )

        const SettingButton = new RoundButton(
            this,
            1836,
            990,
            120,
            120,
            2,
            {
                text: "②",
                size: 80
            },
            () => {
                this.scene.start('SettingsScene'); // Assuming you have a SettingsScene to start
            }

        )

        if(__IS_DEVELOPMENT__) {
            const versionText = this.add.text(
                10,
                1040,
                `Build: ${__BUILD_VERSION__} on ${__BUILD_ENV__}`,
                {
                    font: "30px switch",
                    align: "left",
                    color: BUTTON_PALETTE.TEXT_DEFAULT_HEX
                }
            )
        }
    }
}

export default TitleScene;