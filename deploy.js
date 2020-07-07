const path = './dist/app.json'

const json = require(path)

json.pages.splice(json.pages.indexOf('pages/article/index'), 1, 'pages/appointment01/index')
json.pages.splice(json.pages.indexOf('pages/appointment/index'), 1, 'pages/article/index')
json.pages.splice(json.pages.indexOf('pages/appointment01/index'), 1, 'pages/appointment/index')

require('fs').writeFileSync(path, JSON.stringify(json))