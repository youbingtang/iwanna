var Global = require("Global");

cc.Class({
    extends: cc.Component,

    properties: {
        // 血的精灵帧 
        frames: [cc.SpriteFrame]
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // 根据 GM8 上 I wanna 引擎逻辑，血图片为 3 张之一，重力为 0.1~0.3 像素/帧^2，方向为 0~350 度（间隔10度），初始速度为 0~6 像素/帧 
        this.body = this.getComponent(cc.RigidBody);
        var index = Math.floor(Math.random()*3);
        this.getComponent(cc.Sprite).spriteFrame = this.frames[index];
        var speed = Math.random()*6*Global.GMFrames;
        var direction = Math.floor(Math.random()*36)*10;
        var gravity = 0.1 + Math.random()*0.2;
        this.body.gravityScale = gravity/0.4;
        var speedX = speed*Math.cos(direction*Math.PI/180);
        var speedY = speed*Math.sin(direction*Math.PI/180);
        this.body.linearVelocity = cc.v2(speedX, speedY);
    },

    // update (dt) {},

    onBeginContact: function (contact, selfCollider, otherCollider) {
        // 血与方块碰撞后，速度和重力都为 0，停留在方块上 
        this.body = this.getComponent(cc.RigidBody);
        this.body.linearVelocity = cc.v2(0, 0);
        this.body.gravityScale = 0;
    },
});
