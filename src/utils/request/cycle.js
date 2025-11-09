/**
 * 根据边的映射关系创建循环链表
 * @param {Object} edgePipeMap - 边的映射关系，格式如 { 'edge-1': 'edge-2', ... }
 * @returns {Object} 循环链表的头节点（任意节点均可作为入口，因是循环结构）
 */
export function createEdgeCycleList(edgePipeMap) {
  // 1. 校验输入合法性
  if (typeof edgePipeMap !== 'object' || edgePipeMap === null) {
    throw new Error('edgePipeMap 必须是一个非空对象');
  }

  const edgeIds = Object.keys(edgePipeMap);
  if (edgeIds.length === 0) {
    throw new Error('edgePipeMap 不能为空对象');
  }

  // 2. 先创建所有节点（存储边ID和next指针）
  const nodeMap = {};
  edgeIds.forEach(edgeId => {
    nodeMap[edgeId] = {
      edgeId: edgeId,       // 边的ID
      next: null            // 指向的下一个节点
    };
  });

  // 3. 建立节点间的指向关系（根据edgePipeMap）
  edgeIds.forEach(currentEdgeId => {
    const nextEdgeId = edgePipeMap[currentEdgeId];
    // 校验映射关系的合法性（确保nextEdgeId存在于nodeMap中）
    // eslint-disable-next-line no-prototype-builtins
    if (!nodeMap.hasOwnProperty(nextEdgeId)) {
      throw new Error(`edgePipeMap 中 '${currentEdgeId}' 指向的 '${nextEdgeId}' 不存在`);
    }
    nodeMap[currentEdgeId].next = nodeMap[nextEdgeId];
  });

  // 4. 返回循环链表的头节点（取第一个边ID对应的节点即可，因是循环结构）
  return nodeMap[edgeIds[0]];
}


// 示例使用
// const edgePipeMap = {
//   'edge-1': 'edge-2',
//   'edge-2': 'edge-3',
//   'edge-3': 'edge-1',
// };

// 创建循环链表
// const cycleListHead = createEdgeCycleList(edgePipeMap);

// 验证循环链表（循环打印3圈）
// let currentNode = cycleListHead;
// let count = 0;
// while (count < 3 * Object.keys(edgePipeMap).length) {
//   console.log(currentNode.edgeId); // 输出：edge-1 → edge-2 → edge-3 → edge-1 → ...（循环3圈）
//   currentNode = currentNode.next;
//   count++;
// }
