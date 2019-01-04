const Router=require('koa-router')


let router =new Router();
router.get('/',async(ctx)=>{
	ctx.body="这是用户操作首页"
})
router.get('/register',async(ctx)=>{
	ctx.body="这是用户注册首页"
})

module.exports=router