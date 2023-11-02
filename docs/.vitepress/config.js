import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'parseAplayerComponents',
  description: '使用自定义组件快速配置APlayer播放器',
  base: '/parse-aplayer-components/',
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yuannancheng/parse-aplayer-components' }
    ]
  },
  vue: {
    template: {
      // 配置自定义组件
      compilerOptions: {
        isCustomElement: (tag) => ['aplayer'].includes(tag)
      }
    }
  }
})
