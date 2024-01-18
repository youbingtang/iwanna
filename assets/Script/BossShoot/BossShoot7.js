cc.Class({
    extends: cc.Component,

    properties: {
        // 子弹 
        bullet: {
            type: cc.Prefab,
            default: null
        },
        speed1: 200,  // 子弹飞进来的速度 
        speed2: 350,  // 子弹飞出去的个数 
        num: 10       // 子弹一圈的个数 
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.map = cc.find("Canvas/map");
        this.dr = 2*Math.PI/this.num;
        this.count = 0;
        this.value = 1;
    },

    // update (dt) {},

    // 开始发射 
    startShoot () {
        this.bullet1 = cc.instantiate(this.bullet);
        this.bullet1.x = cc.winSize.width/2;
        this.bullet1.y = cc.winSize.height + this.bullet1.height/2;
        this.bullet1.parent =this.map;
        this.bullet1.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, -this.speed1);
        var dist = (cc.winSize.height + this.bullet.data.height)/2;
        var time = dist/this.speed1;
        this.scheduleOnce(function () {
            this.bullet1.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            this.schedule(this.shoot, 0.1);
        }, time);
    },

    // 停止发射 
    stopShoot () {
        this.unschedule(this.shoot);
        this.bullet1.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, this.speed1);
    },

    // 发射 
    shoot () {
        for (var i = 0; i < this.num; i++) {
            var bullet = cc.instantiate(this.bullet);
            bullet.x = this.bullet1.x;
            bullet.y = this.bullet1.y;
            bullet.parent = this.map;
            var radian = i*this.dr - 0.04*this.count;
            var speedX = this.speed2*Math.cos(radian);
            var speedY = this.speed2*Math.sin(radian);
            bullet.getComponent(cc.RigidBody).linearVelocity = cc.v2(speedX, speedY);
        }
        this.count += this.value;
        if (this.count == 40) {
            this.value = -1;
        } else if (this.count == 0) {
            this.value = 1;
        }     
    }
});
