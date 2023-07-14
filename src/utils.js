// 组件属性转为配置对象，例如 audio.url='xxx' 转换为 audio: { url: 'xxx' }
export const parseObjectPath = (config, attrs) => {
  /**
   * 如果存在使用 . 深入的对象，递归创建
   * 只能解析对象深入，不能解析数组
   */
  if (attrs.length > 2) {
    if (!(attrs[0] in config)) {
      // 如果没有下一层，创建下一层
      config[attrs[0]] = {}
    }
    // 递归深入
    return parseObjectPath(config[attrs[0]], attrs.slice(1))
  }
  const keyName = toHump(attrs[0]) // 将属性名转换为驼峰
  const value = changeType(attrs[1]) // 将字符串转为数组或布尔
  config[keyName] = value // 深入到根节点后进行赋值
}

// 连字符转为驼峰
export const toHump = (str) => {
  return str.replace(/\-(\w)/g, function (all, letter) {
    return letter.toUpperCase()
  })
}

// 将组件属性值转换为布尔值或数值或字符串
export const changeType = (str) => {
  if (/true|false/.test(str)) {
    // 传入的是字符串类型的布尔值
    return str === 'false' ? false : true
  } else if (str !== '' && isFinite(str)) {
    // 传入的是字符串类型的数字
    // 或者使用 /^\d*(\d+\.?|\.?\d+)\d*$/.test(str) 判断
    return 1 * str
  } else {
    // 传入的是字符串
    return str
  }
}

// 获取URL文件的目录地址
export const getDirectoryFromUrl = (url) => {
  // 排除URL中的锚点
  url = url.split('#')[0]
  return url.substring(0, url.lastIndexOf('/') + 1)
}

// 拼接基准路径和相对路径
export const resolvePath = (basePath, relativePath) => {
  // 创建一个新的URL对象
  var url = new URL(relativePath, basePath)
  // 返回解析后的绝对路径
  return url.href
}

// 拼接配置文件的相对路径为url
export const getFileURL = (path, base) => {
  if (!base) {
    // 如果未传入基于哪个文件，就使用当前页面地址作为基准路径
    base = window.location.href
  } else {
    // 如果传入基于哪个文件，就获取该文件所在目录作为基准路径
    base = getDirectoryFromUrl(base)
  }

  return resolvePath(base, path)
}

// 使用Promise的ajax请求函数
export const ajaxRequest = (url, method, data) => {
  // 返回一个新的Promise对象
  return new Promise((resolve, reject) => {
    // 创建一个新的XMLHttpRequest对象
    var xhr = new XMLHttpRequest()
    // 初始化一个请求
    xhr.open(method, url, true)
    // 设置请求头的内容类型为JSON
    xhr.setRequestHeader('Content-Type', 'application/json')
    // 当请求的状态发生变化时执行的函数
    xhr.onreadystatechange = function () {
      // 当请求完成并且请求的状态码为200时
      if (xhr.readyState == 4 && xhr.status == 200) {
        // 将响应的文本转换为JSON对象，并通过resolve函数传递
        resolve(JSON.parse(xhr.responseText))
      } else if (xhr.readyState == 4) {
        // 当请求完成但状态码不为200时，通过reject函数传递错误信息
        reject(new Error(xhr.statusText))
      }
    }
    // 发送请求，请求体中的数据为字符串化的data
    xhr.send(JSON.stringify(data))
  })
}

// 获取 json 文件，并解析后返回
export const getJsonFile = async (url) => {
  return new Promise(async (resolve) => {
    try {
      const data = await ajaxRequest(url, 'GET')
      // 返回json数据
      resolve(data)
    } catch (err) {
      // 获取配置文件失败，返回空对象
      console.error(`请求"${url}"过程中发生错误`)
      resolve({})
    }
  })
}
