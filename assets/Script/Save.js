var Global = require("Global");

cc.Class({
    extends: cc.Component,

    properties: {
 
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    // 设置图块（为了改变图块） 
    setTile (tile) {
        this.tile = tile;
    },

    // 保存 
    save() {
        // 改成变存档点图块，从红色存档点变绿色存档点，维持 1.6 秒 
        this.tile.gid = 16;
        this.scheduleOnce(function () {
            this.tile.gid = 15;
        }, 1.6);
        // 保存游戏数据 
        var mapNode = this.node.parent.parent;
        var player = mapNode.getChildByName("player");
        Global.save.playerX = player.x;
        Global.save.playerY = player.y;
        Global.save.sceneName = cc.director.getScene().name;
        Global.saveGame();
    },

    
});
