import Phaser from 'phaser'
import { UserSlot } from "./objects/UserSlot";
import { RoundButton } from "./objects/RoundButton";
import { BUTTON_PALETTE } from "./objects/palette";
import dash from '../assets/skill_dash.webp';
import jump from '../assets/skill_jump.webp';


interface TempSettings {
    skill: number|undefined;
}


const dummyData = {"room_id":"4b1cf1b0",
                    "room_name":"Guest_092ab5's Room",
                    "room_status":false,
                    "map_id":0,
                    "owner_idx":3,
                    "user_slot":[
                        {"device":1,"username":"Guest_092ab5","skill":0,"idx":0,"level":1,"xp":0,"games":0,"wins":0,"kills":0,"switches":0},
                        {"device":2,"username":"Guest_1eea30","skill":1,"idx":1,"level":1,"xp":0,"games":0,"wins":0,"kills":0,"switches":0},
                        {"device":0,"username":"Guest_555a6b","skill":1,"idx":2,"level":1,"xp":0,"games":0,"wins":0,"kills":0,"switches":0},
                        {"device":1,"username":"Guest_99c84f","skill":0,"idx":3,"level":1,"xp":0,"games":0,"wins":0,"kills":0,"switches":0},
                        null,
                        null,
                        null,
                        null],
                    "playing_slot":[null,null,null,null,null,null,null,null],
                    "idx":3,
                    }

class WaitingRoomScene extends Phaser.Scene {
    private gameStartButton: RoundButton | null = null;
    private mapText: Phaser.GameObjects.Text | null = null;
    private mapChangeButton: RoundButton | null = null;
    private changeSlotButton: RoundButton | null = null;
    private passOwnerButton: RoundButton | null = null;
    private kickUserButton: RoundButton | null = null;
    private skillDash: Phaser.GameObjects.Image | null = null;
    private skillJump: Phaser.GameObjects.Image | null = null;
    private skillConfirmButton: RoundButton | null = null;
    private skillResetButton: RoundButton | null = null;
    private skillText: Phaser.GameObjects.Text | null = null;
    private tempSettings: TempSettings;

    constructor() {
        super({key: 'WaitingRoomScene'});
        this.tempSettings = {
            skill: dummyData.user_slot[dummyData.idx]?.skill
        }
    }

    preload() {
        this.load.image("skill-dash", dash);
        this.load.image("skill-jump", jump);
    }

    create() {
        const bg = this.add.rectangle(960, 540, 1920, 1080, 0x000000, 0);
        bg.setOrigin(0.5, 0.5);
        bg.setInteractive();
        bg.on('pointerdown', () => {
            this.redrawButtonSet(0);
        });
        this.add.existing(bg);
        for(let i=0; i < dummyData.user_slot.length; i++) {
            const backButton = new RoundButton(
                this,
                180,
                72,
                240,
                96,
                2,
                {
                    text: "Back",
                    size: 60.
                },
                () => {
                    this.scene.start("roomListScene");
                }
            )
            const roomName = this.add.text(960, 72, dummyData.room_name, {
                font: "70px switch",
                color: BUTTON_PALETTE.TEXT_DEFAULT_HEX
            }).setOrigin(0.5, 0.5)
            const copyIDButton = new RoundButton(
                this,
                1740,
                72,
                240,
                96,
                2,
                {
                    text: "Copy ID",
                    size: 60
                },
                () => {
                    this.redrawButtonSet(0);
                    navigator.clipboard.writeText(dummyData.room_id).then(() => {
                        console.log("Room ID copied to clipboard");
                    }).catch(err => {
                        console.error("Failed to copy room ID: ", err);
                    });
                }
            )

            const user = dummyData.user_slot[i];
            const userslot = new UserSlot(
                this,
                ((i > 3) ? i - 3 : i+1) * 400 - 40,
                (i > 3) ? 720 : 320,
                dummyData.owner_idx,
                dummyData.idx,
                i,
                () => {
                    this.redrawButtonSet(i+1);
                },
                user
            )
            this.add.existing(copyIDButton);
            this.add.existing(roomName);
            this.add.existing(backButton);
            this.add.existing(userslot);
        }
        this.redrawButtonSet(0);
    }

