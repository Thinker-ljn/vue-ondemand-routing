import path from 'path'

export interface TemplateOptions {
  routesModulePath: string
  apiPath: string
  apiParam: string
}

const ROUTES_MODULE_PATH = path.resolve(__dirname, './auto-routes.js')

export function genOptions(options: Partial<TemplateOptions>): TemplateOptions {
  return {
    // relative to process.cwd()
    routesModulePath: options.routesModulePath || ROUTES_MODULE_PATH,
    apiPath: options.apiPath || '__ondemand_routing',
    apiParam: options.apiParam || 'route',
  }
}
