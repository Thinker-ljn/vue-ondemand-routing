# vue-ondemand-routing 按需路由加载

## 背景

最近一直在用 [`Vite`](https://vitejs.dev/) 开发，其基于原生 `ES` 模块，无需构建直接由浏览器来加载模块，启动速度很快，开发体验极好。所以想试试在 `Webpack` 中能否做到类似的事情，使用 `Webpack`，编译是无法避免的，所以本插件只是基于路由按需加载编译。

## 实现

内部使用了 [vue-route-generator](https://github.com/ktsn/vue-route-generator) 来生成已访问过的路由定义，开发模式下首次编译生成空的路由组件，只加载入口文件所导入的模块，后续在前端应用拦截 vue-router 的跳转，加载新的路由，生产模式下打包所有路由。

## 限制

只适用于 `Webpack v4 + Vue v2 + Vue Router v3`，其实可以直接用 [`Vite`](https://vitejs.dev/)...

使用了 [vue-route-generator](https://github.com/ktsn/vue-route-generator) 根据文件路径自动生成路由，无法手动添加动态路由（手动添加的路由不可以按需加载）。

## 安装与使用 

```
npm install vue-ondemand-routing -D
yarn add vue-ondemand-routing -D
```

```js
// in vue.config.js
const { default: VueOndemandRoutingPlugin } = require('vue-ondemand-routing/plugin')
const vueOndemandRoutingPlugin = new VueOndemandRoutingPlugin({
  pages: 'src/views',
  importPrefix: '@/views/'
})

module.exports = {
  configureWebpack: {
    plugins: [vueOndemandRoutingPlugin]
  },
  devServer: {
    before(app) {
      vueOndemandRoutingPlugin.middleware(app)
    }
  }
}
```

```js
// router.js
import autoRoutes, { autoRoutesHooks } from 'vue-ondemand-routing'
import VueRouter from 'vue-router'

const router = new VueRouter({
  routes: autoRoutes
})

// 拦截路由
autoRoutesHooks({
  router,
  /* 可对路由进行修改 */
  beforeAppendRoutes: (routes) => routes
})

export default router
```

## 全量的路由定义

```js
// 此文件（由vue-route-generator）生成了全量的路由定义，如果你需要用的话
import fullDefinitions from 'vue-ondemand-routing/dist/definitions'
console.log(fullDefinitions)
```

## 参数

支持 [vue-route-generator](https://github.com/ktsn/vue-route-generator) 的所有选项，基本上只需要配置 `vue-route-generator` 的选项即可。

以下是额外的参数：

### routesModulePath: string

  指定由 [vue-route-generator](https://github.com/ktsn/vue-route-generator) 生成的路由定义文件路径，（由[webpack-virtual-modules](https://github.com/sysgears/webpack-virtual-modules)生成的虚拟文件），一般来说无需修改。

  默认是 `node_modules/vue-ondemand-routing/dist/auto-routes.js`

### apiPath: string

前端页面访问新的路由时，向开发服务器发送的请求路径，用于生成新的路由定义，一般来说无需修改。

默认是 `__ondemand_routing`

### apiParam: string

`apiPath` 的请求参数，一般来说无需修改。

默认是 `route`，与 `apiPath` 组成：`__ondemand_routing?route=xxxxx`
  
### forceFull: boolean

是否强制在开发模式下生成全量路由定义，一般来说无需修改。

默认 `false`

## 成果

对于一些路由特别多的项目效果不错，我的 `100+` 路由的项目，每次开发就只开发一两个路由，首次构建可以降低 `70%` 左右，访问新路由时，构建 `2 ~ 3` 秒，和路由引用的文件大小有关。总体来说，对开发阶段来说节省了不少时间。
