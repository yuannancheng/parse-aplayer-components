import { getJsonFile, getFileURL } from './utils'

/**
 * 加载并解析组件传入的配置文件
 *
 * @param {string | undefined} configPath
 * @param {boolean} parseAudioAttr
 * @returns
 */
export const parseConfig = async (configPath, parseAudioAttr, base = null) => {
  return new Promise(async (resolve) => {
    // 配置文件不存在或者错误
    if (configPath === undefined || configPath === '' || !configPath.endsWith('.json')) {
      return resolve({})
    }

    // 根据当前配置文件得到url和基准路径，并更新引用配置文件的基准路径
    const url = getFileURL(configPath, base)
    base = url

    // 加载配置文件，并解析为配置对象
    const selfConfig = await getJsonFile(url)

    // 父级配置或者本级配置文件中是否存在 audio 属性，如果存在，则不解析引用配置文件中的 audio 属性
    const parseExtendsAudioAttr = parseAudioAttr && !selfConfig['audio']

    // 加载配置文件中的 extends 属性，并解析为基础配置对象
    const extendsConfig = await parseConfig(selfConfig['extends'], parseExtendsAudioAttr, base)

    // 合并基础配置对象和配置对象
    const config = {
      ...extendsConfig,
      ...selfConfig
    }

    // 根据组件是否传 audio 属性决定是否加载配置文件中的 audio 配置
    if (parseAudioAttr) {
      // 遍历配置文件中的 audio 属性
      /**
       * 如果配置对象的 audio 属性的值是字符串，说明是引用的配置文件
       * 则加载该配置文件，但只解析其中的 audio 属性，并降为1维数组合并至配置对象的 audio 数组里
       */
      const extendsAudioConfig = await parseAudioConfig(config, config['audio'], base)
      config['audio'] = extendsAudioConfig
    }

    // 移除 extends 属性
    delete config['extends']

    // 导出合并后的配置给上一级
    resolve(config)
  })
}

/**
 * 需要的工具函数：
 *  1 获取文件的基准路径的函数
 *  1 拼接基准路径并处理 . 和 .. 相对定位路径符的函数
 *  1 发起 ajax 的函数
 *    深入遍历 audio 属性的函数
 */

async function parseAudioConfig(config, audioConfig, base = null) {
  return new Promise(async (resolve) => {
    /**
     * 如果 config 不存在，返回空数组
     * 用于兼容 audio 引用的配置文件中无 audio 属性的情况
     */
    if (audioConfig === undefined) {
      return resolve([])
    }
    // 用于存储处理后的 audio 配置
    const selfConfig = []

    for (const item of audioConfig) {
      // 遍历 audio 数组的每一项
      // 判断当前配置项类型
      if (typeof item === 'string') {
        // 配置文件不存在或者错误
        if (item === '' || !item.endsWith('.json')) {
          return resolve()
        }

        /**
         * 当前配置项是一个正确的配置文件的引用地址
         * 进行加载并解析后再加入返回列表
         */

        // 根据当前配置文件得到url和基准路径，并更新引用配置文件的基准路径
        const url = getFileURL(item, base)
        // 当前配置文件的路径，用于处理相对路径
        const selfBase = url

        // 加载配置文件，并解析为配置对象
        const extendsConfig = await getJsonFile(url)

        // 获取 json 文件失败，得到的 config 是 {}
        if (Object.keys(extendsConfig).length === 0) {
          return resolve()
        }

        // 将配置文件对象进行深入解构
        const parsedExtendsConfig = await parseAudioConfig(config, extendsConfig['audio'], selfBase)
        // 将配置文件中的相对引用处理成url
        parsedExtendsConfig.forEach((extendsConfigItem) => {
          parseRelativePath(config, extendsConfigItem, selfBase)
        })
        // 将引用的配置文件中的audio列表追加到当前列表中
        selfConfig.push(...parsedExtendsConfig)
      } else {
        // 当前配置项是一个标准 APlayer.audio 配置项，处理url后直接加入返回列表中
        parseRelativePath(config, item, base)
        selfConfig.push(item)
      }
    }

    // 返回处理后的audio配置
    resolve(selfConfig)
  })
}

function parseRelativePath(config, item, base) {
  // 需要处理的属性
  const link = ['url', 'cover']
  if (config['lrcType'] === 3) {
    // 如果歌词形式为链接，那么歌词地址也需要进行处理
    link.push('lrc')
  }

  for (const key in item) {
    if (item.hasOwnProperty(key)) {
      // 排除原型属性
      if (link.includes(key)) {
        // 如果属性在处理列表中，进行相对路径转换
        item[key] = getFileURL(item[key], base)
      }
    }
  }
}
