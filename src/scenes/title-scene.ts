import Phaser from "phaser";
import { RoundButton } from "./objects/RoundButton";
import { RoundBox } from "./objects/RoundBox";
import logoTitle from "../assets/title_logo.webp"
import { BUTTON_PALETTE } from "./objects/palette";
import { UnderLineText } from "./objects/UnderLineText";
import { InputBox } from "./objects/InputBox";

class TitleScene extends Phaser.Scene {
    private loginPopup?: Phaser.GameObjects.Container;
    private dimmed?: Phaser.GameObjects.Rectangle;

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
                this.showLoginPopup()
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
        const developerButton = new RoundButton(
            this,
            1836,
            90,
            120,
            120,
            2,
            {
                text: "⑦",
                size: 80
            },
            () => {}
        )
        this.add.existing(startButton);
        this.add.existing(howtoplayButton);
        this.add.existing(userButton);
        this.add.existing(SettingButton);
        this.add.existing(developerButton);

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

    private showLoginPopup() {
        if (this.loginPopup) return;
        this.dimmed = this.add.rectangle(
            960,
            540,
            1920,
            1080,
            0x000000,
            0.3
        ).setDepth(100).setInteractive()
        this.loginPopup = this.add.container(160, 90).setDepth(120);
        const box = new RoundBox(
            this,
            800,
            450,
            1600,
            900,
            2
        )
        const loginButton = new RoundButton(
            this,
            500,
            800,
            450,
            100,
            1,
            {
                text: "Login",
                size: 60
            },
            () => {

            }
        )
        const closeButton = new RoundButton(
            this,
            1100,
            800,
            450,
            100,
            0,
            {
                text: "Close",
                size: 60
            },
            () => {
                this.closeLoginPopup()
            }
        )
        this.loginPopup.add([box, loginButton, closeButton]);
        const titleText = this.add.text(
            800,
            80,
            "Welcome Back!",
            {
                font: "80px switch",
                align: "center",
                color: BUTTON_PALETTE.TEXT_DEFAULT_HEX
            }
        ).setOrigin(0.5);
        const loginText = this.add.text(
            621,
            170,
            "Login to swITch or ",
            {
                font: "40px switch",
                align: "center",
                color: BUTTON_PALETTE.TEXT_DEFAULT_HEX
            }
        ).setOrigin(0.5);
        const createText = new UnderLineText(
            this,
            980,
            170,
            "Create a Account",
            {
                font: "40px switch",
                align: "center",
                color: {
                    default: BUTTON_PALETTE.BLUE_2,
                    hex: BUTTON_PALETTE.BLUE_2_HEX
                }
            },
            {
                default: BUTTON_PALETTE.TEXT_ON_MOUSE,
                hex: BUTTON_PALETTE.TEXT_ON_MOUSE_HEX
            }
        )
        this.loginPopup.add([titleText, loginText, createText]);

        const emailLabel = this.add.text(
            100,
            300,
            "Email:",
            {
                font: "60px switch",
                align: "left",
                color: BUTTON_PALETTE.TEXT_DEFAULT_HEX
            }
        );
        const emailInput = new InputBox({
            scene: this,
            x: 450,
            y: 300,
            width: 1050,
            height: 80,
            fontSize: "70px",
            placeholder: "Enter your email",
            type: "email",
            maxLength: 50
        })

        const passwordLabel = this.add.text(
            100,
            500,
            "Password:",
            {
                font: "60px switch",
                align: "left",
                color: BUTTON_PALETTE.TEXT_DEFAULT_HEX
            }
        )

        const passwordInput = new InputBox({
            scene: this,
            x: 450,
            y: 500,
            width: 1050,
            height: 80,
            fontSize: "70px",
            placeholder: "Enter your password",
            type: "password",
            maxLength: 50
        })

        const forgetPasswordText = new UnderLineText(
            this,
            800,
            680,
            "Forget Password?",
            {
                font: "40px switch",
                align: "center",
                color: {
                    default: BUTTON_PALETTE.BLUE_2,
                    hex: BUTTON_PALETTE.BLUE_2_HEX
                }
            },
            {
                default: BUTTON_PALETTE.TEXT_ON_MOUSE,
                hex: BUTTON_PALETTE.TEXT_ON_MOUSE_HEX
            }
        )
        this.loginPopup.add([emailLabel, emailInput, passwordLabel, passwordInput, forgetPasswordText])
        this.dimmed.on('pointerdown', () => {
            emailInput.blur();
            passwordInput.blur();
        })
        box.on("pointerdown", () => {
            emailInput.blur();
            passwordInput.blur();
        })
    }

    private closeLoginPopup() {
        if (this.loginPopup) {
            this.loginPopup.destroy();
            this.loginPopup = undefined;
        }
        if (this.dimmed) {
            this.dimmed.destroy();
            this.dimmed = undefined;
        }
    }
}

export default TitleScene;