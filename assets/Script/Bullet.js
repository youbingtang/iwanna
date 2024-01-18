cc.Class({
    extends: cc.Component,
    statics: {
        count: 0 // 子弹数量 
        
    },
    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 子弹速度为 800 像素/秒，在编辑器的刚体组件里设置了。 
        // 子弹计数 
        this.count++;
        // 子弹0.8秒后删除
        this.scheduleOnce(function () {
            this.count--;
            this.node.destroy();
        }, 0.8);
    },

    start () {
    },

    // update (dt) {},

    onBeginContact: function (contact, selfCollider, otherCollider) {
        contact.disabled = true;
        if (otherCollider.node.group == "Block") {
            // 子弹与方块碰撞后删除 
            this.node.destroy();
        } else if(otherCollider.node.group == "Save"){
            // 子弹与存档碰撞后进行存档 
            otherCollider.node.getComponent("Save").save();
        }
    },
});
