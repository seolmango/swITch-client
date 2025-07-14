import Phaser from "phaser";
import { RoundButton } from "./objects/RoundButton.js";
import logoTitle from "../assets/title_logo.webp"

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
            "Start Game",
            () => {
                this.scene.start('GameScene'); // Assuming you have a GameScene to start
            }
        )

        const howtoplayButton = new RoundButton(
            this,
            960,
            820,
            720,
            120,
            0,
            "How to Play",
            () => {
                this.scene.start('SettingsScene'); // Assuming you have a SettingsScene to start
            }
        );

        const userButton = new RoundButton(
            this,
            1548,
            990,
            120,
            120,
            2,
            "①",
            () => {
                this.scene.start('UserProfileScene'); // Assuming you have a UserProfileScene to start
            }
        )

        const creditsButton = new RoundButton(
            this,
            1692,
            990,
            120,
            120,
            2,
            "©",
            () => {
                this.scene.start('CreditsScene'); // Assuming you have a CreditsScene to start
            }
        )

        const SettingButton = new RoundButton(
            this,
            1836,
            990,
            120,
            120,
            2,
            "②",
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
                    font: "30px Arial",
                    fill: "#ffffff",
                    align: "left"
                }
            )
        }
    }
}

export default TitleScene;