import LevelMap from "LevelMap";

cc.Class({
  extends: cc.Component,

  properties: {
    velocity: 150,
    levelMap: {
      default: null,
      type: LevelMap
    }
  },

  start() {
    this.targets = this.levelMap.tileMap.getObjectGroup("path").getObjects();
    this.targetIndex = 1;

    this.node.setPosition(this.getCurrrentTargetPosition());

    this.move();
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
  }
});
