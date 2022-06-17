import * as vueRouter from 'vue-router'

// 1. 定义路由组件
const EnterName = () => import('../pages/EnterName.vue')
const Main = () => import('../pages/Main.vue')

// 2. 定义路由
const routes = [
  { path: '/', name: 'EnterName', component: EnterName },
  { path: '/main', name: 'main', component: Main }
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = vueRouter.createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: vueRouter.createWebHashHistory(),
  routes // `routes: routes` 的缩写
})

export default router
