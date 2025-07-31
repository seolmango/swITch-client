import Phaser from 'phaser'
import { BUTTON_PALETTE } from './objects/palette'
import { RoundBox } from "./objects/RoundBox";
import {RoundButton} from "./objects/RoundButton";
import { InputBox } from "./objects/InputBox";
import { RoundCheckbox } from "./objects/RoundCheckBox";
import { RoomItem } from "./objects/RoomItem";

// 테스트용 더미 데이터
const dummyRooms = [
    {"room_id":"425e4b83","room_name":"asdf","owner_name":"Guest_4293dc","password_exist":false,"player_count":1,"room_status":false,"map_id":0},
    {"room_id":"c4524440","room_name":"adfse","owner_name":"Guest_a6d8fc","password_exist":false,"player_count":1,"room_status":true,"map_id":0},
    {"room_id":"9db541aa","room_name":"adfsedf","owner_name":"Guest_b823a9","password_exist":true,"player_count":1,"room_status":false,"map_id":0}
];
const dummyPage = {
    current: 1,
    max: 3
}

class RoomListScene extends Phaser.Scene {
    private popUp?: Phaser.GameObjects.Container;
    private dimmed?: Phaser.GameObjects.Rectangle;
    private pageText?: Phaser.GameObjects.Text;

    constructor() {
        super({key: 'roomListScene'});
    }

    preload() {

    }

    create() {
        this.add.text(
            960,
            72,
            "Room List",
            {
                font: '80px switch',
                color: BUTTON_PALETTE.TEXT_DEFAULT_HEX,
            }
        ).setOrigin(0.5)

        const roomListBG = new RoundBox(
            this,
            960,
            520,
            1600,
            760,
            2
        )

        const backButton = new RoundButton(
            this,
            180,
            72,
            240,
            96,
            2,
            {
                text: "Back",
                size: 60
            },
            () => {
                this.scene.start('TitleScene');
            }
        )

        const makeNewRoomButton = new RoundButton(
            this,
            320,
            990,
            600,
            120,
            1,
            {
                text: "Make New Room",
                size: 60
            },
            () => {
                this.showMakeRoomPopUp()
            }
        )

        const quickJoinButton = new RoundButton(
            this,
            960,
            990,
            600,
            120,
            1,
            {
                text: "Quick Join",
                size: 60
            },
            () => {

            }
        )

        const joinRoomButton = new RoundButton(
            this,
            1600,
            990,
            600,
            120,
            1,
            {
                text: "Join Room",
                size: 60
            },
            () => {
                this.showJoinRoomPopUp()
            }
        )

        const pageUpButton = new RoundButton(
            this,
            1200,
            830,
            80,
            80,
            2,
            {
                text: ">",
                size: 60
            },
            () => {
                if (dummyPage.current < dummyPage.max) {
                    dummyPage.current++;
                    this.redrawPage();
                }
            }
        )
        const pageDownButton = new RoundButton(
            this,
            720,
            830,
            80,
            80,
            2,
            {
                text: "<",
                size: 60
            },
            () => {
                if (dummyPage.current > 1) {
                    dummyPage.current--;
                    this.redrawPage();
                }
            }
        )
        this.add.existing(roomListBG)
        this.add.existing(backButton);
        this.add.existing(makeNewRoomButton);
        this.add.existing(quickJoinButton);
        this.add.existing(joinRoomButton);
        this.add.existing(pageUpButton);
        this.add.existing(pageDownButton);
        this.redrawPage()

        const x_list = [560, 1360];
        const y_list = [250, 455, 660];
        for( let i = 0; i < dummyRooms.length; i++) {
            const roomInfo = dummyRooms[i];
            const roomItem = new RoomItem(
                this,
                x_list[i % 2],
                y_list[Math.floor(i / 2)],
                roomInfo,
                () => {
                    this.closePopUp();
                    this.showJoinRoomPopUp(roomInfo.room_id, roomInfo.password_exist)
                }
            );
            this.add.existing(roomItem);
        }
    }

    private redrawPage() {
        if (this.pageText) {
            this.pageText.destroy();
        }
        this.pageText = this.add.text(
            960,
            830,
            `Page ${dummyPage.current} / ${dummyPage.max}`,
            {
                font: '60px switch',
                color: BUTTON_PALETTE.TEXT_DEFAULT_HEX,
            }
        ).setOrigin(0.5);
    }

