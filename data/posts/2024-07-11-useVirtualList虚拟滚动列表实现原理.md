---
title: "usevirtuallist虚拟滚动列表实现原理"
subtitle: "基于Vue useVirtualList 分析虚拟滚动列表的实现与原理"
summary: ""
coverURL: ""
time: "2024-07-11"
tags: ["javascript","vue"]
noPrompt: false
pin: false
allowShare: true
closed: false
---

## 简介

基于Vue `useVirtualList` 分析虚拟滚动列表的实现与原理。

## 实现原理

```jsx
<template>
  <div v-bind="containerProps" style="height: 300px">
    <div v-bind="wrapperProps">
      <div v-for="item in list" :key="item.index" style="width: 200px">
        Row: {{ item.data }}
      </div>
    </div>
  </div>
</template>
```

通过看示例代码，发现滚动列表的具有几个要点:

- `containerProps` 外部容器，具有固定的高度或宽度
- `wrapperProps` 内容容器，具有列表真实的高度
- `list` 当前可见区域的渲染列表
- `itemHeight` 行高度，可以静态高度，动态高度需传入函数
- `overscan` 视区上、下缓存展示的DOM节点数量

源代码

```jsx
export function useVirtualList<T = any>(list: MaybeRef<T[]>, options: UseVirtualListOptions): UseVirtualListReturn<T> {
  const { containerStyle, wrapperProps, scrollTo, calculateRange, currentList, containerRef } = 'itemHeight' in options
    ? useVerticalVirtualList(options, list)
    : useHorizontalVirtualList(options, list)

  return {
    list: currentList,
    scrollTo,
    containerProps: {
      ref: containerRef,
      onScroll: () => {
        calculateRange()
      },
      style: containerStyle,
    },
    wrapperProps,
  }
}
```

源代码中会返回几个参数：

- list
- scrollTo
- containerProps: {}
- wrapperProps: {}

其中可看到containerProps中，ref为绑定的DOM 引用， onScroll监听滚动事件,

其中的onScroll事件的函数回调为核心

查看参数返回函数

```jsx
function useVerticalVirtualList<T>(options: UseVerticalVirtualListOptions, list: MaybeRef<T[]>) {
  const resources = useVirtualListResources(list)

  const { state, source, currentList, size, containerRef } = resources

  const containerStyle: StyleValue = { overflowY: 'auto' }

  const { itemHeight, overscan = 5 } = options

  const getViewCapacity = createGetViewCapacity(state, source, itemHeight)

  const getOffset = createGetOffset(source, itemHeight)

  const calculateRange = createCalculateRange('vertical', overscan, getOffset, getViewCapacity, resources)
  // 获取开始 子项开始索引到顶部的距离
  const getDistanceTop = createGetDistance(itemHeight, source)
  // 这个也就是marginTop
  const offsetTop = computed(() => getDistanceTop(state.value.start))
  // 总所有子项加起来的高度
  const totalHeight = createComputedTotalSize(itemHeight, source)
  // 监听外层容器的size有变化，或 列表数据有变化时，重新计算范围
  useWatchForSizes(size, list, calculateRange)
  // 计算滚动距离scrollTop
  const scrollTo = createScrollTo('vertical', calculateRange, getDistanceTop, containerRef)

  // 包裹层wrapper
  const wrapperProps = computed(() => {
    return {
      style: {
        width: '100%',
        height: `${totalHeight.value - offsetTop.value}px`,
        marginTop: `${offsetTop.value}px`,
      },
    }
  })

  return {
    calculateRange,
    scrollTo,
    containerStyle,
    wrapperProps,
    currentList,
    containerRef,
  }
}
```

通过源代码可以看到几个参数的函数：

1. wrapperProps 会计算出原列表的总高度以及marginTop。
    1. `height` 为实际高度。目的是可以生成滚动条。
    2. `marginTop` 外边距。目的是为了把渲染区域的列表可以在外部容器中展示。因为，当内部容器开始进行切割只渲染可视区域的列表时，默认情况下，列表的scrollTop都会是0，也就是会在内容容器的顶部展示下来。计算marginTop是为了把顶部的渲染列表，对齐外部容器布局。

继续查看 `calculateRange()` 

```jsx
function createCalculateRange<T>(type: 'horizontal' | 'vertical', overscan: number, getOffset: ReturnType<typeof createGetOffset>, getViewCapacity: ReturnType<typeof createGetViewCapacity>, { containerRef, state, currentList, source }: UseVirtualListResources<T>) {
  return () => {
    const element = containerRef.value
    if (element) {
      const offset = getOffset(type === 'vertical' ? element.scrollTop : element.scrollLeft)
      // 可见视图中，能看到的个数，例如： viewCapacity = 12
      const viewCapacity = getViewCapacity(type === 'vertical' ? element.clientHeight : element.clientWidth)
      // 计算包含缓存区域后的第一个子项下表
      const from = offset - overscan
      // 包含缓冲区后，最后一个子项的位置
      const to = offset + viewCapacity + overscan
      // 记录最新的可见区域的状态位置
      state.value = {
        start: from < 0 ? 0 : from,
        end: to > source.value.length
          ? source.value.length
          : to,
      }
      currentList.value = source.value
        .slice(state.value.start, state.value.end)
        .map((ele, index) => ({
          data: ele,
          index: index + state.value.start,
        }))
    }
  }
}
```

从代码中可看到，这段函数的核心为计算可视区域(container)中的当前能被渲染的列表，其中包含有的参数：

1. offset: 已经“滚动” 过的列表项个数
2. from: 渲染列表的第一个下标
3. end: 渲染列表的最后一个子项下标
4. currentList： 完整的渲染列表

每次通过监听滚动事件，对渲染列表的个数重新计算：

1. 计算可见区域列表的个数 `getViewCapacity` 
2. 计算偏移个数函数 `getOffset` 
3. 计算顶部距离 `offsetTop`
4. 监听 容器大小变更、list数据变更，重新计算
5. 外部可以调用一个 scrollTo函数
6. 计算内容容器的 `height`  `marginTop` 

![图一](https://jimhug-blog.oss-cn-beijing.aliyuncs.com/virtual.png)
