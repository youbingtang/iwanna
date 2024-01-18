var Global = require("Global");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        
    },
    
    // update (dt) {},

    onBeginContact (contact, selfCollider, otherCollider) {
        contact.disabled = true;
        var name = selfCollider.node.name;
        if (name == "LoadGame") {
            // 读取游戏 
            Global.loadGame();
            if (Global.save.sceneName == "") {
                cc.director.loadScene("SelectScene");
            }
        } else {
            // 新游戏 
            Global.save.sceneName = "Level1Scene";
            Global.save.mode = selfCollider.node.name;
        }
        cc.director.loadScene(Global.save.sceneName);
    },

});