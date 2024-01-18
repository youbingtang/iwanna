cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    update (dt) {
        var x = this.node.x;
        var y = this.node.y;
        // BOSS 弹幕超出屏幕 150 像素后删除 
        if (x < -150 || x > cc.winSize.width + 150 || y < -150 || y > cc.winSize.height + 150) {
            this.node.destroy();
        }
    },
});
