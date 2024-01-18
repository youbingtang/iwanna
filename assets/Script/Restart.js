cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 监听键盘按下事件 
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    // update (dt) {},

    // 键盘按下 
    onKeyDown (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.f2:
                cc.director.loadScene("InitScene");
            break;
        }
    },
});
