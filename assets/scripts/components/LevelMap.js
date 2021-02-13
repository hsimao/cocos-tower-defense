cc.Class({
  extends: cc.Component,

  properties: {},

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start() {
    this.initTileMap();
  },

  // update (dt) {},

  initTileMap() {
    this.tileMap = this.getComponent(cc.TiledMap);

    this.roadsLayer = this.tileMap.getLayer("roads");
    this.towerLayer = this.tileMap.getLayer("towers");

    const tileSize = this.tileMap.getTileSize();
    this.tileWidth = tileSize.width;
    this.tileHeight = tileSize.height;

    const mapSize = this.tileMap.getMapSize();
    this.mapWidth = mapSize.width;
    this.mapHeight = mapSize.height;
  },

  // 使用整個畫布 x, y 軸座標, 來換算取得在 tileMap 上的位置
  getTileCoordinatesByPosition(position) {
    return {
      x: Math.floor(position.x / this.tileWidth),
      // y 軸由下往上算
      y: this.mapHeight - Math.floor(position.y / this.tileHeight) - 1
    };
  }
});
