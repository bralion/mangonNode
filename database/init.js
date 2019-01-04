const mongoose = require ('mongoose');
const db = "mongodb://172.27.7.68/studyMango"
const colors = require ('colors');
const glob=require('glob');
const {resolve}=require('path');

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

exports.initSchemas=()=>{
	glob.sync(resolve(__dirname,'./schema','**/*.js')).forEach(require)
}

exports.connect = () => {
	//连接数据库
	mongoose.connect (db);
	let maxConnectTimes = 0
	
	//增加数据库监听
	
		//三次之内从新连接  三次之外报错
	return new Promise ((resolve, reject) => {
		mongoose.connection.on ('disconnexted', () => {
			if (maxConnectTimes <= 3) {
				maxConnectTimes++;
				console.log ('【sever】 数据库断开连接');
				mongoose.connect (db);
			} else {
				reject();
				throw new Error('数据库连接失败，请确认数据库配置正确。。。')
			}
		})

		mongoose.connection.on ('error', (err) => {
			if (maxConnectTimes <= 3) {
				maxConnectTimes++;
				console.log ('【sever】 数据库连接错误，正在重新连接');
			} else {
				reject(err);
				throw new Error('数据库连接失败，请确认数据库配置正确。。。')
			}
		})

		mongoose.connection.once ('open', () => {
			console.log ('【sever】 数据库连接成功'.info);
			resolve()
		})
	})

	
	
}