    private showMakeRoomPopUp() {
        if (this.popUp) {this.closePopUp()}
        this.dimmed = this.add.rectangle(
            960,
            540,
            1920,
            1080,
            0x000000,
            0.3
        ).setDepth(100).setInteractive()
        this.popUp = this.add.container(160, 90).setDepth(120);
        const box = new RoundBox(
            this,
            800,
            450,
            1600,
            900,
            2
        )
        const makeRoomButton = new RoundButton(
            this,
            500,
            800,
            450,
            100,
            1,
            {
                text: "Make Room",
                size: 60
            },
            () => {

            }
        )
        const cancelButton = new RoundButton(
            this,
            1100,
            800,
            450,
            100,
            0,
            {
                text: "Cancel",
                size: 60
            },
            () => {
                this.closePopUp();
            }
        )
        const titleText = this.add.text(
            800,
            80,
            "Make New Room",
            {
                font: '80px switch',
                align: 'center',
                color: BUTTON_PALETTE.TEXT_DEFAULT_HEX,
            }
        ).setOrigin(0.5);
        const roomNameLabel = this.add.text(
            100,
            200,
            "Room Name:",
            {
                font: '60px switch',
                align: 'left',
                color: BUTTON_PALETTE.TEXT_DEFAULT_HEX,
            }
        )
        const roomNameInput = new InputBox({
            scene: this,
            x: 500,
            y: 200,
            width: 1000,
            height: 80,
            fontSize: "60px",
            placeholder: "Room Name",
            type: "normal",
            maxLength: 20
        })
        const publicLabel = this.add.text(
            100,
            375,
            "Public:",
            {
                font: '60px switch',
                align: 'left',
                color: BUTTON_PALETTE.TEXT_DEFAULT_HEX,
            }
        )
        const publicCheckbox = new RoundCheckbox(
            this,
            450,
            375,
            80,
            () => {}
        )
        publicCheckbox.checked = true
        const lockLabel = this.add.text(
            850,
            375,
            "Lock:",
            {
                font: '60px switch',
                align: 'left',
                color: BUTTON_PALETTE.TEXT_DEFAULT_HEX,
            }
        )
        const lockCheckbox = new RoundCheckbox(
            this,
            1150,
            375,
            80,
            () => {
                passwordInput.setEditable(lockCheckbox.checked, "Check the Lock option to enable");
            }
        )
        lockCheckbox.checked = false;
        const passwordLabel = this.add.text(
            100,
            550,
            "Password:",
            {
                font: '60px switch',
                align: 'left',
                color: BUTTON_PALETTE.TEXT_DEFAULT_HEX,
            }
        )
        const passwordInput = new InputBox({
            scene: this,
            x: 450,
            y: 550,
            width: 1050,
            height: 80,
            fontSize: "60px",
            placeholder: "Password (optional)",
            type: "password",
            maxLength: 20
        })
        passwordInput.setEditable(false, "Check the Lock option to enable");
        this.popUp.add([box, makeRoomButton, cancelButton, titleText,
                        roomNameLabel, publicLabel, lockLabel, passwordLabel,
                        roomNameInput, passwordInput, publicCheckbox, lockCheckbox]);
        this.dimmed.on('pointerdown', () => {
            roomNameInput.blur();
            passwordInput.blur();
        });
        box.on("pointerdown", () => {
            roomNameInput.blur();
            passwordInput.blur();
        })
    }

    private showJoinRoomPopUp (room_id: string = "", locked: boolean = false) {
        if (this.popUp){this.closePopUp()}
        this.dimmed = this.add.rectangle(
            960,
            540,
            1920,
            1080,
            0x000000,
            0.3
        ).setDepth(100).setInteractive();
        this.popUp = this.add.container(160, 90).setDepth(120);
        const box = new RoundBox(
            this,
            800,
            450,
            1600,
            900,
            2
        )
        const joinButton = new RoundButton(
            this,
            500,
            800,
            450,
            100,
            1,
            {
                text: "Join Room",
                size: 60
            },
            () => {
                this.scene.start("WaitingRoomScene")
            }
        )
        const cancelButton = new RoundButton(
            this,
            1100,
            800,
            450,
            100,
            0,
            {
                text: "Cancel",
                size: 60
            },
            () => {
                this.closePopUp();
            }
        )
        const titleText = this.add.text(
            800,
            80,
            "Join Room",
            {
                font: '80px switch',
                align: 'center',
                color: BUTTON_PALETTE.TEXT_DEFAULT_HEX,
            }
        ).setOrigin(0.5);

        const roomIDLabel = this.add.text(
            100,
            300,
            "Room ID:",
            {
                font: '60px switch',
                align: 'left',
                color: BUTTON_PALETTE.TEXT_DEFAULT_HEX,
            }
        )
        const roomIDInput = new InputBox({
            scene: this,
            x: 500,
            y: 300,
            width: 1000,
            height: 80,
            fontSize: "70px",
            placeholder: "Room ID",
            type: "normal",
            maxLength: 20,
        })
        roomIDInput.setValue(room_id);
        const passwordLabel = this.add.text(
            100,
            500,
            "Password:",
            {
                font: '60px switch',
                align: 'left',
                color: BUTTON_PALETTE.TEXT_DEFAULT_HEX,
            }
        )
        const passwordInput = new InputBox({
            scene: this,
            x: 500,
            y: 500,
            width: 1050,
            height: 80,
            fontSize: "60px",
            placeholder: "Password (optional)",
            type: "password",
            maxLength: 20
        })
        passwordInput.setEditable(locked, "Password is not required");

        this.popUp.add([box, joinButton, cancelButton, titleText,
                        roomIDLabel, passwordLabel, roomIDInput, passwordInput]);
    }

    private closePopUp() {
        if (this.popUp) {
            this.popUp.destroy();
            this.popUp = undefined;
        }
        if (this.dimmed) {
            this.dimmed.destroy();
            this.dimmed = undefined;
        }
    }
}

export default RoomListScene;