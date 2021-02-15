cc.Class({
  extends: cc.Component,

  properties: {
    fire: {
      default: null,
      type: cc.Prefab
    },
    rotationSpeed: 300,
    reloadTime: 0.3, // 幾秒發射一顆子彈
    fireSpeed: 0.2 // 子彈發射速度
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
      // 砲台轉到小兵位置方向後, 在發射子彈
      this.rotateTo(targetPosition).then(() => this.createFire(targetPosition));
    }
  },

  // 新增子彈
  createFire(targetPosition) {
    const fireNode = cc.instantiate(this.fire);

    fireNode.position = cc.v2(this.node.x, this.node.y);
    fireNode.angle = this.node.angle;
    this.node.parent.addChild(fireNode);
    fireNode.getComponent("Fire").init();

    this.moveFire(fireNode, targetPosition);
  },

  // 移動到目標位置後銷毀
  moveFire(fireNode, targetPosition) {
    const moveToAction = cc.moveTo(
      this.fireSpeed,
      targetPosition.x,
      targetPosition.y
    );
    const sequenceAction = cc.sequence(
      moveToAction,
      cc.callFunc(() => fireNode.destroy())
    );
    fireNode.runAction(sequenceAction);
  },

  rotateTo(targetPosition) {
    const angle = -this.getAngle(targetPosition);
    const distance = Math.abs(angle - this.node.angle);

    // 等旋轉完後 call resolve
    return new Promise((resolve) => {
      const time = distance / this.rotationSpeed;

      if (!distance) return resolve();

      const sequenceAction = cc.sequence(
        cc.rotateTo(time, angle),
        cc.callFunc(resolve)
      );
      this.node.runAction(sequenceAction);
    });
  },

  // 計算要轉的角度
  getAngle({ x, y }) {
    return (Math.atan2(y - this.node.y, x - this.node.x) * 180) / Math.PI - 90;
  }
});
