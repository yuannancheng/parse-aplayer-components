// 导入开发时使用的aplayer库，构建时会排除
import 'aplayer/dist/APlayer.min.css'
import APlayer from 'aplayer'

import { parseObjectPath } from './utils'
import { parseConfig } from './parseConfig'

// 组件转为 APlayer
export const initAPlayer = async (APlayerComponent, element) => {
  // 组件配置
  const componentConfig = {}
  // 组件配置项
  const attrs = APlayerComponent.attributes
  // 将组件属性转为配置
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i]
    parseObjectPath(componentConfig, attr.name.split('.').concat(attr.value)) // 递归处理使用 . 深入的对象
  }

  // 组件中是否存在 audio 属性，如果存在，则不解析配置文件中的 audio 属性
  const parseAudioAttr = !componentConfig['audio']
  // 配置文件配置
  const configFile = await parseConfig(componentConfig['config'], parseAudioAttr)

  // 移除组件传入的 config 属性
  delete componentConfig['config']

  // 最终合并的配置（传给 APlayer 的配置）
  const config = {
    ...configFile, // 配置文件配置
    ...componentConfig, // 组件传值配置
    container: element // 容器
  }

  console.log(config)

  new APlayer(config)
}
