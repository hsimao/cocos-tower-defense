import LevelMap from "LevelMap";
import PanelCreate from "PanelCreate";
import Towers from "Towers";

cc.Class({
  extends: cc.Component,

  properties: {
    panelCreate: {
      default: null,
      type: PanelCreate
    },
    map: {
      default: null,
      type: LevelMap
    },
    towers: {
      default: null,
      type: Towers
    }
  },

  onLoad() {
    this.init();
    this.setEvents();
  },

  init() {
    this.map.init();
    this.panelCreate.init(this.map);
    this.towers.init(this.map);
  },

  setEvents() {
    this.map.node.on(cc.Node.EventType.TOUCH_END, this.onMapTouch, this);
    this.panelCreate.node.on("button-click", this.onTowerCreate, this);
  },

  onTowerCreate(data) {
    this.towers.create(data.towerKey, data.towerCoordinates);
    this.panelCreate.hide();
  },

  onMapTouch(e) {
    this.panelCreate.hide();
    const location = e.getLocation();
    // 因為地圖解析度是兩倍所以要 * 2
    const position = {
      x: location.x * 2,
      y: location.y * 2
    };

    // 判斷滑鼠點擊當下位置是否在地圖砲台上
    const coordinates = this.map.getTileCoordinatesByPosition(position);
    const tileId = this.map.towersLayer.getTileGIDAt(coordinates);
    if (tileId) {
      this.panelCreate.show(coordinates);
    }
  }
});
