cc.Class({
    extends: cc.Component,

    properties: {
        // 子弹 
        bullet: {
            type: cc.Prefab,
            default: null
        },
        speed: 100  // 速度 
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.map = cc.find("Canvas/map");
        this.bullets = [];
    },

    // update (dt) {},

    // 开始发射 
    startShoot () {
        this.schedule(this.shoot, 1);
    },

    // 停止发射 
    stopShoot () {
        this.unschedule(this.shoot);
        this.removeBullets();
    },

    // 发射 
    shoot () {
        var bullet = cc.instantiate(this.bullet);
        // 修改 sensor 属性需要在设置 parent 之前才有效 
        bullet.getComponent(cc.PhysicsPolygonCollider).sensor = false;
        bullet.group = "BossBullet2";
        bullet.x = 755;
        bullet.y = 250;
        bullet.parent = this.map;
        var angle = Math.floor(Math.random()*180) + 90;
        var radian = angle*Math.PI/180;
        var speedX = this.speed*Math.cos(radian);
        var speedY = this.speed*Math.sin(radian);
        bullet.getComponent(cc.RigidBody).linearVelocity = cc.v2(speedX, speedY);
        this.bullets.push(bullet);
    },

    // 删除所有子弹 
    removeBullets () {
        for (var i = 0; i < this.bullets.length; i++) {
            let bullet = this.bullets[i];
            bullet.getComponent(cc.PhysicsPolygonCollider).enabled = false;
            bullet.runAction(
                cc.sequence(
                    cc.scaleTo(0.5, 0),
                    cc.removeSelf()
                )
            );
        }
        this.bullets = [];
    }
});
