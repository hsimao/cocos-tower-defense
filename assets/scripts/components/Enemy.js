import LevelMap from "LevelMap";

cc.Class({
  extends: cc.Component,

  properties: {
    levelMap: {
      default: null,
      type: LevelMap
    }
  },

  start() {
    this.targets = this.levelMap.tileMap.getObjectGroup("path").getObjects();
    this.targetIndex = 1;
    const position = this.getCurrrentTargetPosition();

    this.node.setPosition(position);
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
    const y = position.y + this.levelMap.tileHeight / 2;

    return cc.v2(x, y);
  }
});
