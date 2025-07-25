import Phaser from "phaser";
import rexInputText from "phaser3-rex-plugins/plugins/inputtext.js";
import { BUTTON_PALETTE } from "./palette";

type InputType = "normal" | "email" | "password";

interface InputBoxConfig {
    scene: Phaser.Scene;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize?: string;
    placeholder?: string;
    type: InputType;
    maxLength?: number;
    onChange?: () => void;
    customValidation?: {test: (value: string)=> boolean, message: string};
}

class InputBox extends Phaser.GameObjects.Container {
    private inputText: any;
    private underline: Phaser.GameObjects.Rectangle;
    private errorText: Phaser.GameObjects.Text;
    private inputType: InputType;
    private currentValue: string = "";
    private editable: boolean = true;
    private maxLength?: number;
    private onChange?: () => void;
    private customValidation?: {test: (value: string)=> boolean, message: string};
    private lastValidationResult: boolean = false;
    private readonly validColor = BUTTON_PALETTE.BLUE_2;
    private readonly invalidColor = BUTTON_PALETTE.RED_2;

    constructor(config: InputBoxConfig) {
        super(config.scene, config.x, config.y);

        this.inputType = config.type;
        this.maxLength = config.maxLength;

        this.inputText = new rexInputText(config.scene, 0, 0, config.width, config.height, {
            type: this.inputType === "password" ? 'password' : 'text',
            placeholder: config.placeholder ?? '',
            fontSize: config.fontSize ?? '24px',
            border: 0,
            backgroundColor: 'transparent',
            paddingTop: "0px",
            paddingBottom: "0px",
            color: BUTTON_PALETTE.TEXT_DEFAULT_HEX
        }).on('textchange', () => this.handleTextChange()).setOrigin(0, 0);

        this.underline = config.scene.add.rectangle(0, config.height, config.width, 10, this.invalidColor).setOrigin(0, 0);
        this.errorText = config.scene.add.text(0, config.height+5, "", { fontSize: "40px", color: BUTTON_PALETTE.RED_2_HEX, fontFamily: "switch" }).setOrigin(0, 0);

        this.add([this.inputText, this.underline, this.errorText]);
        this.setSize(config.width, config.height + 50);
        this.customValidation = config.customValidation;

        this.validate();
        this.onChange = config.onChange;
    }

    private handleTextChange() {
        if (!this.editable) return;
        this.currentValue = this.inputText.text;
        this.validate();
        if(this.onChange) {
            this.onChange();
        }
    }


    private validate() {
        let isValid = false;
        let errorMessage = "";

        if (this.maxLength !== undefined && this.currentValue.length > this.maxLength) {
            errorMessage = `length must be less than or equal to ${this.maxLength}`;
        } else {
            switch (this.inputType) {
                case "normal":
                    isValid = /^[가-힣a-zA-Z0-9]*$/.test(this.currentValue);
                    if (!isValid) errorMessage = "only Korean, English, and numbers are allowed";
                    break;
                case "email":
                    isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.currentValue);
                    if (!isValid) errorMessage = "Invalid email format";
                    break;
                case "password":
                    isValid = true;
                    break;
            }
        }
        if(this.customValidation) {
            const customValid = this.customValidation.test(this.currentValue);
            if (isValid && !customValid) {
                isValid = false;
                errorMessage = this.customValidation.message;
            }
        }

        this.lastValidationResult = isValid;
        this.underline.setFillStyle(isValid ? this.validColor : this.invalidColor);
        this.errorText.setText(isValid ? "" : errorMessage);
    }

    public getValue(): string {
        return this.currentValue;
    }

    public setValue(value: string) {
        this.currentValue = value;
        this.inputText.setText(this.inputType === "password" ? '*'.repeat(value.length) : value);
        this.validate();
    }

    public isValid(): boolean {
        return this.lastValidationResult;
    }

    public setEditable(isEditable: boolean, reason: string = "") {
        this.editable = isEditable;
        this.inputText.setReadOnly(!isEditable);
        if (isEditable) {
            this.validate();
        }else{
            this.underline.setFillStyle(this.invalidColor);
            this.errorText.setText(reason);
        }
    }

    public blur() {
        this.inputText.node.blur();
    }
    public focus() {
        this.inputText.node.focus();
    }
    public hide() {
        this.inputText.setVisible(false);
        this.underline.setVisible(false);
        this.errorText.setVisible(false);
    }
    public show() {
        this.inputText.setVisible(true);
        this.underline.setVisible(true);
        this.errorText.setVisible(true);
    }
}

export { InputBox };