cc.Class({
    extends: cc.Component,
 
    properties: {
 
    },
 
    // onLoad () {},
 
    start() {
        // 获取 Tiled 编辑器里设置的 params 参数 
        let params = JSON.parse(this.params);
        // 移动的图块对象，是个数组 
        this.objects = params.objects;
        //是否为隐藏的地图块
        this.fake = params.fake ? params.fake : false;
 
        // 移动的图块对象所在的图层（默认 Layer2）
        let layerName = params.layer ? params.layer : "Layer2";
        let tiledMap = this.node.parent.getComponent(cc.TiledMap);
        this.layer = tiledMap.getLayer(layerName);
        this.isFake();
    },
    isFake() {
        for (let i in this.objects) {
            let pos = this.objects[i];
            let x = pos[0];
            let y = pos[1];
            let tile = this.layer.getTiledTileAt(x, y, true);
 
            if (this.fake) {
                tile.node.scale = 0;
            } else {
                tile.node.scale = 1;
            }
        }
    },
    onBeginContact(contact, selfCollider, otherCollider) {
        contact.disabled = true;
        // 一个触发区域可能有多种不同陷阱，当计数 0 的时候才表明全部触发了 
        if (selfCollider.node.triggerNum > 0) {
            selfCollider.node.triggerNum--;
            for (let i in this.objects) {
                let pos = this.objects[i];
                let x = pos[0];
                let y = pos[1];
                let tile = this.layer.getTiledTileAt(x, y, true);
 
                if (this.fake) {
                    tile.node.scale = 1;
                } else {
                   // console.log( tile);
                   // console.log( tile.node);
                    // tile.node.getComponent(cc.PhysicsBoxCollider).enabled = false;
                    tile.node.scale = 0;
                }
            }
        }
 
    },
 
    // update (dt) {},
});
 
