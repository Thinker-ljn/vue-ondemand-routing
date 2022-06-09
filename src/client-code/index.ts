import { TemplateOptions } from './options'
import os from 'os'
import path from 'path'
export function slash(p: string): string {
  return p.replace(/\\/g, '/')
}

export const isWindows = os.platform() === 'win32'
export function normalizePath(id: string) {
  return path.posix.normalize(isWindows ? slash(id) : id)
}
export function genTemplate(opts: TemplateOptions) {
  const hooks = normalizePath(require.resolve('vue-ondemand-routing/hooks'))
  const emitter = normalizePath(require.resolve('vue-ondemand-routing/emitter'))
  const routesModulePath = normalizePath(path.resolve(opts.routesModulePath))

  return `
  import autoRoutes from '${routesModulePath}'
  import { emitter } from '${emitter}'
  import { genAutoRoutesHooks } from '${hooks}'

  if (module.hot) {
    module.hot.accept('${routesModulePath}', () => {
      emitter.emit()
    })
  }

  export const autoRoutesHooks = genAutoRoutesHooks(
    () => autoRoutes,
    ${JSON.stringify(opts)}
  )

  export default autoRoutes
`
}
