// ABOUTME: Vite plugin that reads site-level configuration from YAML.
// ABOUTME: Provides virtual:site-config for use in the app.

import type { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

const CONFIG_FILE = 'content/site.yaml'
const VIRTUAL_CONFIG = 'virtual:site-config'
const RESOLVED_CONFIG = '\0' + VIRTUAL_CONFIG

export interface SiteConfigData {
  heroImage: string
}

export default function siteConfigPlugin(): Plugin {
  let configFilePath: string

  return {
    name: 'site-config',

    configResolved(config) {
      configFilePath = path.resolve(config.root, CONFIG_FILE)
    },

    resolveId(id) {
      if (id === VIRTUAL_CONFIG) return RESOLVED_CONFIG
    },

    load(id) {
      if (id === RESOLVED_CONFIG) {
        const content = fs.existsSync(configFilePath)
          ? fs.readFileSync(configFilePath, 'utf-8')
          : ''
        const config = content.trim()
          ? (yaml.load(content) as SiteConfigData)
          : { heroImage: '' }
        return `export default ${JSON.stringify(config)}`
      }
    },

    configureServer(server) {
      server.watcher.add(path.dirname(configFilePath))
      server.watcher.on('change', (changedPath) => {
        if (changedPath === configFilePath) {
          const mod = server.moduleGraph.getModuleById(RESOLVED_CONFIG)
          if (mod) server.moduleGraph.invalidateModule(mod)
          server.ws.send({ type: 'full-reload' })
        }
      })
    },
  }
}
