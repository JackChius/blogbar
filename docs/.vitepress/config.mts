import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Dunye blog",
  description: "A blog site with dunye",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '记录', link: '/' },
      { text: '项目', link: '/guide/' }
    ],

    sidebar: [
      {
        text: '开始',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      },
      {
        text: '专栏',
        items: [
          { text: '测试1', link: '/guide/' },
          { text: '测试2', link: '/guide/tool box make myself' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
