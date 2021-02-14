cc.Class({
  extends: cc.Component,

  properties: {
    button1: {
      default: null,
      type: cc.Node
    },
    button2: {
      default: null,
      type: cc.Node
    }
  },

  init(map) {
    this.map = map;
    this.coordinates = { x: 0, y: 0 };

    this.button1.on(cc.Node.EventType.TOUCH_END, this.onButtonClick, this);
    this.button2.on(cc.Node.EventType.TOUCH_END, this.onButtonClick, this);
  },

  show(coordinates) {
    this.coordinates = coordinates;
    const { x, y } = this.map.towersLayer.getPositionAt(this.coordinates);
    this.node.setPosition(
      cc.v2(x + this.map.tileWidth / 2, y + this.map.tileWidth / 2)
    );
    this.node.active = true;
  },

  hide() {
    this.node.active = false;
  },

  onButtonClick(event) {
    this.node.emit("button-click", {
      towerKey: event.target.name,
      towerCoordinates: this.coordinates
    });
  }
});
