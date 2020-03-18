const request = require("request");
const fs = require("fs");
const ticket = require("../ticket.json");
const getToken = require("./getToken");
module.exports = function(callback){
	var now = Date.now();
	if(ticket.ticket==="" || ticket.expires_in<now){
		getToken((token)=>{
			var url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token}&type=jsapi`;
			request(url,(err,response,body)=>{
			    var obj = JSON.parse(body);
			    ticket.ticket = obj.ticket;
			    ticket.expires_in =now +obj.expires_in*1000;
			    fs.writeFileSync("./ticket.json",JSON.stringify(ticket));
			    callback(ticket.ticket)
			})
		})
	}
	else{
		callback(ticket.ticket);
	}
}

