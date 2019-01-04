const Koa=require('koa')
const app=new Koa()
const colors=require('colors')
const  static = require("koa-static")
const path = require('path')
//用于日志管理
const {log4js} = require('./logSetting/log4js')
//用于生成模板
const {connect,initSchemas}=require('./database/init.js')

//用于使用mango
const mongoose = require ('mongoose')

//用于使用路由
const Router=require('koa-router')

//用于跨域
const cors=require('koa2-cors')

//用于解析post请求
const bodyParser=require('koa-bodyparser')
const session = require('koa-session');

let user=require('./appApi/user.js')
let home=require('./appApi/home.js')


//配置中间件

	//配置session中间件
const CONFIG = {
	key: 'koa:sess1',   //cookie key (default is koa:sess)
	maxAge: 86400000,  // cookie的过期时间 maxAge in ms (default is 1 days)
	overwrite: true,  //是否可以overwrite    (默认default true)
	httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
	signed: true,   //签名默认true
	rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
	renew: false,  //(boolean) renew session when session is nearly expired,
};

//装载所有子路由 用于接口模块化
let router =new Router();
router.use('/user',user.routes())
router.use('/home',home.routes())



//加载路由中间件
app.use(async(ctx, next) => {//记录日志开始
	const start = new Date()
	await next()
	const ms = new Date() - start
	log4js.resLogger(ctx, ms)
})

app.use(static( path.join( __dirname,'/static')));//静态资源服务器
app.use(router.routes())
app.use(router.allowedMethods())
app.use(cors)
app.use(bodyParser)
app.keys = ['asdasd'] //cookie的签名

app.use(session(CONFIG, app))
////设置session
//ctx.session.username='user1'

colors.setTheme ({
	silly: 'rainbow',
	input: 'grey',
	verbose: 'cyan',
	prompt: 'grey',
	info: 'green',
	data: 'grey',
	help: 'cyan',
	warn: 'yellow',
	debug: 'blue',
	error: 'red'
});

//主函数
(async()=>{
	await connect();
	console.log(111)
	//初始化数据库schema模板
	initSchemas();
	const User=mongoose.model('User');
	let oneUser=new User({userName:'yc12lqweqas',password:'1234'});
	oneUser.save().then(()=>{
		console.log('插入数据成功');
	});
	// let user=await User.findOne({})
	let user=await User.findOne({}).exec()
		console.log(user);
		
	}
)()

//监听函数
app.listen(3000,()=>{
	console.log('【server】 server start in port 3000'.info);
});
app.on('error', (err, ctx) => {
	log4js.errLogger(ctx, err)
	console.error('server error', err, ctx)
});