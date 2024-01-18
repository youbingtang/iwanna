cc.Class({
    extends: cc.Component,

    properties: {
        // 子弹 
        bullet: {
            type: cc.Prefab,
            default: null
        },
        speed: 350,  // 速度 
        num: 30      // 子弹一圈的个数 
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.map = cc.find("Canvas/map");
        this.dr = 2*Math.PI/this.num;
        this.index = 0;
    },

    // update (dt) {},

    // 开始发射 
    startShoot () {
        this.schedule(this.shoot, 0.05);
    },

    // 停止发射 
    stopShoot () {
        this.unschedule(this.shoot);
    },

    // 发射 
    shoot () {
        var bullet = cc.instantiate(this.bullet);
        bullet.x = 637;
        bullet.y = 264;
        bullet.parent =this.map;
        var speedX = this.speed*Math.cos(this.index*this.dr);
        var speedY = this.speed*Math.sin(this.index*this.dr);
        bullet.getComponent(cc.RigidBody).linearVelocity = cc.v2(speedX, speedY);
        this.index++;
        if (this.index >= this.num) {
            this.index = 0;
        }
    }
});
