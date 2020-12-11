// 导入 mysql 模块
const mysql = require('mysql')

// 创建数据库连接对象
const db = mysql.createPool({
    host:'127.0.0.1',//路径
    user:'root',//名字
    password: 'admin123',//密码
    database: 'my_db_01',//数据库名字
})

// 向外共享 db 数据库连接对象
module.exports = db