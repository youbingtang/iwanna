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
        // 传送门，切换到到对象名字对应的场景 
        contact.disabled = true;
        otherCollider.node.active = false;
        var name = selfCollider.node.name;
        cc.director.loadScene(name + "Scene");
    },

});