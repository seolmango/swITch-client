import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import 'phaser'

declare module 'phaser' {
    interface Scene {
        rexUI: RexUIPlugin
    }
}