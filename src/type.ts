import { GenerateConfig } from 'vue-route-generator'
import { TemplateOptions } from './client-code/options'

export type VueOndemandRoutingPluginOptions = GenerateConfig &
  Partial<TemplateOptions> & {
    forceFull?: boolean
  }
