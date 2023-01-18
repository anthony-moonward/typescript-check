import {exec} from '@actions/exec'
import * as core from '@actions/core'
import ts from 'typescript'
import {dirname, join} from 'path'
import {validateTsConfig} from './validate-ts-config'

const workingDir = process.cwd()

async function main(): Promise<void> {
  const compilerOptions = getTsCompilerOptions()
  if (!compilerOptions) {
    core.error('unable to locate tsconfig.json')
    return
  }
  validateTsConfig(compilerOptions)

  await exec('npx tsc --noEmit', undefined, {
    failOnStdErr: false
  })
}

function getTsCompilerOptions(): ts.CompilerOptions | undefined {
  const configFilePath = ts.findConfigFile(workingDir, ts.sys.fileExists)
  if (!configFilePath) return
  const configFile = ts.readConfigFile(configFilePath, ts.sys.readFile)

  const {options} = ts.parseJsonConfigFileContent(configFile.config, ts.sys, workingDir)

  return options
}

main()
