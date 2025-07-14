import Phaser from 'phaser';
import './style.css'
import TitleScene from "./scenes/title-scene.js";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import WebFont from 'webfontloader'

function init() {
    const config = {
        type: Phaser.AUTO,
        width: 1920,
        height: 1080,
        parent: 'app',
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        scene: TitleScene,
        backgroundColor: '#000000',
        plugins: {
            scene: [
                {
                    key: 'rexUI',
                    plugin: RexUIPlugin,
                    mapping: 'rexUI'
                }
            ]
        }
    };

    const game = new Phaser.Game(config);
}

WebFont.load({
    custom: {
        families: ['switch'],
        urls: ['./style.css']
    },
    active: () => {
        init();
    },
})