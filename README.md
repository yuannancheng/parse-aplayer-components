
# parseAplayerComponents

## 简介

使用自定义组件快速配置 APlayer 播放器

支持使用配置文件

可以用于 WordPress 博客文章中

不支持APlayer的[MSE模式](https://aplayer.js.org/#/zh-Hans/?id=mse-%E6%94%AF%E6%8C%81)

演示地址：<https://yuannancheng.github.io/parse-aplayer-components/>

## 入门

```html
<!-- 加载 APlayer 库文件 -->
<link rel="stylesheet" href="lib/APlayer.min.css">
<script src="lib/APlayer.min.js"></script>

<!-- 自定义组件 -->
<aplayer
  autoplay="false"
  preload="none"
  loop="none"
  lrc-type="3"
  volume="1"
  audio.name="笼"
  audio.artist="张碧晨"
  audio.url="api/music/笼/audio.mp3"
  audio.cover="api/music/笼/pic.jpg"
  audio.lrc="api/music/笼/lrc.lrc"
></aplayer>

<!-- 在末尾加载本插件进行自定义组件解析并生成 APlayer 播放器 -->
<script type="text/javascript" src="./dist/parseAplayerComponents.iife.js"></script>
```


## 后端配置

你可以很轻松搭建一个简单的后端支持，下面是一个示例结构，你只需要开启静态资源服务器就可以正常使用：

```
api
├── aplayer.config.base.json
├── music
│   ├── 好久不见
│   │   ├── audio.mp3
│   │   ├── index.json
│   │   ├── lrc.lrc
│   │   └── pic.jpg
│   ├── 星空
│   │   ├── audio.mp3
│   │   ├── index.json
│   │   ├── lrc.lrc
│   │   └── pic.jpg
│   ├── 星空（Live）
│   │   ├── audio.mp3
│   │   ├── index.json
│   │   ├── lrc.lrc
│   │   └── pic.jpg
│   ├── 春娇与志明
│   │   ├── audio.mp3
│   │   ├── index.json
│   │   ├── lrc.lrc
│   │   └── pic.jpg
│   ├── 童年
│   │   ├── audio.mp3
│   │   ├── index.json
│   │   ├── lrc.lrc
│   │   └── pic.jpg
│   └── 笼
│       ├── audio.mp3
│       ├── index.json
│       ├── lrc.lrc
│       └── pic.jpg
└── play-list
    ├── list1-and-list2.json
    ├── list1.json
    └── list2.json
```

在[此处](https://github.com/yuannancheng/parse-aplayer-components/tree/main/docs/api)你可以看到上面配置的源码

所有 `.json` 格式的文件都是一个配置文件，兼容 [APlayer的参数列表](https://aplayer.js.org/#/zh-Hans/?id=%E5%8F%82%E6%95%B0)，并额外允许一个字段：`extends`

使用 `extends` 字段可以引用另一个配置文件，如果存在相同属性将会覆盖掉 `extends` 配置文件里的配置，这其实借鉴了 `tsconfig.json` 的 `extends` 配置

配置文件中允许使用相对路径，例如 `api/play-list/list1.json`：

```json
{
  "extends": "../aplayer.config.base.json",
  "audio": [
    "../music/笼/index.json",
    {
      "name": "童年",
      "artist": "张震岳",
      "url": "../music/童年/audio.mp3",
      "cover": "../music/童年/pic.jpg",
      "lrc": "../music/童年/lrc.lrc"
    },
    "../music/星空/index.json"
  ]
}
```

甚至你还可以在配置文件中引用多个播放列表配置文件，从而合并为一个新的播放列表。例如 `api/play-list/list1-and-list2.json`：

```json
{
  "extends": "../aplayer.config.base.json",
  "audio": [
    "./list1.json",
    "./list2.json"
  ]
}
```

但是为了避免陷入循环引用，做了以下规定：

- 当本级或者父级配置中存在 `audio` 字段，`extends` 字段中引用的配置文件仅会加载除了 `audio` 属性以外的属性
- `audio` 字段中引用的配置文件仅会加载 `audio` 属性，而不加载其他属性

## 示例

### 完全使用组件传值配置单首歌曲

使用组件属性传值方式只能配置单首歌曲，不支持配置播放列表

```html
<aplayer
  autoplay="false"
  preload="none"
  loop="none"
  lrc-type="3"
  volume="1"
  audio.name="笼"
  audio.artist="张碧晨"
  audio.url="api/music/笼/audio.mp3"
  audio.cover="api/music/笼/pic.jpg"
  audio.lrc="api/music/笼/lrc.lrc"
></aplayer>
```

### 部分使用组件传值配置单首歌曲

组件配置会覆盖配置文件配置，只要配置了 `audio` 属性，就会覆盖配置文件中的audio属性（即不支持配置播放列表）

```html
<aplayer
  config="api/play-list/list1.json"
  volume="0.3"
  audio.name="笼"
  audio.artist="张碧晨"
  audio.url="api/music/笼/audio.mp3"
  audio.cover="api/music/笼/pic.jpg"
  audio.lrc="api/music/笼/lrc.lrc"
></aplayer>
```

### 部分使用组件传值配置播放列表

组件配置会覆盖配置文件配置

```html
<aplayer config="api/music/笼/index.json" volume="0.3"></aplayer>
```

### 完全使用配置文件配置单首歌曲

```html
<aplayer config="api/music/笼/index.json"></aplayer>
```

### 完全使用配置文件配置播放列表

```html
<aplayer config="api/play-list/list1.json"></aplayer>
```

### 完全使用配置文件配置播放列表-嵌套

播放列表可以嵌套播放列表

```html
<aplayer config="api/play-list/list1-and-list2.json"></aplayer>
```

## 在 WordPress 中使用

### 加载库文件

使用WordPress插件[页眉&页脚代码](https://urosevic.net/wordpress/plugins/head-footer-code/)在页眉加载 APlayer 的 js 和 css 库文件，并在页脚加载 [parseAplayerComponents 的库文件](https://github.com/yuannancheng/parse-aplayer-components/tree/main/dist/parseAplayerComponents.iife.js)

### 在文章中使用

可参考上面的示例

```html
<aplayer config="api/music/笼/index.json"></aplayer>
```

