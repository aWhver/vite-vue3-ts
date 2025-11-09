<template>
  <div class="container" ref="container"></div>
</template>
<script setup>
import { defineOptions, ref, onMounted } from 'vue';
defineOptions({
  name: 'G6Animate',
});
import {
  Polyline,
  ExtensionCategory,
  Graph,
  register,
  subStyleProps,
} from '@antv/g6';
import { createEdgeCycleList } from '../utils';
const container = ref(null);
let graph = null;
const markerMap = {};
// const edgePipeMap = {
//   'edge-1': 'edge-2',
//   'edge-2': 'edge-3',
//   'edge-3': 'edge-1',
// };
const cycleListMap = {
  'edge-1': createEdgeCycleList({
    'edge-1': 'edge-2',
    'edge-2': 'edge-1',
  }),
  'edge-3': createEdgeCycleList({
    'edge-3': 'edge-5',
    'edge-5': 'edge-3',
  }),
  'edge-4': createEdgeCycleList({
    'edge-4': 'edge-5',
    'edge-5': 'edge-4',
  }),
  'edge-6': createEdgeCycleList({
    'edge-6': 'edge-6',
  }),
  'edge-7': createEdgeCycleList({
    'edge-7': 'edge-8',
    'edge-8': 'edge-9',
    'edge-9': 'edge-7',
  }),
  'edge-10': createEdgeCycleList({
    'edge-10': 'edge-12',
    'edge-12': 'edge-10',
  }),
  'edge-11': createEdgeCycleList({
    'edge-11': 'edge-12',
    'edge-12': 'edge-11',
  }),
  'edge-13': createEdgeCycleList({
    'edge-13': 'edge-13',
  })
};
// console.log('cycleListMap', cycleListMap);
const durationMap = {}
class FlyMarkerCubic extends Polyline {
  getMarkerStyle(attributes) {
    return {
      r: 5,
      fill: '#c3d5f9',
      d: 'M 3,-5 L 3,5 L 15,0 Z',
      stroke: '#f60',
      visibility: 'hidden',
      offsetPath: this.shapeMap.key,
      ...subStyleProps(attributes, 'marker'),
    };
  }

  onCreate() {
    const marker = this.upsert(
      'marker',
      'path',
      this.getMarkerStyle(this.attributes),
      this
    ); /*
    const marker = this.upsert(
      'marker',
      'circle',
      this.getMarkerStyle(this.attributes),
      this
    ); */
    markerMap[this.id] = marker;
    durationMap[this.id] = this.attributes.duration;
    let cycleList = cycleListMap[this.id];
    let id = this.id;
    if (!this.attributes.animateOnCreate || !cycleList) {
      return;
    }
    runAnimate(marker, durationMap[id]);
    // console.log('runAnimate', runAnimate);

    function runAnimate(mark, duration) {
      mark.attr('visibility', 'visible');
      mark
        .animate([{ offsetDistance: 0 }, { offsetDistance: 1 }], {
          duration,
          // iterations: Infinity,
        })
        .finished.then(() => {
          id = cycleList.next.edgeId;
          cycleList = cycleList.next;
          mark.attr('visibility', 'hidden');
          runAnimate(markerMap[id], durationMap[id]);
        });
    }
  }
  onDestroy() {
    // console.log('1', this.attributes);
    delete cycleListMap[this.id]
    delete durationMap[this.id]
    delete markerMap[this.id]
  }
}