    private redrawButtonSet(selected: number) {
        if (this.gameStartButton) {
            this.gameStartButton.destroy();
            this.gameStartButton = null;
        }
        if (this.mapText) {
            this.mapText.destroy();
            this.mapText = null;
        }
        if (this.mapChangeButton) {
            this.mapChangeButton.destroy();
            this.mapChangeButton = null;
        }
        if (this.changeSlotButton) {
            this.changeSlotButton.destroy();
            this.changeSlotButton = null;
        }
        if (this.passOwnerButton) {
            this.passOwnerButton.destroy();
            this.passOwnerButton = null;
        }
        if (this.kickUserButton) {
            this.kickUserButton.destroy();
            this.kickUserButton = null;
        }
        if (this.skillDash) {
            this.skillDash.destroy();
            this.skillDash = null;
        }
        if (this.skillJump) {
            this.skillJump.destroy();
            this.skillJump = null;
        }
        if (this.skillConfirmButton) {
            this.skillConfirmButton.destroy();
            this.skillConfirmButton = null;
        }
        if (this.skillResetButton) {
            this.skillResetButton.destroy();
            this.skillResetButton = null;
        }
        if (this.skillText) {
            this.skillText.destroy();
            this.skillText = null;
        }
        if (selected === 0) {
            if (dummyData.idx === dummyData.owner_idx) {
                this.gameStartButton = new RoundButton(
                    this,
                    1440,
                    990,
                    720,
                    120,
                    1,
                    {
                        text: "Start Game",
                        size: 60
                    },
                    () => {

                    }
                )
                this.add.existing(this.gameStartButton);
                this.mapChangeButton = new RoundButton(
                    this,
                    960,
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
                this.add.existing(this.mapChangeButton);
            }
            this.mapText = this.add.text(185, 990, "Map: " + dummyData.map_id, {
                font: "60px switch",
                color: BUTTON_PALETTE.TEXT_DEFAULT_HEX
            }).setOrigin(0, 0.5);
        }
        else {
            if (dummyData.user_slot[selected-1] === null) {
                this.changeSlotButton = new RoundButton(
                    this,
                    1440,
                    990,
                    720,
                    120,
                    1,
                    {
                        text: "Change Slot",
                        size: 60
                    },
                    () => {

                    }
                )
                this.add.existing(this.changeSlotButton);
            }else if(selected -1 === dummyData.idx){
                this.skillText = this.add.text(185, 990, `Skill > ${["Dash", "Jump"][this.tempSettings.skill ?? 0]}`, {
                    font: "60px switch",
                    color: BUTTON_PALETTE.TEXT_DEFAULT_HEX
                }).setOrigin(0, 0.5);
                this.skillDash = this.add.image(1100, 990, "skill-dash").setOrigin(0.5, 0.5).setScale(0.05);
                this.skillJump = this.add.image(1300, 990, "skill-jump").setOrigin(0.5, 0.5).setScale(0.05);
                this.skillDash.on("pointerover", () => {
                    this.input.setDefaultCursor("pointer");
                })
                this.skillJump.on("pointerover", () => {
                    this.input.setDefaultCursor("pointer");
                })
                this.skillDash.on("pointerdown", () => {
                    this.tempSettings.skill = 0;
                    this.skillText?.setText("Skill > Dash");
                    if(0 !== dummyData.user_slot[dummyData.idx]?.skill) {
                        this.skillText?.setColor(BUTTON_PALETTE.BLUE_2_HEX)
                    }else{
                        this.skillText?.setColor(BUTTON_PALETTE.TEXT_DEFAULT_HEX);
                    }
                })
                this.skillJump.on("pointerdown", () => {
                    this.tempSettings.skill = 1;
                    this.skillText?.setText("Skill > Jump");
                    if(1 !== dummyData.user_slot[dummyData.idx]?.skill) {
                        this.skillText?.setColor(BUTTON_PALETTE.BLUE_2_HEX)
                    }else{
                        this.skillText?.setColor(BUTTON_PALETTE.TEXT_DEFAULT_HEX);
                    }
                })
                this.skillDash.on("pointerout", () => {
                    this.input.setDefaultCursor("default");
                })
                this.skillJump.on("pointerout", () => {
                    this.input.setDefaultCursor("default");
                })
                this.skillDash.setInteractive();
                this.skillJump.setInteractive();
                this.add.existing(this.skillDash);
                this.add.existing(this.skillJump);
                this.skillConfirmButton = new RoundButton(
                    this,
                    1550,
                    990,
                    80,
                    80,
                    1,
                    {
                        text: "✔",
                        size: 60
                    },
                    () => {

                    }
                )
                this.add.existing(this.skillConfirmButton);
                this.skillResetButton = new RoundButton(
                    this,
                    1660,
                    990,
                    80,
                    80,
                    0,
                    {
                        text: "✖",
                        size: 60
                    },
                    () => {
                        this.tempSettings.skill = dummyData.user_slot[dummyData.idx]?.skill;
                        this.redrawButtonSet(0);
                    }
                )
                this.add.existing(this.skillResetButton);
            }else if(dummyData.idx === dummyData.owner_idx) {
                this.passOwnerButton = new RoundButton(
                    this,
                    480,
                    990,
                    720,
                    120,
                    1,
                    {
                        text: "Pass Owner",
                        size: 60
                    },
                    () => {

                    }
                )
                this.add.existing(this.passOwnerButton);
                this.kickUserButton = new RoundButton(
                    this,
                    1440,
                    990,
                    720,
                    120,
                    0,
                    {
                        text: "Kick User",
                        size: 60
                    },
                    () => {

                    }
                )
                this.add.existing(this.kickUserButton);
            }else{
                this.redrawButtonSet(0);
            }
        }
    }
}

export default WaitingRoomScene;