var Global = require("Global");

cc.Class({
    extends: cc.Component,

    properties: {
        // 存档 1 
        save1 : {
            type: cc.Node,
            default: null
        },
        // 存档 2 
        save2 : {
            type: cc.Node,
            default: null
        },
        // 存档 3 
        save3 : {
            type: cc.Node,
            default: null
        },
        // 光标 
        cursor : {
            type: cc.Node,
            default: null
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // 光标起始位置 
        this.originX = this.cursor.x;
        // 选项的间隔 
        this.space = -this.originX;
        // 起始索引 
        this.index = 0;
        // 是否按下 ← 键
        this.leftButton = false;
        // 是否按下 → 键
        this.rightButton = false;
        // 监听键盘按下和释放事件 
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        
        this.showSaveData();
    },

    // update (dt) {},

    // 键盘按下 
    onKeyDown (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.left:
                if (!this.leftButton) {
                    this.leftButton = true;
                    this.cursorMove(-1);
                }
                
                break;
            case cc.macro.KEY.right:
                if (!this.rightButton) {
                    this.rightButton = true;
                    this.cursorMove(1);
                }
                break;
            case cc.macro.KEY.shift:
                this.startGame();
                break; 
        }
    },

    // 键盘释放 
    onKeyUp (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.left:
                this.leftButton = false;
                break;
            case cc.macro.KEY.right:
                this.rightButton = false;
                break;
        }
    },

    // 光标移动 
    cursorMove(value) {
        this.index += value;
        if (this.index > 2) {
            this.index = 0;
        } else if (this.index < 0) {
            this.index = 2;
        }
        this.cursor.x = this.originX + this.index*this.space;
    },

    // 显示存档数据 
    showSaveData () {
        for (var id = 1; id < 4; id++) {
            var data = Global.getSaveData(id);
            var saveNode = this["save"+id];
            saveNode.getChildByName("mode").getComponent(cc.Label).string = data.mode;
            saveNode.getChildByName("death").getComponent(cc.Label).string = "death:" + data.playerDeath;
            saveNode.getChildByName("time").getComponent(cc.Label).string = "time:" + this.formatTime(data.gameTime);
        }
    },

    // 开始游戏 
    startGame () {
        Global.saveId = this.index + 1;
        cc.director.loadScene("SelectScene");
    },

    // 格式化时间 
    formatTime (time) {
        var hour = Math.floor(time/60/60);
        var minute = Math.floor(time/60)%60;
        var second = Math.floor(time)%60;
        // return hour + ":" + ('0' + minute).slice(-2) + ":" + ('0' + second).slice(-2); 
        return hour + ":" + minute + ":" + second; 
    }

});
