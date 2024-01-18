cc.Class({
    extends: cc.Component,

    properties: {
        // 子弹
        bullet: {
            type: cc.Prefab,
            default: null
        },
        speed1: 150,  // 子弹飞进来的速度 
        speed2: 300,  // 子弹飞出去的速度 
        num: 12       // 子弹一圈的个数 
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.map = cc.find("Canvas/map");
        this.bullets = [];
        this.time1 = (cc.winSize.width - 32)/this.speed1;
        this.time2 = (cc.winSize.height - 32)/this.speed2;
        this.da = 360/this.num;
        this.radius = 19;
        this.count = 0;
    },

    // update (dt) {},

    // 开始发射 
    startShoot () {
        this.schedule(this.shoot, 8, cc.macro.REPEAT_FOREVER, 0.01);
    },

    // 停止发射 
    stopShoot () {
        this.unschedule(this.shoot);
    },

    // 发射 
    shoot () {
        this.count++;
        for (let i = 0; i < 3; i++){
            let bullets = [];
            bullets.push(cc.instantiate(this.bullet));
            bullets[0].x = -bullets[0].width;
            bullets[0].y = cc.winSize.height*(i + 1)/4;
            bullets[0].parent =this.map;
            let speedX = this.speed1;
            let speedY = 0;
            bullets[0].speedX = this.speed2;
            bullets[0].speedY = 0;
            if (i%2 == this.count%2){
                speedX = -speedX;
                bullets[0].speedX = -bullets[0].speedX;
                bullets[0].angle = 180;
                bullets[0].x = cc.winSize.width + bullets[0].width;
            }
            bullets[0].getComponent(cc.RigidBody).linearVelocity = cc.v2(speedX, speedY);
            this.bullets.push(bullets[0]);
            this.scheduleOnce(() => {
                bullets[0].getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
                let angle = bullets[0].angle;
                let centreX = bullets[0].x - (((i + this.count)%2)*2 - 1)*this.radius;
                let centreY = bullets[0].y;
                let delay = 0;
                for (let i = 0; i < this.num - 1; i++) {
                    angle += this.da;
                    delay += 0.1;
                    let bullet = cc.instantiate(this.bullet);
                    let cos = Math.cos(angle*Math.PI/180);
                    let sin = Math.sin(angle*Math.PI/180)
                    bullet.x = centreX + this.radius*cos;
                    bullet.y = centreY + this.radius*sin;
                    bullet.speedX = this.speed2*cos;
                    bullet.speedY = this.speed2*sin;
                    bullet.angle = angle;
                    bullets.push(bullet);
                    this.scheduleOnce(() => {
                        bullet.parent = this.map;
                    }, delay);
                }
                this.scheduleOnce(() => {
                    for (let i = 0; i < this.num; i++) {
                        let bullet = bullets[i];
                        bullet.getComponent(cc.RigidBody).linearVelocity = cc.v2(bullet.speedX, bullet.speedY);
                    }
                }, delay);
            }, this.time1);
        }
    },
});
