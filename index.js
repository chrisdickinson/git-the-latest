#!/usr/bin/env node
'use strict'
const { spawnSync } = require('child_process')
const path = require('path')
const fs = require('fs')
const os = require('os')
const mv = require('mv')

const dir = path.join(os.homedir(), '.git-template')
if (fs.existsSync(dir)) {
  console.error('Template already exists. Run "rm -rf ~/.git-template" and re-run to upgrade.')
  return process.exit(1)
}

const prefix = path.join(os.tmpdir(), 'git-template-')
const tmp = fs.mkdtempSync(prefix)

spawnSync('git', ['init'], {
  cwd: tmp
})

fs.writeFileSync(path.join(tmp, '.git', 'HEAD'), 'ref: refs/heads/latest')
mv(path.join(tmp, '.git'), dir, err => {
  if (err) {
    throw err
  }

  spawnSync('git', ['config', '--global', '--unset-all', 'init.templateDir'])
  spawnSync('git', ['config', '--global', '--add', 'init.templateDir', dir])
})
