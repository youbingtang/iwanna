cc.Class({
    extends: cc.Component,

    properties: {
        // 子弹 
        bullet: {
            type: cc.Prefab,
            default: null
        },
        speed: 350 // 速度 
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.map = cc.find("Canvas/map");
    },

    // onLoad () {},

    // 开始发射 
    startShoot () {
        this.player = cc.find("Canvas/map/player");
        this.schedule(this.shoot, 0.2);
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
        var playerPos = this.player.position;
        if (this.player.getComponent("Player").isDead()) {
            playerPos.x = 0;
            playerPos.y = 608;
        }
        var dx = playerPos.x - bullet.x;
        var dy = playerPos.y - bullet.y;
        var dist = Math.sqrt(dx*dx + dy*dy);
        var speedX = dx/dist*this.speed;
        var speedY = dy/dist*this.speed;
        bullet.getComponent(cc.RigidBody).linearVelocity = cc.v2(speedX, speedY);
    }
});
