/**
 * 解析 APlayer 组件，配置通过组件属性传值方式传递，不支持播放列表
 */

import { initAPlayer } from './parseAplayer'

export default (function () {
  // 获取页面中所有 aplayer 组件
  const components = document.querySelectorAll('aplayer')

  // 逐一解析为 APlayer 播放控件
  for (let i = 0; i < components.length; i++) {
    // 将页面 aplayer 组件替换为 div 元素
    const APlayerComponent = components[i]
    const div = document.createElement('div')
    div.id = 'APlayer_' + Math.random().toString(36).slice(-7)
    APlayerComponent.parentElement.replaceChild(div, APlayerComponent)

    // 初始化 APlayer
    initAPlayer(APlayerComponent, div)
  }
})()
