import VueRouter, { RawLocation } from 'vue-router'
import { PageMeta } from 'vue-route-generator/lib/resolve'
const isProd = process.env.NODE_ENV === 'production'
const visitCached: Record<string, boolean> = {}

function toRouteRecords(pageMetas: PageMeta[]) {
  return pageMetas.map((m) => ({
    name: m.name,
    path: m.path,
    component: {},
    ...(m.route || {}),
  }))
}

export default function cached(pageMetas: PageMeta[]) {
  const router = new VueRouter({
    routes: toRouteRecords(pageMetas),
  })
  function filterpageMetas(full = false) {
    return isProd || full
      ? pageMetas
      : pageMetas.filter((meta) => visitCached[meta.path])
  }

  function setVisit(visitRoute: RawLocation) {
    const route = router.match(visitRoute)
    if (route && route.matched) {
      route.matched.forEach((r) => {
        visitCached[r.path] = true
      })
    }
  }

  return {
    filter: filterpageMetas,
    visit: setVisit,
  }
}
