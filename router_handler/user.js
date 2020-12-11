/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */

//导入数据库操作模块：
const db = require('../db/index')
//导入bcryptjs
const bcrypt = require('bcryptjs')
// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken')
// 导入配置文件
const config = require('../config')
//定义 SQL 语句
const sql = `select * from ev_users where username = ?`
// 注册用户的处理函数
exports.regUser = (req, res) => {
    // 接收表单数据
    const userinfo = req.body
    // console.log(req.body);
    // 判断数据是否合法
    /*  if (!userinfo.username || !userinfo.password){
         // return res.send({status:1,message:'用户名或密码不能为空！' })
         return res.cc('用户名或密码不能为空！')
     } */
    //执行语句判断
    db.query(sql, [userinfo.username], (err, results) => {
        // 执行 SQL 语句失败
        if (err) {
            // return res.send({status:1,message:err.message})
            return res.cc(err)
        }
        // 用户名被占用
        if (results.length > 0) {
            // return res.send({ status: 1, message: '用户名被占用，请更换其他用户名！' })
            return res.cc('用户名被占用，请更换其他用户名！')
        }
        // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        // console.log(userinfo.password);
        //定义插入用户的 SQL 语句：
        const sql = `insert into ev_users set ?`
        db.query(sql, {
            username: userinfo.username,
            password: userinfo.password
        }, (err, results) => {
            // 执行 SQL 语句失败
            // if (err) return res.send({ status: 1, message: err.message })
            if (err) return res.cc(err)
            // 注册成功
            // res.send({status:0,message:'注册成功！'})
            res.cc('注册成功！', 0)
        })

    })
}
// 登录的处理函数
exports.login = (req, res) => {
    //接收数据表单
    const userinfo = req.body

    db.query(sql, userinfo.username, function (err, resluts) {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但是查询到数据条数不等于 1
        if (resluts.length !== 1) {
            return res.cc('登录失败！')
        }
        // 拿着用户输入的密码,和数据库中存储的密码进行对比
        const compareResult  = bcrypt.compareSync(userinfo.password,resluts[0].password)
        // 如果对比的结果等于 false, 则证明用户输入的密码错误
        if (!compareResult) return res.cc('登录失败！')
        const user = {...resluts[0],password:'',user_pic: ''}
        // 生成 Token 字符串
        const tokenStr  = jwt.sign(user,config.jwtSecretKey,{expiresIn:'10h'})
        //将生成的 Token 字符串响应给客户端：
        res.send({
            status:0,
            message:'登录成功！',
            // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
            token:'Bearer ' + tokenStr
        })
    })

}