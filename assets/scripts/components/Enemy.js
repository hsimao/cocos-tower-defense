import LevelMap from "LevelMap";

cc.Class({
  extends: cc.Component,

  properties: {
    life: 5,
    velocity: 150,
    rotationSpeed: 300,
    levelMap: {
      default: null,
      type: LevelMap
    }
  },

  onLoad() {
    this.node.on("hit", () => this.handleHit());
  },

  start() {
    this.targets = this.levelMap.tileMap.getObjectGroup("path").getObjects();
    this.targetIndex = 1;

    this.node.setPosition(this.getCurrrentTargetPosition());

    this.move();
  },

  handleHit() {
    this.life--;
    if (this.life === 0) {
      this.node.destroy();
    }
  },

  getCurrentTarget() {
    return this.targets.find(
      (target) => parseInt(target.name) === this.targetIndex
    );
  },

  // 取得 enemy 要前往的目標位置
  getCurrrentTargetPosition() {
    // 從 path layer 取得 path object
    const currentTarget = this.getCurrentTarget();

    if (!currentTarget) return false;

    // 從 path object 取得 tile row、column 座標
    const tileCoordinates = this.levelMap.getTileCoordinatesByPosition(
      cc.v2(currentTarget.x, currentTarget.y)
    );

    // 取得 px 座標
    const position = this.levelMap.roadsLayer.getPositionAt(
      tileCoordinates.x,
      tileCoordinates.y
    );

    // 取得 tile 中心座標
    const x = position.x + this.levelMap.tileWidth / 2;
    const y = position.y + this.levelMap.tileWidth / 2;

    return cc.v2(x, y);
  },

  move() {
    this.targetIndex++;
    const targetPosition = this.getCurrrentTargetPosition();

    if (!targetPosition) {
      this.node.emit("finished");
      this.node.destroy();
      return;
    }

    // 移動完後再重新執行, 前往下個移動位置
    this.moveTo(targetPosition).then(() => this.move());

    // 轉向要移動的方向
    this.rotateTo(targetPosition);
  },

  getDistance(targetPosition) {
    const x = Math.abs(targetPosition.x - this.node.x);
    const y = Math.abs(targetPosition.y - this.node.y);

    return Math.max(x, y);
  },

  moveTo(targetPosition) {
    // 依據移動距離來換算均速
    const time = this.getDistance(targetPosition) / this.velocity;

    return new Promise((resolve) => {
      const moveToAction = cc.moveTo(time, targetPosition);
      // 移動完後 call resolve
      const sequence = cc.sequence(moveToAction, cc.callFunc(resolve));
      this.node.runAction(sequence);
    });
  },

  rotateTo(targetPosition) {
    const angle = -this.getAngle(targetPosition);
    const distance = Math.abs(angle - this.node.angle);

    if (distance) {
      const time = distance / this.rotationSpeed;
      this.node.runAction(cc.rotateTo(time, angle));
    }
  },

  // 計算要轉的角度
  getAngle({ x, y }) {
    return (Math.atan2(y - this.node.y, x - this.node.x) * 180) / Math.PI;
  },

  onCollisionEnter(other, self) {
    // 被子彈擊中
    if (other.node.name === "fire") {
      this.node.emit("hit");
    }
  }
});
