const PLAYER_IDLE = 1;       // 待机 
const PLAYER_RUNNING = 2;    // 跑 
const PLAYER_JUMP = 3;       // 跳跃 
const PLAYER_FALL = 4;       // 降落 
const PLAYER_DEATH = 5;      // 死亡 
const PLAYER_TRANSFER = 6;   // 传送 
 
cc.macro.ENABLE_TILEDMAP_CULLING = false;
 
let Global = require("Global");
let Bullet = require("Bullet");
 
cc.Class({
    extends: cc.Component,
 
    properties: {
        jump: 8.5,     // 跳跃的高度 
        jump2: 7,      // 二段跳的高度
        maxSpeed: 3,   // 最大水平速度 
        gravity: 0.4,  // 重力
        maxVspeed: 9,  // 最大垂直速度
        // 血 
        blood: {
            type: cc.Prefab,
            default: null
        },
        // 子弹 
        bullet: {
            type: cc.Prefab,
            default: null
        },
        // 跳跃音效 
        jumpSound: {
            type: cc.AudioClip,
            default: null
        },
        // 二段跳音效 
        dJumpSound: {
            type: cc.AudioClip,
            default: null
        },
        // 死亡音效 
        deathSound: {
            type: cc.AudioClip,
            default: null
        },
        // 射击音效 
        shootSound: {
            type: cc.AudioClip,
            default: null
        },
    },
 
    // use this for initialization
    onLoad() {
        // 是否无敌模式。 
        this.invincible = (this.getQueryletiable("invincible") == 1);
        // this.invincible = 1;
       
        // 转换单位 
        this.jump *= Global.GMFrames;
        this.jump2 *= Global.GMFrames;
        this.maxSpeed *= Global.GMFrames;
        this.maxVspeed *= Global.GMFrames;
        // 监听键盘按下和释放事件 
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
 
        // 是否按下 ← 键
        this.L = 0;
        // 是否按下 → 键
        this.R = 0;
        // 是否可以二段跳
        this.djump = false;
        // 是否按下跳跃键
        this.jumpButton = false;
        // 是否按下射击键
        this.shootButton = false;
        // 是否站在平台上 
        this.onPlatorm = false;
        // 接触平台个数（可能多个平台会重合） 
        this.onPlatormTouchNum = 0;
        // 子弹个数
        this.bulletCount = 0;
        // 玩家状态 
        this.playerStatus = PLAYER_IDLE;
        // 获取刚体组件 
        this.body = this.getComponent(cc.RigidBody);
        // 获取刚体速度 
        this.speed = this.body.linearVelocity;
    },
 
    // 键盘按下 
    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.left:
                this.L = 1;
                break;
            case cc.macro.KEY.right:
                this.R = 1;
                break;
            case cc.macro.KEY.z:
                if (!this.shootButton) {
                    this.canShoot = true;
                }
                this.shootButton = true;
                break;
            case cc.macro.KEY.shift:
                if (!this.jumpButton) {
                    this.canJump = true;
                }
                this.jumpButton = true;
                break;
            case cc.macro.KEY.r:
                this.restartScene();
                break;
            case cc.macro.KEY.q:
                this.killPlayer();
                break;
            case cc.macro.KEY.p:
                this.wuDi();
                break;
        }
    },
 
    wuDi(){
        if (this.invincible) {
            this.invincible = false;
            this.node.group = "PlayerInvincible";
        }else{
            this.invincible = true;
            this.node.group = "Player";
        }
    },
 
    // 键盘释放
    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.left:
                this.L = 0;
                break;
            case cc.macro.KEY.right:
                this.R = 0;
                break;
            case cc.macro.KEY.z:
                this.shootButton = false;
                break;
            case cc.macro.KEY.shift:
                this.playerVJump();
                this.jumpButton = false;
                break;
        }
 
    },
 
 
    // called every frame, uncomment this function to activate update callback
    update(dt) {
        if (this.playerStatus != PLAYER_DEATH && this.playerStatus != PLAYER_TRANSFER) {
            this.speed = this.body.linearVelocity;
            // 限制掉落的最大速度 
            if (this.speed.y < -this.maxVspeed) {
                this.speed.y = -this.maxVspeed;
            }
            // 判断水平速度的方向 
            this.h = this.R;
            if (this.h == 0) {
                this.h = -this.L;
            }
            // 向左移动时翻转精灵 
            if (this.h > 0) {
                this.node.scaleX = 1;
            } else if (this.h < 0) {
                this.node.scaleX = -1;
            }
            this.speed.x = this.maxSpeed * this.h;
            // 跳跃 
            if (this.canJump == true) {
                this.playerJump();
                this.canJump = false;
            }
            if (this.onPlatorm) {
                // 在平台上  
                if (this.h == 0) {
                    this.speed.x = this.platformSpeed.x;
                    this.setPlayerStatus(PLAYER_IDLE);
                } else {
                    this.setPlayerStatus(PLAYER_RUNNING);
                }
            } else {
                if (this.speed.y < 0) {
                    // 跳跃中 
                    this.setPlayerStatus(PLAYER_FALL);
                } else if (this.speed.y > 0) {
                    // 降落中 
                    this.setPlayerStatus(PLAYER_JUMP);
                } else {
                    // 在方块上  
                    if (this.playerStatus == PLAYER_FALL) {
                        this.djump = true;
                    }
                    if (this.h == 0) {
                        this.setPlayerStatus(PLAYER_IDLE);
                    } else {
                        this.setPlayerStatus(PLAYER_RUNNING);
                    }
                }
            }
            this.body.linearVelocity = this.speed;
            // 发射子弹 
            if (this.canShoot) {
                this.playerShoot();
                this.canShoot = false;
            }
        }
    },
 
    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact(contact, selfCollider, otherCollider) {
        // console.log("onBeginContact");
        let selfAABB = selfCollider.getAABB();
        let otherAABB = otherCollider.getAABB();
        if (otherCollider.node.group == "Block") {
            if (selfAABB.xMax - otherAABB.xMin < 3 || otherAABB.xMax - selfAABB.xMin < 3 ||
                selfAABB.yMax - otherAABB.yMin < 3 || otherAABB.yMax - selfAABB.yMin < 3) {
                // 能防止部分在拼接处卡住的 BUG（平地走和贴墙跳不会卡了，不过跳跃落到拼接处有时还会卡住）
                contact.disabledOnce = true;
            }
        } else if (otherCollider.node.group == "Platform") {
            // 与平台接触，获取平台速度，玩家不动的时候水平速度要与平台一致。 
            let plat = otherCollider.node.getComponent("Platform") ? otherCollider.node.getComponent("Platform"):otherCollider.node.getComponent("Platform1");
            this.platformSpeed = plat.speed;
            this.onPlatorm = true;
            this.onPlatormTouchNum++;
        } else if (otherCollider.node.group.indexOf("Boss") != -1) {
            // 与 BOSS 和 BOSS 子弹接触后死亡。 
            this.killPlayer();
        }
    },
 
    // 只在两个碰撞体结束接触时被调用一次
    onEndContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.group == "Platform") {
            this.onPlatormTouchNum--;
            if (this.onPlatormTouchNum == 0) {
                this.onPlatorm = false;
            }
        }
    },
 
    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve(contact, selfCollider, otherCollider) {
        let selfAABB = selfCollider.getAABB();
        let otherAABB = otherCollider.getAABB();
        if (otherCollider.node.group == "Spike") {
            // 剔除与尖刺边沿的接触，否则有的情况会导致误判死掉 
            if (selfAABB.xMax - otherAABB.xMin > 1 && otherAABB.xMax - selfAABB.xMin > 1 &&
                selfAABB.yMax - otherAABB.yMin > 1 && otherAABB.yMax - selfAABB.yMin > 1) {
                contact.disabled = true;
                this.killPlayer();
            } else {
                contact.disabledOnce = true;
            }
        } else if (otherCollider.node.group == "Block") {
            // 被向上移动的平台和方块夹死 
            if (this.onPlatorm && this.speed.y > 0 && selfAABB.yMax - otherAABB.yMin > 10) {
                this.killPlayer();
            }
        }
    },
 
    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve(contact, selfCollider, otherCollider) {
 
    },
 
    // 设置玩家状态 
    setPlayerStatus(status) {
        if (this.playerStatus != status) {
            this.playerStatus = status;
            let anim = this.getComponent(cc.Animation);
            switch (status) {
                case PLAYER_IDLE:
                    anim.play('playerIdle');
                    break;
                case PLAYER_RUNNING:
                    anim.play('playerRunning');
                    break;
                case PLAYER_JUMP:
                    let animState = anim.play('playerJump');
                    break;
                case PLAYER_FALL:
                    anim.play('playerFall');
                    break;
            }
        }
    },
 
    // 玩家发射 
    playerShoot() {
        // 最多同时存在 4 颗子弹 
        if (Bullet.count < 4) {
            let bullet = cc.instantiate(this.bullet);
            bullet.parent = this.node.parent;
            bullet.setPosition(this.node.x, this.node.y + this.node.height / 3);
            let body = bullet.getComponent(cc.RigidBody);
            body.linearVelocity = cc.v2(body.linearVelocity.x *= this.node.scaleX, 0);
            cc.audioEngine.play(this.shootSound);
        }
    },
 
    // 玩家跳跃 
    playerJump() {
        if (this.speed.y == 0 || this.onPlatorm) {
            // 当纵向速度为 0 或在平台上可以跳跃（因为站在上下移动的平台纵向速度不为 0）。
            this.speed.y = this.jump;
            this.djump = true;
            cc.audioEngine.play(this.jumpSound);
        } else {
            if (this.djump) {
                // 二段跳 
                this.speed.y = this.jump2;
                this.djump = false;
                cc.audioEngine.play(this.dJumpSound);
            }
        }
    },
 
    // 玩家结束跳跃
    playerVJump() {
        if (this.speed.y > 0) {
            // 纵向速度变成 0.45 倍，所以提早松开跳跃键就会导致跳跃高度比较低。 
            this.speed.y *= 0.45;
            this.body.linearVelocity = this.speed;
        }
    },
 
    // 杀死玩家
    killPlayer() {
        // 无敌模式下不处理死亡 
        if (this.invincible) return;
        let sceneName = cc.director.getScene().name;
        if (sceneName == "SelectScene") {
            this.restartScene();
        } else if (sceneName == "EndScene") {
 
        } else {
            if (this.playerStatus != PLAYER_DEATH) {
                this.setPlayerStatus(PLAYER_DEATH);
                Global.save.playerDeath++;
                // 玩家重力和速度都为0，并且隐藏。
                // PS：因为是血是在该脚本创建，所以不能将 active 设为 false。
                this.speed = cc.v2(0, 0);
                this.body.linearVelocity = this.speed;
                this.body.gravityScale = 0;
                this.node.scale = 0;
                this.playerDeathPos = this.node.position;
                // GM8 的 I wanna 引擎是 20 帧，每帧 40 个血，会比较卡，改成 32 帧，每帧 25 个血。  
                this.schedule(this.bloodEmitter, 0.01, 32, 0.01);
                let gameOver = cc.find("Canvas/GAMEOVER");
                if (gameOver) {
                    cc.audioEngine.setMusicVolume(0.1);
                    gameOver.active = true;
                    cc.audioEngine.playMusic(this.deathSound, false);
                }
            }
        }
    },
 
    // 重启场景 
    restartScene() {
        cc.director.loadScene(cc.director.getScene().name);
    },
 
    // 血喷射 
    bloodEmitter() {
        for (let i = 0; i < 25; i++) {
            let blood = cc.instantiate(this.blood);
            blood.parent = this.node.parent;
            blood.setPosition(this.playerDeathPos.x, this.playerDeathPos.y + this.node.height / 2);
        }
    },
 
    // 是否死亡 
    isDead() {
        return this.playerStatus == PLAYER_DEATH;
    },
 
    // 获取地址参数 
    getQueryletiable(letiable) {
        let query = window.location.search.substring(1);
        let lets = query.split("&");
        for (let i = 0; i < lets.length; i++) {
            let pair = lets[i].split("=");
            if (pair[0] == letiable) { return pair[1]; }
        }
        return (false);
    }
});