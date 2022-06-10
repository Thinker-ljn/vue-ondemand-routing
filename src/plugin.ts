import assert from 'assert'
import { generateRoutes } from './generator'
import VirtualModulesPlugin from 'webpack-virtual-modules'
import { Compiler } from 'webpack'
import { RawLocation } from 'vue-router'
import { genOptions } from './client-code/options'
import { genTemplate } from './client-code'
import path from 'path'
import { VueOndemandRoutingPluginOptions } from './type'

const ENTRY_FILE_PATH = path.resolve(__dirname, './index.js')
const DEFINITION_FILE_PATH = path.resolve(__dirname, './definitions.js')
const pluginName = 'VueOndemandRoutingPlugin'
export default class VueOndemandRoutingPlugin {
  public options: VueOndemandRoutingPluginOptions
  public virtualModules: VirtualModulesPlugin
  public routesModulePath: string
  constructor(options: VueOndemandRoutingPluginOptions) {
    assert(options.pages, '`pages` is required')
    this.options = options
    const templateOptions = genOptions(options)
    this.routesModulePath = templateOptions.routesModulePath
    this.virtualModules = new VirtualModulesPlugin({
      [ENTRY_FILE_PATH]: genTemplate(templateOptions),
      [this.routesModulePath]: 'export default []',
      [DEFINITION_FILE_PATH]: 'export default []',
    })
  }

  apply(compiler: Compiler) {
    this.virtualModules.apply(compiler)
    if (process.env.NODE_ENV === 'production') {
      compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
        try {
          this.generate()
        } catch (error) {
          compilation.errors.push(error)
        }
      })
    }
  }

  generate(route?: RawLocation) {
    const code = generateRoutes(this.options, route)
    this.virtualModules.writeModule(this.routesModulePath, code.routeFullCodes)
    this.virtualModules.writeModule(
      DEFINITION_FILE_PATH,
      code.routeFullDefinitionsCode
    )
  }

  middleware(app: any) {
    app.get('/__ondemand_routing', (req: any, res: any) => {
      const route = JSON.parse(req.query['route']) as RawLocation
      try {
        this.generate(route)
      } catch (e) {
        console.log(e)
      }
      res.json({ msg: 'ok' })
    })
  }
}
