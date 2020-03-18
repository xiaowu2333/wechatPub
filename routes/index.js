var express = require('express');
var router = express.Router();
const sha1 = require("sha1");
const request = require("request");
const parseString = require('xml2js').parseString;
const getToken = require("../module/getToken");
const getTicket = require("../module/getTicket");
const sign = require("../module/sign");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//微信验证接口
router.get("/valid",function(req,res,next){
	
	let {signature,timestamp,nonce,echostr} = req.query;
	console.log(req.query);
	let token = "xiaowu";
	let arr = [timestamp,nonce,token];
	// console.log("aaaaaaa:"+arr.sort().join());
	let key = sha1(arr.sort().join(''));
	
	// console.log("signature:"+signature,"key:"+key);
	
	if(key === signature){
		res.end(echostr);
	}else{
		res.end("error");	
	}

	
	
})

router.post("/valid",function(req,res,next){
	var data = "";
	req.on("data",(thunk)=>{
		data += thunk;
	})
	
	req.on("end",()=>{
		parseString(data,function(error,result){
			console.log(result);
			if(!result) return;
    	    if(!result.xml) return;
			var arr = ["腼腆","羞涩","淡定","愉悦","羞耻","痛苦"]
			var str = arr[Math.floor(Math.random()*arr.length)];
    		if(result.xml.MsgType[0]==="event" && result.xml.Event[0]==="CLICK"){
    			if(result.xml.EventKey[0]==="V1001_GOOD"){
    				res.end(`
					<xml>
					  <ToUserName><![CDATA[${result.xml.FromUserName && result.xml.FromUserName[0]}]]></ToUserName>
					  <FromUserName><![CDATA[${result.xml.ToUserName && result.xml.ToUserName[0]}]]></FromUserName>
					  <CreateTime>{${Date.now()}}</CreateTime>
					  <MsgType><![CDATA[text]]></MsgType>
					  <Content><![CDATA[小五${str}的说:感谢您的点赞]]></Content>
					</xml>
	    	    `);
    			}
    			
    		}else if(result.xml.MsgType[0]==="event" && result.xml.Event[0]==="subscribe" ){
    			res.end(`
					<xml>
					  <ToUserName><![CDATA[${result.xml.FromUserName && result.xml.FromUserName[0]}]]></ToUserName>
					  <FromUserName><![CDATA[${result.xml.ToUserName && result.xml.ToUserName[0]}]]></FromUserName>
					  <CreateTime>{${Date.now()}}</CreateTime>
					  <MsgType><![CDATA[text]]></MsgType>
					  <Content><![CDATA[你居然敢关注我，hhhhhh，你可真是个可爱的人儿]]></Content>
					</xml>
	    	    `);
    			
    		}else{
    			
    		
    	    res.end(`
				<xml>
				  <ToUserName><![CDATA[${result.xml.FromUserName && result.xml.FromUserName[0]}]]></ToUserName>
				  <FromUserName><![CDATA[${result.xml.ToUserName && result.xml.ToUserName[0]}]]></FromUserName>
				  <CreateTime>{${Date.now()}}</CreateTime>
				  <MsgType><![CDATA[text]]></MsgType>
				  <Content><![CDATA[您${str}的告诉我:${result.xml.Content && result.xml.Content[0]}]]></Content>
				</xml>
    	    `);
    		}
		})
		
	})
});

router.get("/createmenu",(req,res,next)=>{
	getToken((token)=>{
		var url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${token}`;
		var menu ={
     "button":[
     {    
          "type":"scancode_push",
          "name":"扫一扫",
          "key":"V1001_TODAY_MUSIC"
      },
      {
           "name":"菜单",
           "sub_button":[
           {    
               "type":"view",
               "name":"搜索",
               "url":"http://www.soso.com/"
            },
            {
               "type":"view",
               "name":"视频",
               "url":"http://v.qq.com/"
            },
            {
               "type":"click",
               "name":"赞一下我们",
               "key":"V1001_GOOD"
            }]
       }]
 };


		request({method:"post",url,json:true,body:menu},(err,response,body)=>{
			// console.log(body);
    	 	res.json(body);
    	 });
	})
});

router.get("/sdk",(req,res,next)=>{
	getTicket((ticket)=>{
		// console.log(ticket);
		var obj =sign(ticket,"http://wechat.xiaowu.xyz/sdk")
		// console.log(obj);
		res.render("sdk",obj)
	});
})



module.exports = router;
