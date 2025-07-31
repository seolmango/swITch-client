import Phaser from "phaser";
import { RoundButton } from "./objects/RoundButton";
import { RoundBox } from "./objects/RoundBox";
import logoTitle from "../assets/title_logo.webp"
import { BUTTON_PALETTE } from "./objects/palette";
import { UnderLineText } from "./objects/UnderLineText";
import { InputBox } from "./objects/InputBox";

class TitleScene extends Phaser.Scene {
    private Popup?: Phaser.GameObjects.Container;
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
        if (this.Popup) return;
        this.dimmed = this.add.rectangle(
            960,
            540,
            1920,
            1080,
            0x000000,
            0.3
        ).setDepth(100).setInteractive()
        this.Popup = this.add.container(160, 90).setDepth(120);
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
                this.closePopup()
            }
        )
        this.Popup.add([box, loginButton, closeButton]);
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
            },
            () => {
                this.showCreateAccountPopup();
            }
        )
        this.Popup.add([titleText, loginText, createText]);

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
            },
            () => {
                this.showResetPasswordPopup();
            }
        )
        this.Popup.add([emailLabel, emailInput, passwordLabel, passwordInput, forgetPasswordText])
        this.dimmed.on('pointerdown', () => {
            emailInput.blur();
            passwordInput.blur();
        })
        box.on("pointerdown", () => {
            emailInput.blur();
            passwordInput.blur();
        })
    }

    private closePopup() {
        if (this.Popup) {
            this.Popup.destroy();
            this.Popup = undefined;
        }
        if (this.dimmed) {
            this.dimmed.destroy();
            this.dimmed = undefined;
        }
    }

    private showCreateAccountPopup() {
        if(this.Popup){
            this.closePopup();
        }
        this.dimmed = this.add.rectangle(
            960,
            540,
            1920,
            1080,
            0x000000,
            0.3
        ).setDepth(100).setInteractive();
        this.Popup = this.add.container(160, 90).setDepth(120);
        const box = new RoundBox(
            this,
            800,
            450,
            1600,
            900,
            2
        );
        const createButton = new RoundButton(
            this,
            500,
            800,
            450,
            100,
            1,
            {
                text: "Create!",
                size: 60
            },
            () => {
                // Handle account creation logic here
            }
        );
        createButton.setEnabled(false)
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
                this.closePopup();
                this.showLoginPopup();
            }
        );
        const titleText = this.add.text(
            800,
            80,
            "Create a Account",
            {
                font: "80px switch",
                align: "center",
                color: BUTTON_PALETTE.TEXT_DEFAULT_HEX
            }
        ).setOrigin(0.5);
        const emailLabel = this.add.text(
            100,
            180,
            "Email:",
            {
                font: "60px switch",
                align: "left",
                color: BUTTON_PALETTE.TEXT_DEFAULT_HEX
            }
        );
        const emailInput = new InputBox({
            scene: this,
            x: 300,
            y: 180,
            width: 800,
            height: 60,
            fontSize: "60px",
            placeholder: "Enter your email",
            type: "email",
            maxLength: 50,
            onChange: () => {
                sendVerificationButton.setEnabled(emailInput.isValid())
            }
        });
        const sendVerificationButton = new RoundButton(
            this,
            1330,
            210,
            400,
            80,
            2,
            {
                text: "Verify",
                size: 60,
            },
            () => {
                sendVerificationButton.setEnabled(false);
                emailInput.blur();
                emailInput.setEditable(false);
                codeInput.focus();
                codeInput.setEditable(true);
                NicknameInput.setEditable(true);
                PasswordInput.setEditable(true);
                PasswordInput2.setEditable(true);
            }
        )
        const codeInput = new InputBox({
            scene: this,
            x: 300,
            y: 300,
            width: 500,
            height: 60,
            fontSize: "60px",
            placeholder: "Enter code",
            type: "normal",
            maxLength: 6
        })
        codeInput.setEditable(false, "first click verify button");
        sendVerificationButton.setEnabled(false)
        const NicknameLabel = this.add.text(
            100,
            400,
            "Nickname:",
            {
                font: "60px switch",
                align: "left",
                color: BUTTON_PALETTE.TEXT_DEFAULT_HEX
            }
        );
        const NicknameInput = new InputBox({
            scene: this,
            x: 500,
            y: 400,
            width: 800,
            height: 60,
            fontSize: "60px",
            placeholder: "Enter your nickname",
            type: "normal",
            maxLength: 20
        });
        NicknameInput.setEditable(false, "first click verify button");
        const PasswordLabel = this.add.text(
            100,
            500,
            "Password:",
            {
                font: "60px switch",
                align: "left",
                color: BUTTON_PALETTE.TEXT_DEFAULT_HEX
            }
        )
        const PasswordInput = new InputBox({
            scene: this,
            x: 500,
            y: 500,
            width: 800,
            height: 60,
            fontSize: "60px",
            placeholder: "Enter your password",
            type: "password",
            maxLength: 50
        });
        const PasswordInput2 = new InputBox({
            scene: this,
            x: 500,
            y: 600,
            width: 800,
            height: 60,
            fontSize: "60px",
            placeholder: "Re-enter your password",
            type: "password",
            maxLength: 50,
            customValidation: {
                test: (v: string) => {
                    return v === PasswordInput.getValue();
                },
                message: "Passwords do not match"
            }
        })
        PasswordInput.setEditable(false, "first click verify button");
        PasswordInput2.setEditable(false, "first click verify button");
        this.Popup.add([box, createButton, closeButton, titleText,
                        emailInput, emailLabel, sendVerificationButton,
                        codeInput, NicknameInput, NicknameLabel,
                        PasswordLabel, PasswordInput, PasswordInput2]);
        this.dimmed.on('pointerdown', () => {
            emailInput.blur();
            codeInput.blur();
            NicknameInput.blur();
            PasswordInput.blur();
            PasswordInput2.blur();
        });
        box.on("pointerdown", () => {
            emailInput.blur();
            codeInput.blur();
            NicknameInput.blur();
            PasswordInput.blur();
            PasswordInput2.blur();
        });
    }

    private showResetPasswordPopup() {
        if(this.Popup){
            this.closePopup();
        }
        this.dimmed = this.add.rectangle(
            960,
            540,
            1920,
            1080,
            0x000000,
            0.3
        ).setDepth(100).setInteractive();
        this.Popup = this.add.container(160, 90).setDepth(120);
        const box = new RoundBox(
            this,
            800,
            450,
            1600,
            900,
            2
        );
        const resetButton = new RoundButton(
            this,
            500,
            800,
            500,
            100,
            1,
            {
                text: "Reset Password",
                size: 60
            },
            () => {
                // Handle password reset logic here
            }
        );
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
                this.closePopup();
                this.showLoginPopup();
            }
        );
        const titleText = this.add.text(
            800,
            80,
            "Reset Password",
            {
                font: "80px switch",
                align: "center",
                color: BUTTON_PALETTE.TEXT_DEFAULT_HEX
            }
        ).setOrigin(0.5);
        const emailLabel = this.add.text(
            100,
            180,
            "Email:",
            {
                font: "60px switch",
                align: "left",
                color: BUTTON_PALETTE.TEXT_DEFAULT_HEX
            }
        );
        const emailInput = new InputBox({
            scene: this,
            x: 300,
            y: 180,
            width: 800,
            height: 60,
            fontSize: "60px",
            placeholder: "Enter your email",
            type: "email",
            maxLength: 50,
            onChange: () => {
                sendVerificationButton.setEnabled(emailInput.isValid())
            }
        });
        const codeInput = new InputBox({
            scene: this,
            x: 300,
            y: 300,
            width: 500,
            height: 60,
            fontSize: "60px",
            placeholder: "Enter code",
            type: "normal",
            maxLength: 6
        });
        codeInput.setEditable(false, "first click verify button");
        const sendVerificationButton = new RoundButton(
            this,
            1330,
            210,
            400,
            80,
            2,
            {
                text: "Verify",
                size: 60,
            },
            () => {
                sendVerificationButton.setEnabled(false);
                emailInput.blur();
                codeInput.focus();
                codeInput.setEditable(true);
                newPasswordInput.setEditable(true);
                confirmPasswordInput.setEditable(true);
            }
        );
        sendVerificationButton.setEnabled(false);
        const newPasswordLabel = this.add.text(
            100,
            450,
            "New Password:",
            {
                font: "60px switch",
                align: "left",
                color: BUTTON_PALETTE.TEXT_DEFAULT_HEX
            }
        );
        const newPasswordInput = new InputBox({
            scene: this,
            x: 600,
            y: 450,
            width: 800,
            height: 60,
            fontSize: "60px",
            placeholder: "Enter your new password",
            type: "password",
            maxLength: 50
        });
        const confirmPasswordInput = new InputBox({
            scene: this,
            x: 600,
            y: 550,
            width: 800,
            height: 60,
            fontSize: "60px",
            placeholder: "Re-enter your new password",
            type: "password",
            maxLength: 50,
            customValidation: {
                test: (v: string) => {
                    return v === newPasswordInput.getValue();
                },
                message: "Passwords do not match"
            }
        });
        newPasswordInput.setEditable(false, "first click verify button");
        confirmPasswordInput.setEditable(false, "first click verify button");
        this.Popup.add([box, resetButton, closeButton, titleText,
                        emailInput, emailLabel, sendVerificationButton,
                        codeInput, newPasswordInput, newPasswordLabel,
                        confirmPasswordInput]);
        this.dimmed.on('pointerdown', () => {
            emailInput.blur();
            codeInput.blur();
            newPasswordInput.blur();
            confirmPasswordInput.blur();
        });
        box.on("pointerdown", () => {
            emailInput.blur();
            codeInput.blur();
            newPasswordInput.blur();
            confirmPasswordInput.blur();
        });
    }
}

export default TitleScene;