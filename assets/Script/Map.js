let Global = require("Global");

cc.Class({
    extends: cc.Component,

    properties: {
        // 背景音乐 
        BGM: {
            type: cc.AudioClip,
            default: null
        },
        // 玩家 
        player: {
            type: cc.Prefab,
            default: null
        },
        // 平台 
        platform: {
            type: cc.Prefab,
            default: null
        },
        // 樱桃 
        cherry: {
            type: cc.Prefab,
            default: null
        },
        // 碰撞区域
        physics: {
            type: cc.Node,
            default: null
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.tiledMap = this.getComponent(cc.TiledMap);
        this.playBGM();
    },

    start() {
        this.makeMapCollider();
        this.makeMapTrigger();
        this.makeObject();
        this.createObject();
    },

    update(dt) {
        if (cc.director.getScene().name != "SelectScene") {
            // 计算游戏时间 
            Global.save.gameTime += dt;
        }
    },

    onDestroy() {
        this.stopBGM();
    },

    // 播放 BGM 
    playBGM() {
        if (this.BGM) {
            cc.audioEngine.setMusicVolume(1);
            cc.audioEngine.playMusic(this.BGM, true);
        }
    },

    // 停止 BGM 
    stopBGM() {
        cc.audioEngine.stopMusic();
    },

    // 制作该图层的碰撞组件（包括创建玩家、存档点和樱桃等）  
    makeMapColliderBy(layerName) {
        let tileSize = this.tiledMap.getTileSize();
        let tileWidth = tileSize.width;
        let tileHeight = tileSize.height;
        let layer = this.tiledMap.getLayer(layerName);
        if (!layer) return;
        layer.node.active = true;
        let layerSize = layer.getLayerSize();
        let num = layerSize.width * layerSize.height;
        for (let i = 0; i < num; i++) {
            let x = i % layerSize.width;
            let y = Math.floor(i / layerSize.width);
            let tile = layer.getTiledTileAt(x, y, true);

            if (tile.gid != 0) {
                if (tile.gid == 14) {
                    // 玩家起始位置 

                    tile.gid = 0;
                    if (!this.playerNode) {
                        this.playerNode = cc.instantiate(this.player);
                        this.playerNode.parent = this.node;
                        this.playerNode.zIndex = 1;
                        let x = tile.node.x + tileWidth / 2;
                        let y = tile.node.y;
                        if (Global.save.playerX) {
                            if (Global.save.sceneName == cc.director.getScene().name) {
                                // 场景一致表明这是读档 
                                x = Global.save.playerX;
                                y = Global.save.playerY;
                            } else {
                                // 场景不一致表明这不是读档，保存新场景名和玩家坐标。
                                Global.save.sceneName = cc.director.getScene().name;
                                Global.save.playerX = x;
                                Global.save.playerY = y;
                                Global.saveGame();
                            }
                        }
                        this.playerNode.setPosition(x, y);
                    }
                } else {
                    let body = tile.node.addComponent(cc.RigidBody);
                    body.type = cc.RigidBodyType.Static;
                    let collider = null;
                    if (tile.gid == 2) {
                        // 平台，删除地图上的平台图块，创建新的平台对象。
                        tile.gid = 0;
                        layer.setTiledTileAt(x, y, null);
                        let platform = cc.instantiate(this.platform);
                        tile = platform.addComponent(cc.TiledTile);
                        tile._x = x;
                        tile._y = y;
                        tile._layer = layer;
                        tile._updateInfo();
                        platform.parent = layer.node;
                        platform.x += tileWidth / 2;
                        platform.y += tileHeight / 2;
                    } else if (tile.gid == 11) {
                        // 背景，不处理。
                    } else if (tile.gid == 15) {
                        // 存档点 
                        tile.node.group = "Save";
                        let save = tile.node.addComponent("Save");
                        save.setTile(tile);
                        collider = tile.node.addComponent(cc.PhysicsBoxCollider);
                        collider.offset = cc.v2(tileWidth / 2, tileHeight / 2);
                        collider.size = tileSize;
                    } else if (tile.gid == 17) {
                        // 下尖刺 
                        tile.node.group = "Spike";
                        collider = tile.node.addComponent(cc.PhysicsPolygonCollider);
                        collider.points = [cc.v2(0, tileHeight), cc.v2(tileWidth / 2, 0), cc.v2(tileWidth, tileHeight)];
                    } else if (tile.gid == 18) {
                        // 左尖刺 
                        tile.node.group = "Spike";
                        collider = tile.node.addComponent(cc.PhysicsPolygonCollider);
                        collider.points = [cc.v2(0, tileHeight / 2), cc.v2(tileWidth, 0), cc.v2(tileWidth, tileHeight)];
                    } else if (tile.gid == 19) {
                        // 右尖刺 
                        tile.node.group = "Spike";
                        collider = tile.node.addComponent(cc.PhysicsPolygonCollider);
                        collider.points = [cc.v2(0, 0), cc.v2(tileWidth, tileHeight / 2), cc.v2(0, tileHeight)];
                    } else if (tile.gid == 20) {
                        tile.node.group = "Spike";
                        collider = tile.node.addComponent(cc.PhysicsPolygonCollider);
                        collider.points = [cc.v2(0, 0), cc.v2(tileWidth, 0), cc.v2(tileWidth / 2, tileHeight)];
                    } else if (tile.gid == 21) {
                        // 右蔓藤，没实现。 
                    } else if (tile.gid == 22) {
                        // 左蔓藤，没实现。 
                    } else if (tile.gid == 23) {
                        // 传送门，由于没法区分多个门，所以在对象层里处理。 
                    } else if (tile.gid == 24) {
                        // 樱桃，删除地图上的樱桃图块，创建新的樱桃对象。  
                        // PS：2.2.1 版本之前需要在 start 函数才可以。 
                        tile.gid = 0;
                        layer.setTiledTileAt(x, y, null);
                        let cherry = cc.instantiate(this.cherry);
                        cherry.getComponent(cc.Animation).enabled = true;
                        cherry.getComponent("BossBullet").enabled = false;
                        tile = cherry.addComponent(cc.TiledTile);
                        tile._x = x;
                        tile._y = y;
                        tile._layer = layer;
                        tile._updateInfo();
                        cherry.parent = layer.node;
                        cherry.x += tileWidth / 2;
                        cherry.y += tileHeight / 2;
                    } else {
                        // 方块 
                        // 不会动的方块放到Layer2图层，会将碰撞区域合并起来。 
                        // 会动的方块放到Layer1和Layer3图层，每个方块有单独的碰撞区域。 
                        if (layerName == "Layer2") {
                            let x = tile.node.x;
                            let y = tile.node.y;
                            let poly2 = {
                                regions: [[[x, y], [x, y + tileHeight], [x + tileWidth, y + tileHeight], [x + tileWidth, y]]],
                                inverted: false
                            };
                            if (this.poly.regions.length == 0) {
                                this.poly.regions = poly2.regions;
                            } else {
                                this.poly = PolyBool.union(this.poly, poly2);
                            }
                        } else {
                            tile.node.group = "Block";
                            collider = tile.node.addComponent(cc.PhysicsBoxCollider);
                            collider.offset = new cc.Vec2(tileSize.width / 2, tileSize.height / 2);
                            collider.size = tileSize;
                        }
                    }
                    if (collider) {
                        collider.tag = tile.gid;
                        collider.apply();
                    }
                }
            }
        }
    },

    // 制作碰撞组件 
    makeMapCollider() {
        this.poly = { regions: [], inverted: false };
        this.makeMapColliderBy("Layer1");
        this.makeMapColliderBy("Layer2");
        this.makeMapColliderBy("Layer3");
        //console.log(this.poly);
        // 根据计算得出的多边形添加碰撞组件 
        let regions = this.poly.regions;
        for (let i = 0; i < regions.length; i++) {
            // 闭合的碰撞区域计算得出的是内外两个多边形，所以不用多边形碰撞体改用链条碰撞体 
            let collider = this.physics.addComponent(cc.PhysicsChainCollider);
            collider.loop = true;
            collider.points = regions[i].map((v, i) => {
                return cc.v2(v[0], v[1]);
            });
            collider.apply();
        }

        if (cc.director.getScene().name == "SelectScene") return;
        if (Global.save.mode == "Impossible") return;
        this.makeMapColliderBy("VeryHard");
        if (Global.save.mode == "VeryHard") return;
        this.makeMapColliderBy("Hard");
        if (Global.save.mode == "Hard") return;
        this.makeMapColliderBy("Medium");


    },

    // 制作触发器（触发区域的陷阱以及传送门）
    makeMapTrigger() {
        let objectGroup = this.tiledMap.getObjectGroup("Trigger");
        if (objectGroup) {
            let objects = objectGroup.getObjects();
            for (let i in objects) {
                let object = objects[i];
                let node = new cc.Node();
                node.parent = this.node;
                node.group = "Trigger";
                let collider = null;
                if (object.type == 0) {
                    // 矩形区域  
                    node.x = object.x;
                    node.y = object.y - object.height;
                    node.name = object.name;
                    // 添加触发区域对应的组件与参数，可多个。 
                    node.triggerNum = 0;
                    let j = 1;
                    while (true) {
                        let id = (j == 1 ? "" : String(j));
                        if (object["script" + id]) {
                            let trigger = node.addComponent(object["script" + id]);
                            trigger.params = object["params" + id];
                            node.triggerNum++;
                        } else {
                            break;
                        }
                        j++;
                    }
                    // 添加刚体组件 
                    let body = node.addComponent(cc.RigidBody);
                    body.type = cc.RigidBodyType.Static;
                    body.enabledContactListener = true;
                    // 添加物理碰撞组件 
                    collider = node.addComponent(cc.PhysicsBoxCollider);
                    collider.offset = new cc.Vec2(object.width / 2, object.height / 2);
                    collider.size = new cc.size(object.width, object.height);
                    collider.apply();
                } else if (object.type == 3) {
                    // 多边形区域，没实现 
                }
            }
        }
    },

    // 制作对象（目前只有设置平台的参数） 
    makeObject() {
        let objectGroup = this.tiledMap.getObjectGroup("Object");
        if (objectGroup) {
            let objects = objectGroup.getObjects();
            for (let i in objects) {
                let object = objects[i];
                if (object.name == "Platform") { // 平台 
                    let layer = this.tiledMap.getLayer("Layer2");
                    let x = object.offset.x / 32;
                    let y = object.offset.y / 32;
                    let tile = layer.getTiledTileAt(x, y, true);
                    let platform = tile.addComponent("Platform");
                    platform.direction = object.direction;
                    platform.speedValue = object.speed;
                    platform.slower = object.slower;
                }
            }
        }
    },

    createObject() {
        let objectGroup = this.tiledMap.getObjectGroup("Object");
        if (objectGroup) {
            let objects = objectGroup.getObjects();
            for (let i in objects) {
                let object = objects[i];
                if (object.name == "Platform1") {
                    let layer = this.tiledMap.getLayer("Layer2");
                    let x = object.offset.x / 32;
                    let y = object.offset.y / 32;
           
                    let tile = layer.getTiledTileAt(x, y, true);
                    let platform = tile.addComponent("Platform1");
                    platform.direction = object.direction;
                    platform.speedValue = object.speed;
                }
            }
        }
    },
});