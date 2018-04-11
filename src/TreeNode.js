'use strict'

/* abstract class */

class TreeNode {

  /*
    field: just some value (argument), also can be Event
    parent: AsyncTreeNode
    position: int
  */
  constructor(field, parent, position) {
    this.field = field;
    this.parent = parent;
    this.position = position;
  }

  /****** To be overriden ******/
    
    call(result) {
      throw new Error('call must be overridden');
    }

    isLeaf() {
      throw new Error('isLeaf must be overridden');
    }

  /*****************************/

  /*
    The methods below are not allowed to be overridden
  */

  callParent(result) {
    this.parent.insertArgumentResult(this.position, result || this.field);
    if (this.parent.readyToBeInvoked()) {
      this.parent.call();
    }
  }

}

module.exports = TreeNode;
