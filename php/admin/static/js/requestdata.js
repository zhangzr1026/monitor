//-------------------prepare data----------------------//
$(document).ready(function() { 
	calculateDate();
});

//calculate time range
function calculateDate(){
	var date_today = new Date();
	var date_weekago =  new Date(date_today.getTime() - 7*24*60*60*1000);
	var date_monthago =  new Date(date_today.getTime() - 30*24*60*60*1000);
	var date_seasonago =  new Date(date_today.getTime() - 90*24*60*60*1000);
	var date_yearago =  new Date(date_today.getTime() - 365*24*60*60*1000);

	zeropoint = " 00:00:00";
	endpoint = " 23:59:59";
	var date_today_str = date_today.format("yyyy-MM-dd") + zeropoint;

	//day
	day_start_str =  date_today.format("yyyy-MM-dd") + zeropoint;
	day_end_str = date_today.format("yyyy-MM-dd hh:mm:ss");
	//week
	week_start_str = date_weekago.format("yyyy-MM-dd") + zeropoint;
	week_end_str = date_today_str
	//month
	month_start_str = date_monthago.format("yyyy-MM-dd") + zeropoint;
	month_end_str = date_today_str;
	//season
	season_start_str = date_seasonago.format("yyyy-MM-dd") + zeropoint;
	season_end_str = date_today_str;
	//year
	year_start_str = date_yearago.format("yyyy-MM-dd") + zeropoint;
	year_end_str = date_today_str;
}

//request for data
function requestAjax(url, param, next){
	var result;
	$.ajax({
		type: "GET",
		url : url,
		data : param,
		async: false,
		dataType : "json",
		success : function(data){
			result = next(data);
		}
	});
	return result;
}

//format data for highcharts
function dataFormat(data) {
	var dataname = new Array();
	for(var o in data) {
		var datapoint = [Number(dateUTC(data[o].date)),Number(data[o].value)];
		dataname[dataname.length] = datapoint;
	}
	return dataname;
}

//transform datetime format for highcharts
function dateUTC(dateTime) {
	var date = dateTime.split(" ")[0].split("-");
	var time = dateTime.split(" ")[1].split(":");
	return Date.UTC(Number(date[0]), Number(date[1])-1, Number(date[2]), Number(time[0]), Number(time[1]));
}

//get params for request by time range
function getParams(id, range, type){
	var params;
	switch(range){
		case 'day' : params = { "id" : id, "start" : day_start_str, "end" : day_end_str, "type" : type }; break;
		case 'week' : params = { "id" : id, "start" : week_start_str, "end" : week_end_str , "type" : type }; break;
		case 'month' : params = { "id" : id, "start" : month_start_str, "end" : month_end_str , "type" : type }; break;
		case 'season' : params = { "id" : id, "start" : season_start_str, "end" : season_end_str , "type" : type }; break;
		case 'year' : params = { "id" : id, "start" : year_start_str, "end" : year_end_str , "type" : type }; break;
	}
	return params;
}

function getParams_history(id, history_date, type){
	var history_start_str = history_date + zeropoint;
	var history_end_str = history_date + endpoint;
	
	var params = {"id" : id, "start" : history_start_str, "end" : history_end_str, "type" : type};
	return params;
}

//-------------------Date Format--------------------//
Date.prototype.format = function(format){ 
	var o = { 
		"M+" : this.getMonth()+1, //month 
		"d+" : this.getDate(), //day 
		"h+" : this.getHours(), //hour 
		"m+" : this.getMinutes(), //minute 
		"s+" : this.getSeconds(), //second 
		"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
		"S" : this.getMilliseconds() //millisecond 
	} 

	if(/(y+)/.test(format)) { 
		format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	} 

	for(var k in o) { 
		if(new RegExp("("+ k +")").test(format)) { 
			format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
		} 
	} 
	return format; 
} 
