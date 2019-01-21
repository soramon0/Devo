const withLess = require('@zeit/next-less')
const lessToJs = require('less-vars-to-js')
const fs = require('fs')
const path = require('path')

// where the antd.custom.less variables file lives
const themeVariables = lessToJs(
  fs.readFileSync(
    path.resolve(__dirname, './client/assets/less/antd-custom.less'),
    'utf8'
  )
)

// fix error when the less files are required by node, ie: server
if (typeof require !== 'undefined') {
  require.extensions['.less'] = file => {}
}

module.exports = withLess({
  lessLoaderOptions: {
    javascriptEnabled: true,
    modifyVars: themeVariables
  }
})
