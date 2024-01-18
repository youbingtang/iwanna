cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.gameover = cc.find("Canvas/GAMEOVER");
        this.windowSize = cc.view.getVisibleSize();
    },

    update (dt) {
        if (this.player) {
            // 玩家超出屏幕的时候，移动摄像机和 GAME OVER 图片。 
            // PS：移动地图会导致物理碰撞出问题，所以移动摄像机。 
            var worldPos = this.player.parent.convertToWorldSpaceAR(cc.v2(this.player.x, this.player.y));
            if (worldPos.y - this.node.y > this.windowSize.height) {
                this.node.y += this.windowSize.height;
                this.gameover.y += this.windowSize.height;
            } else if (worldPos.y + this.player.height - this.node.y< 0) {
                this.node.y -= this.windowSize.height;
                this.gameover.y -= this.windowSize.height;
            } else if (worldPos.x - this.node.x < 0) {
                this.node.x -= this.windowSize.width;
                this.gameover.x -= this.windowSize.width;
            }  else if (worldPos.x - this.player.width/2  - this.node.x > this.windowSize.width) {
                this.node.x += this.windowSize.width;
                this.gameover.x += this.windowSize.width;
            } 
        } else {
            this.player = cc.find("Canvas/map/player");
        }
        
    },
});
