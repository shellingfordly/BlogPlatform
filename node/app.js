const mongoose = require('mongoose')
const koa = require('koa')
const fs = require('fs')
const path = require('path')
const router = require('koa-router')()
const cors = require('koa-cors')
const bodyParser = require('koa-bodyparser')

const app = new koa()
app.use(bodyParser())
// 跨域设置需要在路由配置之前
app.use(cors())

// 配置路由
app.use(router.routes()).use(router.allowedMethods())

const mockData = {}

// 读取文件夹路径
const mockPath = path.join(__dirname, 'mock')
// 读取文件夹内的文件名
const files = fs.readdirSync(mockPath)

files.forEach(item => {
  Object.assign(mockData, require(path.join(mockPath, item)))
})

// 配置路由
for (const key in mockData) {
  let [method, url] = key.split(' ')
  method = method.toLowerCase()
  router[method](url, mockData[key])
}


// 连接数据库
mongoose.connect('mongodb://localhost:27017/users', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log("数据库连接成功")

  app.listen(3000, () => {
    console.log("3000端口已开启")
  })

}).catch(() => {
  console.log("数据库连接失败")
})