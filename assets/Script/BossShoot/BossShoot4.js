cc.Class({
    extends: cc.Component,

    properties: {
        // 子弹 
        bullet: {
            type: cc.Prefab,
            default: null
        },
        speed: 300,  // 速度 
        num: 10      // 子弹一排的个数
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.map = cc.find("Canvas/map");
        this.space = (cc.winSize.width - 64 - this.num*this.bullet.data.width)/(this.num - 1);
        this.index = 0;
        this.count = 0;
    },

    // update (dt) {},

    // 开始发射 
    startShoot () {
        this.schedule(this.shoot, 0.2);
    },

    // 停止发射 
    stopShoot () {
        this.unschedule(this.shoot);
    },

    // 发射 
    shoot () {
        var bullet = cc.instantiate(this.bullet);
        bullet.x = 32 + (bullet.width + this.space)/2*(this.count%2) + bullet.width/2 + this.index*(this.space + bullet.width);
        bullet.y = cc.winSize.height + bullet.height/2;
        bullet.parent = this.map;
        bullet.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, -this.speed);
        this.index++;
        if (this.index + this.count%2 >= this.num) {
            this.index = 0;
            this.count++;
        }
    },
});
