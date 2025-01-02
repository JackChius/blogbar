import { defineConfig } from 'vitepress'
import AutoSidebar from 'vite-plugin-vitepress-auto-sidebar';


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Dunye blog",
  description: "A blog site with dunye",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
     logo: '/avatar.png' ,// 表示docs/public/avartar.png
    nav: [
      { text: '记录', link: '/' },
      { text: '项目', link: '/guide/' }
    ],

    // sidebar: [
    //   {
    //     text: '开始',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' }
    //     ]
    //   },
    //   {
    //     text: '专栏',
    //     items: [
    //       { text: '测试1', link: '/guide/' },
    //       { text: 'V工具箱', link: '/guide/V工具箱' }
    //     ]
    //   }
    // ],

    socialLinks: [
      { icon: 'gitee', link: 'https://gitee.com/dunye' }
    ],
    search: {
       provider: 'local'
      },
      
  },
  vite: {
    plugins: [
      // add plugin
      AutoSidebar({
        // You can also set options to adjust sidebar data
        // see option document below
        ignoreIndexItem: true
      })
    ]
  },
})
