import { RouteConfig } from 'vue-router'
import { genAutoRoutesHooks } from './client-code/hooks'

declare const autoRoutes: RouteConfig[]
declare const autoRoutesHooks: ReturnType<typeof genAutoRoutesHooks>

export { autoRoutes as default, autoRoutesHooks }
