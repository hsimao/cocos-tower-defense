import LevelMap from "LevelMap";

cc.Class({
  extends: cc.Component,

  properties: {
    map: {
      default: null,
      type: LevelMap
    }
  },

  onLoad() {
    this.init();
    this.setEvents();
  },

  init() {
    this.map.init();
  },

  setEvents() {
    this.map.node.on(cc.Node.EventType.TOUCH_END, this.onMapTouch, this);
  },

  // 判斷滑鼠點擊當下位置是否在地圖砲台上
  onMapTouch(e) {
    const location = e.getLocation();
    // 因為地圖解析度是兩倍所以要 * 2
    const position = {
      x: location.x * 2,
      y: location.y * 2
    };

    const coordinates = this.map.getTileCoordinatesByPosition(position);
    const tileId = this.map.towersLayer.getTileGIDAt(coordinates);
    if (tileId) {
      console.log(tileId);
    }
  }
});
