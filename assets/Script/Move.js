cc.Class({
    extends: cc.Component,
 
    properties: {
    },
 
    // LIFE-CYCLE CALLBACKS:
 
    // onLoad () {},
 
    start() {
        // 获取 Tiled 编辑器里设置的 params 参数 
        let params = JSON.parse(this.params);
        // 移动的图块对象，是个数组 
        this.objects = params.objects;
        // 方向 
        this.direction = params.direction;
        // 距离（0 为飞出屏幕外）
        this.distance = params.distance;
        // 速度
        this.speed = params.speed;
        // 移动完删除（不能删除，所以比例设为 0），防止隐藏在方块底下的尖刺依旧和玩家发生碰撞 
        // PS：getTiledTileAt 创建的图块对象不能删除，否则原本的图块就会显示。
        this.remove = params.remove;
        //是否为回到原位的陷阱
        this.isBack = params.isBack;
        //判断是否变大
        this.big = params.big ? params.big : 1;
        //判断是否为
        // 移动的图块对象所在的图层（默认 Layer2）
        let layerName = params.layer ? params.layer : "Layer2";
        let tiledMap = this.node.parent.getComponent(cc.TiledMap);
        this.layer = tiledMap.getLayer(layerName);
 
    },
 
    // update (dt) {},
 
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
                let distance = this.distance;
                if (distance <= 0) {
                    distance = cc.view.getVisibleSize().width;
                }
                //移动
                let position;
                if (this.direction == "up") {
                    position = cc.v2(0, distance);
                } else if (this.direction == "down") {
                    position = cc.v2(0, -distance);
                } else if (this.direction == "left") {
                    position = cc.v2(-distance, 0);
                } else if (this.direction == "right") {
                    position = cc.v2(distance, 0);
                }
                let posBack = position.neg();
                let duration = distance / this.speed;
                // tile.node.scale = this.big;
                cc.tween(tile.node)
                    .to(0.01, { scale: this.big })
                    .by(duration, { position: position })
 
                    .call(() => {
                        if (this.isBack) {
                            cc.tween(tile.node)
                                .by(duration, { position: posBack })
                                .start()
                        }
                    })
                    .call(() => {
                        if (this.remove || this.distance <= 0) {
                            tile.node.scale = 0;
                        }
                    })
                    .start()
            }
        }
 
    },
 
});
 
