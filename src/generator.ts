import { createRoutes } from 'vue-route-generator/lib/template/routes'
import { PageMeta, resolveRoutePaths } from 'vue-route-generator/lib/resolve'
import cached from './cached'
import fs from 'fs'
import path from 'path'
import fg from 'fast-glob'
import { RawLocation } from 'vue-router'
import { VueOndemandRoutingPluginOptions } from './type'

export function generateRoutes(
  {
    pages,
    importPrefix = '@/pages/',
    dynamicImport = true,
    chunkNamePrefix = '',
    nested = false,
    forceFull = false,
  }: VueOndemandRoutingPluginOptions,
  visitRoute: RawLocation | null = null
) {
  const patterns = ['**/*.vue', '!**/__*__.vue', '!**/__*__/**']

  const pagePaths = fg.sync(patterns, {
    cwd: pages,
    onlyFiles: true,
  })

  const routeFullDefinitions = resolveRoutePaths(
    pagePaths,
    importPrefix,
    nested,
    (file) => {
      return fs.readFileSync(path.join(pages, file), 'utf8')
    }
  )

  const routeFullDefinitionsCode = `export default ${JSON.stringify(
    routeFullDefinitions,
    null,
    2
  )}`

  const routesCodeGenerator = (visitPageMetas: PageMeta[]) =>
    createRoutes(visitPageMetas, dynamicImport, chunkNamePrefix)

  const currCached = cached(routeFullDefinitions)

  if (visitRoute) {
    currCached.visit(visitRoute)
  }

  const routeFullCodes = routesCodeGenerator(currCached.filter(forceFull))

  return {
    routeFullDefinitions,
    routeFullCodes,
    routeFullDefinitionsCode,
  }
}
