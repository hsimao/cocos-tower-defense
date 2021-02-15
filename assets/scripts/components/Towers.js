cc.Class({
  extends: cc.Component,

  properties: {
    towersPrefabs: {
      default: [],
      type: [cc.Prefab]
    }
  },

  init(map) {
    this.map = map;
    this.items = [];
  },

  create(key, coordinates) {
    // 依據 key 來新增指定砲台
    const towerNode = cc.instantiate(
      this.towersPrefabs.find((towerPrefab) => towerPrefab.name === key)
    );
    this.node.addChild(towerNode);

    // 初始化 tower component
    const towerComponent = towerNode.getComponent("Tower");
    towerComponent.init(coordinates);

    // 將創建的 tower component 儲存到 this.items
    this.items.push(towerComponent);

    // 將創建的 node 設定到正確座標位置
    const { x, y } = this.map.towersLayer.getPositionAt(coordinates);

    towerNode.setPosition(
      cc.v2(x + this.map.tileWidth / 2, y + this.map.tileHeight / 2)
    );
  },

  // 取出 items 內相同座標的 towerComponent
  getByCoordinates(coordinates) {
    return this.items.find(
      ({ coordinates: { x, y } }) => x === coordinates.x && y === coordinates.y
    );
  }
});
