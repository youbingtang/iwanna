var Global = require("Global");

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (!Global.init) {
            Global.init = true;
            // 不显示 FPS
            cc.debug.setDisplayStats(false);
            var manager = cc.director.getPhysicsManager();
            // 开启物理引擎
            // 2.2.1 版本之前不能在 start 里开启物理引擎。 
            manager.enabled = true;
            // 绘制碰撞区域轮廓 
            // manager.debugDrawFlags = cc.PhysicsManager.DrawBits.e_shapeBit;
            // 设置重力
            // GM8 的 I wanna 引擎的重力为 0.4 像素/帧^2，换算下就是 1000 像素/秒^2 
            manager.gravity = cc.v2(0, -0.4*Global.GMFrames*Global.GMFrames);
            
            // 按 F2 重启游戏的常驻节点 
            var node = new cc.Node();
            node.addComponent("Restart");
            cc.game.addPersistRootNode(node);
        }

    },

    // update (dt) {},
});
