const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const bcrypt=require('bcryptjs')
const SALT_WORK_FACTOR=10
//schema类型   可以写成下面这样  也可以直接向userName一样  写成对象。
let ObjectId=Schema.Types.ObjectId;

//创建UserSchema
const userSchema=new Schema({
	UserId:{type:ObjectId},//用户id
	userName:{unique:true,type:String},//用户名称
	password:String,//用户密码
	role:String,//用户角色
	createAt:{type:Date,default:Date.now()},//创建时间
	lastLoginAt:{type:Date,default:Date.now()}//最后登陆时间
},
{collection:'user'}//数据集命名
)

userSchema.pre('save',function (next) {//定义save之前的钩子
	bcrypt.genSalt(SALT_WORK_FACTOR,(err,salt)=>{
		if(err) return next(err)
		bcrypt.hash(this.password,salt,(err,hash)=>{
			if(err) return next(err);
			//this代表userSchema
			this.password=hash;
			next();
			
		})
	})
})

//发布模型

mongoose.model('User',userSchema);//模型名称叫User   模型叫userSchema