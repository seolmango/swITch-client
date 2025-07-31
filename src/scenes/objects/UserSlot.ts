import Phaser from 'phaser';
import { BUTTON_PALETTE, PLAYER_PALETTE } from "./palette";

interface UserData {
    device: number;
    username: string;
    skill: number;
    idx: number;
    level: number;
    xp: number;
    games: number;
    wins: number;
    kills: number;
    switches: number;
}

class UserSlot extends Phaser.GameObjects.Container {
    private readonly bg: Phaser.GameObjects.Graphics;
    private readonly stroke: Phaser.GameObjects.Graphics;
    private readonly number: Phaser.GameObjects.Text;
    private readonly username: Phaser.GameObjects.Text;
    private readonly skill: Phaser.GameObjects.Image;
    private readonly roleText: Phaser.GameObjects.Text;
    private readonly deviceText: Phaser.GameObjects.Text;
    private readonly levelText: Phaser.GameObjects.Text;

    private userdata: null | UserData;
    private client_user_idx: number;
    private owner_idx: number;
    private slot_idx: number;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        owner_idx: number,
        client_user_idx: number,
        slot_idx: number,
        onClick: () => void,
        userdata: null | UserData = null
    ) {
        super(scene, x, y);
        this.userdata = userdata;
        this.client_user_idx = client_user_idx;
        this.owner_idx = owner_idx;
        this.slot_idx = slot_idx;
        this.setSize(350, 350);
        this.setInteractive(
            new Phaser.Geom.Rectangle(0, 0, 350, 350),
            Phaser.Geom.Rectangle.Contains
        )
        this.bg = scene.add.graphics().setPosition(-175, -175);
        this.stroke = scene.add.graphics().setPosition(-175, -175);
        this.number = scene.add.text(-150, -165, `${slot_idx + 1}`);
        this.username = scene.add.text(0, -30, "", {
            font: "40px switch",
            color: BUTTON_PALETTE.TEXT_DEFAULT_HEX,
            align: "center"
        }).setOrigin(0.5, 0.5);
        this.roleText = scene.add.text(0, 140, "", {
            font: "30px switch",
            color: BUTTON_PALETTE.TEXT_DEFAULT_HEX,
            align: "center"
        }).setOrigin(0.5, 0.5);
        this.deviceText = scene.add.text(120, -120, "", {
            font: "60px switch",
            color: BUTTON_PALETTE.TEXT_DEFAULT_HEX,
            align: "center"
        }).setOrigin(0.5, 0.5);
        this.levelText = scene.add.text(140, 35, "", {
            font: "30px switch",
            color: BUTTON_PALETTE.TEXT_DEFAULT_HEX,
            align: "center"
        }).setOrigin(1, 0.5);
        this.skill = scene.add.image(-95, 55, "skill-dash").setOrigin(0.5, 0.5).setScale(0.04);
        this.add([this.bg, this.stroke, this.number, this.username, this.skill, this.roleText, this.deviceText,
                this.levelText]);
        this.redraw()

        this.on("pointerover", () => {
            scene.input.setDefaultCursor("pointer");
            scene.tweens.add({targets: this, scale: 1.05, duration: 100, ease: 'Power2'});
            if(this.userdata){
                this.roleText.setStyle({
                    font: "20px switch",
                })
                const games = this.userdata.games || 1;
                const winRate = (this.userdata.wins / games * 100).toFixed(1);
                const avgKills = (this.userdata.kills / games).toFixed(1);
                const avgSwitches = (this.userdata.switches / games).toFixed(1);
                this.roleText.setText(`(win: ${winRate}%, K&S: ${avgKills}, ${avgSwitches})`);
            }
        })

        this.on("pointerout", () => {
            scene.input.setDefaultCursor("default");
            scene.tweens.add({targets: this, scale: 1, duration: 100, ease: 'Power2'});
            if(this.userdata){
                this.roleText.setStyle({
                    font: "30px switch",
                })
                if (this.userdata.idx === this.client_user_idx && this.userdata.idx === this.owner_idx) {
                    this.roleText.setText("(YOU, OWNER)");
                }else if (this.userdata.idx === this.client_user_idx) {
                    this.roleText.setText("(YOU)");
                }else if( this.userdata.idx === this.owner_idx) {
                    this.roleText.setText("(Owner)");
                }else {
                    this.roleText.setText("");
                }
            }
        })

        this.on("pointerdown", () => {
            scene.input.setDefaultCursor("default");
            onClick();
        })
    }

    private redraw() {
        this.bg.clear();
        this.stroke.clear();

        if (this.userdata) {
            this.bg.fillStyle(PLAYER_PALETTE.INSIDE[this.slot_idx], 1).fillRoundedRect(
                0, 0, 350, 350, 25
            )
            this.stroke.lineStyle(10, PLAYER_PALETTE.OUTSIDE[this.slot_idx], 1).strokeRoundedRect(
                0, 0, 350, 350, 25
            );
            this.number.setStyle(
                { font: "100px switch", fill: BUTTON_PALETTE.TEXT_DEFAULT_HEX, align: "center" }
            )
            this.username.setText(this.userdata.username);
            this.skill.setVisible(true);
            if( this.userdata.skill === 0) {
                this.skill.setTexture("skill-dash");
            } else if( this.userdata.skill === 1) {
                this.skill.setTexture("skill-jump");
            }
            if (this.userdata.idx === this.client_user_idx && this.userdata.idx === this.owner_idx) {
                this.roleText.setText("(YOU, OWNER)");
            }else if (this.userdata.idx === this.client_user_idx) {
                this.roleText.setText("(YOU)");
            }else if( this.userdata.idx === this.owner_idx) {
                this.roleText.setText("(Owner)");
            }else{
                this.roleText.setText("");
            }
            if (this.userdata.device === 1) {
                this.deviceText.setText("④");
            } else if (this.userdata.device === 2) {
                this.deviceText.setText("③");
            } else {
                this.deviceText.setText("");
            }
            const max_xp = 100 + (this.userdata.level * 20);
            this.levelText.setText(`Lv.${this.userdata.level}(${this.userdata.xp/max_xp * 100 | 0}%)`);
        }else {
            this.bg.fillStyle(BUTTON_PALETTE.GRAY_1, 1).fillRoundedRect(
                0, 0, 350, 350, 25
            )
            this.stroke.lineStyle(10, BUTTON_PALETTE.GRAY_2, 1).strokeRoundedRect(
                0, 0, 350, 350, 25
            );
            this.number.setStyle(
                { font: "100px switch", fill: PLAYER_PALETTE.INSIDE_HEX[this.slot_idx], align: "center", strokeThickness: 15, stroke: PLAYER_PALETTE.OUTSIDE_HEX[this.slot_idx] }
            )
            this.username.setText("")
            this.roleText.setText("");
            this.deviceText.setText("");
            this.skill.setVisible(false);
            this.levelText.setText("");
        }
    }
}

export { UserSlot };