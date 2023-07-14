import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0'
  },
  build: {
    lib: {
      entry: './src/main.js',
      formats: ['iife', 'umd'],
      name: 'parseAplayerComponents',
      fileName: 'parseAplayerComponents'
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['aplayer', 'aplayer/dist/APlayer.min.css'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          aplayer: 'APlayer'
        }
      }
    }
  }
})
