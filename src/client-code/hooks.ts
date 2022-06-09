import VueRouter, { RawLocation, RouteConfig } from 'vue-router'

import { emitter } from './emitter'
import { TemplateOptions } from './options'

export const genAutoRoutesHooks = (
  autoRoutes: () => RouteConfig[],
  options: TemplateOptions
) => {
  return ({
    router,
    beforeAppendRoutes = (a) => a,
  }: {
    router: VueRouter
    beforeAppendRoutes: (rs: RouteConfig[]) => RouteConfig[]
  }) => {
    if (process.env.NODE_ENV === 'production') return
    const addRoutes = (rs: RouteConfig[]) => {
      rs.forEach((r) => {
        router.addRoute(r)
      })
    }

    router.beforeEach((to, _, next) => {
      if (to.matched.length) {
        next()
        return
      }
      const { name, path, params } = to
      const route = JSON.stringify({ name, path, params })
      fetch(
        `/${options.apiPath}?${options.apiParam}=${encodeURIComponent(route)}`
      )

      const callback = () => {
        emitter.off(callback)
        addRoutes(beforeAppendRoutes(autoRoutes()))
        const newTo = router.match(to as RawLocation)

        next({ ...newTo, replace: true } as RawLocation)
      }
      emitter.on(callback)
    })
  }
}
