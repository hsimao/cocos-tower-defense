cc.Class({
  extends: cc.Component,

  properties: {
    rotationSpeed: 500,
    reloadTime: 0.5 // 幾秒發射子彈一次
  },

  start() {
    this.targets = [];
  },

  init(coordinates) {
    this.coordinates = coordinates;
    this.targets = [];

    this.schedule(() => {
      this.tryFire();
    }, this.reloadTime);
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
  },

  tryFire() {
    const targetNode = this.getTarget();

    if (targetNode && targetNode.active) {
      const targetPosition = cc.v2(targetNode.x, targetNode.y);
      // 砲台轉到小兵位置方向
      this.rotateTo(targetPosition);
    }
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
    return (Math.atan2(y - this.node.y, x - this.node.x) * 180) / Math.PI - 90;
  }
});
