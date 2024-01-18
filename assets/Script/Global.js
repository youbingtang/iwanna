module.exports = {
    init: false,  // 是否初始化 
    GMFrames: 50, // GameMaker 的帧率是 50 帧/秒，用于之后的单位换算 
    saveId: 0,    // 存档 ID 
    save: {
        sceneName: "",  // 场景名 
        mode: "", // 困难模式
        playerX: 0,    // 玩家坐标 x
        playerY: 0,    // 玩家坐标 y
        playerDeath: 0, // 玩家死亡次数 
        gameTime: 0     // 游戏时间 
    },

    // 清空数据 
    clear () {
        this.save = {
            sceneName: "",
            mode: "",
            playerX: 0,
            playerY: 0,
            playerDeath: 0,
            gameTime: 0
        }
    },
    
    // 读取游戏 
    loadGame () {
        var save = cc.sys.localStorage.getItem("save" + this.saveId);
        if (save) {
            this.save = JSON.parse(save);
        }
    },

    // 保存游戏 
    saveGame (){
        cc.sys.localStorage.setItem("save" + this.saveId, JSON.stringify(this.save));
    },
    
    // 读取存档数据 
    getSaveData (id){
        var save = cc.sys.localStorage.getItem("save" + id);
        if (save) {
            save = JSON.parse(save);
        } else {
            save = this.save;
        }
        return save;
    }
};