const nodeMap = {
  'node-0': { id: 'node-0', style: { x: 50, y: 650 } },
  'node-1': { id: 'node-1', style: { x: 100, y: 650 } },
  'node-2': { id: 'node-2', style: { x: 150, y: 650 } },
  'node-3': { id: 'node-3', style: { x: 200, y: 650 } },
  'node-4': {
    id: 'node-4',
    style: { x: 400, y: 650, size: [60, 20], fill: '#f60' },
  },
  'node-5': { id: 'node-5', style: { x: 500, y: 650 } },
  'node-6': { id: 'node-6', style: { x: 50, y: 600 } },
  'node-7': { id: 'node-7', style: { x: 200, y: 600 } },
  'node-8': { id: 'node-8', style: { x: 400, y: 600, size: [60, 20] } },
  'node-9': { id: 'node-9', style: { x: 100, y: 450 } },
  'node-10': { id: 'node-10', style: { x: 200, y: 450 } },
  'node-11': { id: 'node-11', style: { x: 400, y: 450, size: [60, 20] } },
  'node-12': { id: 'node-12', style: { x: 100, y: 580 } },
  'node-13': { id: 'node-13', style: { x: 300, y: 300, size: [120, 60] } },
};
const size = [30, 20];
register(ExtensionCategory.EDGE, 'fly-marker-cubic', FlyMarkerCubic);
onMounted(() => {
  graph = new Graph({
    container: container.value,
    behaviors: ['zoom-canvas'],
    autoFit: {
      type: 'center', // 自适应类型：'view' 或 'center'
      // options: {
      //   // 仅适用于 'view' 类型
      //   when: 'overflow', // 何时适配：'overflow'(仅当内容溢出时) 或 'always'(总是适配)
      //   direction: 'x', // 适配方向：'x'、'y' 或 'both'
      // },
      animation: {
        // 自适应动画效果
        duration: 1000, // 动画持续时间(毫秒)
        easing: 'ease-in-out', // 动画缓动函数
      },
    },
    data: {
      nodes: Object.values(nodeMap),
      edges: [
        {
          id: 'edge-1',
          source: 'node-0',
          target: 'node-6',
          style: {
            controlPoints: [
              // [50, 150],
              // [200, 150],
            ],
            animateOnCreate: true,
            duration: 500,
          },
        },
        {
          id: 'edge-2',
          source: 'node-6',
          target: 'node-13',
          style: {
            controlPoints: [
              [nodeMap['node-6'].style.x, nodeMap['node-13'].style.y],
            ],
            duration: 2500,
          },
        },
        {
          id: 'edge-3',
          source: 'node-1',
          target: 'node-9',
          style: {
            controlPoints: [
              [nodeMap['node-1'].style.x + size[0], nodeMap['node-1'].style.y],
              [nodeMap['node-9'].style.x + size[0], nodeMap['node-9'].style.y],
            ],
            animateOnCreate: true,
            duration: 1500,
          },
        },
        {
          id: 'edge-4',
          source: 'node-12',
          target: 'node-9',
          style: {
            animateOnCreate: true,
            duration: 1500,
          },
        },
        {
          id: 'edge-5',
          source: 'node-9',
          target: 'node-13',
          style: {
            controlPoints: [
              [nodeMap['node-9'].style.x, nodeMap['node-13'].style.y],
            ],
            duration: 1500,
          },
        },
        {
          id: 'edge-6',
          source: 'node-2',
          target: 'node-13',
          style: {
            controlPoints: [
              [nodeMap['node-2'].style.x, nodeMap['node-13'].style.y],
            ],
            animateOnCreate: true,
            duration: 3000,
          },
        },
        {
          id: 'edge-7',
          source: 'node-3',
          target: 'node-7',
          style: {
            animateOnCreate: true,
            duration: 500,
          },
        },
        {
          id: 'edge-8',
          source: 'node-7',
          target: 'node-10',
          style: {

            duration: 1000,
          }
        },
        {
          id: 'edge-9',
          source: 'node-10',
          target: 'node-13',
          style: {
            controlPoints: [
              [nodeMap['node-10'].style.x, nodeMap['node-13'].style.y],
            ],
            duration: 1500,
          },
        },
        {
          id: 'edge-10',
          source: 'node-4',
          target: 'node-11',
          style: {
            controlPoints: [
              [
                nodeMap['node-4'].style.x + nodeMap['node-4'].style.size[0],
                nodeMap['node-4'].style.y,
              ],
              [
                nodeMap['node-11'].style.x + nodeMap['node-11'].style.size[0],
                nodeMap['node-11'].style.y,
              ],
            ],
            animateOnCreate: true,
            duration: 1500,
          },
        },
        {
          id: 'edge-11',
          source: 'node-8',
          target: 'node-11',
          style: {
            animateOnCreate: true,
            duration: 1500,
          },
        },
        {
          id: 'edge-12',
          source: 'node-11',
          target: 'node-13',
          style: {
            controlPoints: [
              [nodeMap['node-11'].style.x, nodeMap['node-13'].style.y],
            ],
            duration: 1500,
          },
        },
        {
          id: 'edge-13',
          source: 'node-5',
          target: 'node-13',
          style: {
            controlPoints: [
              [nodeMap['node-5'].style.x, nodeMap['node-13'].style.y],
            ],
            animateOnCreate: true,
            duration: 3000,
          },
        },
      ],
    },
    edge: {
      type: 'fly-marker-cubic',
      style: {
        // lineDash: [4, 4],
        radius: 4,
      },
    },
    node: {
      type: 'rect',
      style: {
        labelText: (d) => d.id,
        size: (d) => {
          return d.style.size || [30, 20];
        },
      },
    },
  });

  graph.render();
  // graph.updateEdgeData([{id: 'edge-1', style: { lineWidth: 3, lineDash: [5,5] } }])
  // graph.draw()
  // console.log('1', 1);
});
</script>
<style scoped>
.container {
  height: 100vh;
}
</style>
