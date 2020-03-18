var fs = require("fs");
const request = require("request");

const appID = "wxb4651a9e12189ac8";
const appsecret = "96e850239648ce814f859834a8938a8e";
const access_token = require("../access_token.json");
const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;

module.exports = function(callback){
	var now = Date.now();
	if(access_token.access_token ==="" || access_token.expires_in < now){
		request.get(url,function (error, response, body){
			var obj = JSON.parse(body);
			access_token.access_token = obj.access_token;
			access_token.expires_in = now + obj.expires_in*1000;
			fs.writeFileSync("./access_token.json",JSON.stringify(access_token));
			callback(access_token);
		})
	}else{
		callback(access_token.access_token);
	}
	
}