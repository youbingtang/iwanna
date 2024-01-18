cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad() {
        this.pointVelPlatform = cc.v2();
        this.pointVelOther = cc.v2();
        this.relativeVel = cc.v2();
        this.relativePoint = cc.v2();
        this.speed = cc.v2(0, 0);
        this.count = 0;
        this.isSpeed = false;
        this.slower = this.slower ? this.slower : false;
    },

    start() {
        
        this.speedValue = this.speedValue || 0;
        if (this.direction == "left") {
            this.speed = cc.v2(-this.speedValue, 0);
        } else if (this.direction == "right") {
            this.speed = cc.v2(this.speedValue, 0);
        } else if (this.direction == "up") {
            this.speed = cc.v2(0, this.speedValue);
        } else if (this.direction == "down") {
            this.speed = cc.v2(0, -this.speedValue);
        } else {
            this.speed = cc.v2(0, 0);
        }

    },
    onBeginContact(contact, selfCollider, otherCollider) {

        if (otherCollider.node.group == "Player") {
            if (this.slower) {
                this.count += 10;
                if (this.direction == "left") {
                    this.speed = cc.v2(-this.speedValue / this.count, 0);
                } else if (this.direction == "right") {
                    this.speed = cc.v2(this.speedValue / this.count, 0);
                } else if (this.direction == "up") {
                    this.speed = cc.v2(0, this.speedValue / this.count);
                } else if (this.direction == "down") {
                    this.speed = cc.v2(0, -this.speedValue / this.count);
                } else {
                    this.speed = cc.v2(0, 0);
                }
            }
            let cache = this._pointsCache;

            let otherBody = otherCollider.body;
            let platformBody = selfCollider.body;

            let worldManifold = contact.getWorldManifold();
            let points = worldManifold.points;

            let pointVelPlatform = this.pointVelPlatform;
            let pointVelOther = this.pointVelOther;
            let relativeVel = this.relativeVel;
            let relativePoint = this.relativePoint;

            //check if contact points are moving into platform
            for (let i = 0; i < points.length; i++) {
                platformBody.getLinearVelocityFromWorldPoint(points[i], pointVelPlatform);
                otherBody.getLinearVelocityFromWorldPoint(points[i], pointVelOther);
                platformBody.getLocalVector(pointVelOther.subSelf(pointVelPlatform), relativeVel);

                if (relativeVel.y < -32) //if moving down faster than 32 pixel/s (1m/s), handle as before
                    return;  //point is moving into platform, leave contact solid and exit
                else if (relativeVel.y < 32) { //if moving slower than 32 pixel/s (1m/s)
                    //borderline case, moving only slightly out of platform
                    platformBody.getLocalPoint(points[i], relativePoint);
                    let platformFaceY = selfCollider.getAABB().height / 2;  //front of platform, should only used on a box collider
                    if (relativePoint.y > platformFaceY - 0.1 * 32)
                        return;  //contact point is less than 3.2pixel (10cm) inside front face of platfrom
                }
                else {
                    //moving up faster than 1 m/s
                }
            }

            // store disabled state to contact
            contact.disabled = true;

        } else if (otherCollider.node.group == "Block") {
            // 平台与方块碰撞后改变速度方向 
            let point = contact.getWorldManifold().points[0];
            if ((this.speed.x > 0 && this.node.x < point.x) || (this.speed.x < 0 && this.node.x > point.x)) {
                this.speed.x = -this.speed.x;
            }
            if ((this.speed.y > 0 && this.node.y + 8 < point.y) || (this.speed.y < 0 && this.node.y + 8 > point.y)) {
                this.speed.y = -this.speed.y;
            }
        }

    },
    // called every frame, uncomment this function to activate update callback
    update(dt) {

        this.node.x += this.speed.x * 0.01;
        this.node.y += this.speed.y * 0.01;
    },
});

