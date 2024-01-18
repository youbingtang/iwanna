cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    // update (dt) {},

    onKeyDown (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.shift:
                cc.director.loadScene("MenuScene");
                break;
        }
    },
});
