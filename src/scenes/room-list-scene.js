import Phaser from 'phaser'
import { BUTTON_PALETTE } from './objects/palette.js'
import { RoundBox } from "./objects/RoundBox.js";
import {RoundButton} from "./objects/RoundButton.js";

class RoomListScene extends Phaser.Scene {
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
                color: BUTTON_PALETTE.TEXT_DEFAULT,
            }
        ).setOrigin(0.5)

        new RoundBox(
            this,
            960,
            520,
            1600,
            760,
            2
        )

        const BackButton = new RoundButton(
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

        const MakeNewRoomButton = new RoundButton(
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

            }
        )

        const QuickJoinButton = new RoundButton(
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

        const JoinRoomButton = new RoundButton(
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

            }
        )
    }
}

export default RoomListScene;