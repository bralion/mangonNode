const Router=require('koa-router')

//用于使用mango
const mongoose = require ('mongoose')

let router =new Router();
router.get('/',async(ctx)=>{
	ctx.body="这是用户操作首页"
})
router.get('/register',async(ctx)=>{
	ctx.body="这是用户注册首页"
})
router.get('/save',async(ctx)=>{
	console.dir(ctx.request);
	const User=mongoose.model('User');
	let oneUser=new User({userName:'yc1112lqweqas',password:'1234'});
	oneUser.save().then(()=>{
		console.log('插入数据成功');
	});
	// let user=await User.findOne({})
	let user=await User.findOne({}).exec()
	console.log(user);
	ctx.body='插入数据成功';
})

module.exports=router