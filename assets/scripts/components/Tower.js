cc.Class({
  extends: cc.Component,

  properties: {},

  start() {
    this.targets = [];
  },

  init(coordinates) {
    this.coordinates = coordinates;
    this.targets = [];
  },

  onCollisionEnter(other, self) {
    if (other.node.name === "enemy1") {
      this.targets.push(other.node);
    }
  },

  onCollisionExit(other, self) {
    this.removeTarget(other.node);
  },

  removeTarget(node) {
    this.targets = this.targets.filter((target) => target !== node);
  },

  getTarget() {
    return this.targets.length
      ? this.targets.find((target) => target.active)
      : false;
  }
});
