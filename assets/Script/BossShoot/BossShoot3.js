cc.Class({
    extends: cc.Component,

    properties: {
        // 子弹 
        bullet: {
            type: cc.Prefab,
            default: null
        },
        speed: 150,  // 速度 
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.map = cc.find("Canvas/map");
    },

    // update (dt) {},

    // 开始发射 
    startShoot () {
        this.schedule(this.shoot, 1);
    },

    // 停止发射 
    stopShoot () {
        this.unschedule(this.shoot);
    },

    // 发射 
    shoot () {
        for (var i = 0; i < 2; i++) {
            var bullet = cc.instantiate(this.bullet);
            if (i%2 == 0) {
                bullet.x = -bullet.width;
                bullet.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.speed, 0);
            } else {
                bullet.x = cc.winSize.width + bullet.width;
                bullet.angle = 180;
                bullet.getComponent(cc.RigidBody).linearVelocity = cc.v2(-this.speed, 0);
            }
            bullet.y = Math.floor(Math.random()*(cc.winSize.height - 64)) + 32;
            bullet.parent = this.map;
        }
    },
});
