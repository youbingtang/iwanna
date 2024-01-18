cc.Class({
    extends: cc.Component,

    properties: {
        // BOSS 
        boss: {
            type: cc.Node,
            default: null
        }, 
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // 子弹发射的类型和时间 
        this.shoots = [
            {type: 1, start: 5, end: 25}, 
            {type: 2, start: 15, end: 35},
            {type: 3, start: 25, end: 45},
            {type: 4, start: 35, end: 55},
            {type: 5, start: 45, end: 65},
            {type: 6, start: 55, end: 75},
            {type: 7, start: 70, end: 90},
        ];
        // 通关的时间
        this.successTime = 92;
        // 时间
        this.time = 0;
        // 是否通关
        this.success = false;
        this.initBullet();
    },

    update (dt) {
        if (this.player) {
            if (!this.player.getComponent("Player").isDead()) {  
                if (this.time > this.successTime) {
                    // 通关，BOSS 缩小逃进传送门 
                    if (!this.success) {
                        this.success = true;
                        this.boss.zIndex = 1;
                        this.boss.runAction(
                            cc.sequence(
                                cc.scaleTo(0.5, 0.07),
                                cc.moveTo(0.5, cc.v2(320, -272)),
                                cc.callFunc(() => {this.boss.active = false})
                            )
                        );
                    }
                } else {
                    this.time += dt;
                }
            }
        } else {
            // 因为在地图 start 里创建玩家，在该组件 start 之后。
            this.player = cc.find("Canvas/map/player");
        }
    },

    // 初始化子弹 
    initBullet () {
        for (var i = 0; i < this.shoots.length; i++) {
            var shoot = this.shoots[i];
            let component = this.getComponent("BossShoot" + shoot.type);
            // 子弹开始发射 
            this.scheduleOnce(function () {
                if (!this.player.getComponent("Player").isDead()) {
                    component.startShoot();
                }
            }, shoot.start);
            // 子弹停止发射 
            this.scheduleOnce(function () {
                if (!this.player.getComponent("Player").isDead()) {
                    component.stopShoot();
                }
            }, shoot.end);
        }
    },
});
