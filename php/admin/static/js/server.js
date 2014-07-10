// document ready function
$(document).ready(function() { 	

	var divElement = $('div'); //log all div elements'
	hostid = request('id');

	//-------------- Date Picker ------------------//
	$('.singledate').datepicker({
		prevText: "",
		nextText: "",
		maxDate: '-1d',
		minDate: '-12m',
		dateFormat: "yy-mm-dd",
		onSelect: function(dateText, inst){
			$this = $(this);
			var date = $this.val();
			var id_head = $this.attr('id').split('_',1);

			//remove data range active
			$('#'+id_head+'-date-switch li').each(function(index){
				$(this).removeClass('active');
			});

			//repaint highcharts
			var particle_data;
			if(typeof($('.'+id_head+'-state-switch')) != undefined){
				$('.'+id_head+'-state-switch .btn').each(function(){
					if($(this).hasClass('active')){
						particle_data = $(this).attr('particle');
					}
				});
			}	
			showHistoryChart(id_head, particle_data, dateText);
			$this.hide();
		} 
	});

	$('#cpu-history-date').click(function(){
		$('#cpu_today_constr_date_popform').show();
	});

	$('#memory-history-date').click(function(){
		$('#memory_today_constr_date_popform').show();
	});

	//-------------- Date Picker End---------------//
	
	//CPU charts	
	if (divElement.hasClass('cpu-state-chart')) {
	(function(){
		var cateSwitch = $('.cpu-state-switch');
		var buttonGroup = cateSwitch.find('.btn');
		var timeSwitch = $('#cpu-date-switch ul');
		var timeGroup = timeSwitch.find('li');
		
		//CPU
		buttonGroup.each(function(index) {
			$this = $(this);
			if($this.hasClass('active')) {
				var particle_data = $this.attr('particle');
				timeGroup.each(function(index){
					$this = $(this);
					if($this.hasClass('active')){
						var particle_time = $this.attr('particle');
						CPUChart(particle_data, particle_time, null);
					}
				});
			}
		});

		//CPU switch
		buttonGroup.click(function(event) {
			$this = $(this);
			if($this.hasClass('active')) {
				return;
			} else {
				buttonGroup.each(function(index) {
					$(this).removeClass('active');
				});
				$this.addClass('active');
				var particle_data = $this.attr('particle');
				timeGroup.each(function(index) {
					$this = $(this);
					if($this.hasClass('active')){
						var particle_time = $this.attr('particle');
						CPUChart(particle_data, particle_time, null);
					}
				});
			}
		});

		//Time switch 
		timeGroup.click(function(event) {
			$this = $(this);
			if($this.hasClass('active')) {
				return;
			} else {
				timeGroup.each(function(index){
					$(this).removeClass('active');
				});	
				$this.addClass('active');
				var particle_time = $this.attr('particle');
				buttonGroup.each(function(index) {
					$this = $(this);
					if($this.hasClass('active')){
						var particle_data = $this.attr('particle');
						CPUChart(particle_data, particle_time, null);
					}
				});
			}
		});
	})();	
	}

	//Memory chart
	if (divElement.hasClass('memory-state-chart')) {
	(function(){
		var timeSwitch = $('#memory-date-switch ul');
		var timeGroup = timeSwitch.find('li');

		timeGroup.each(function(index){
			$this = $(this);
			if($this.hasClass('active')){
				var particle_time = $this.attr('particle');
				MemoryChart(particle_time, null);
			}
		});

		//Time switch 
		timeGroup.click(function(event) {
			$this = $(this);
			if($this.hasClass('active')) {
				return;
			} else {
				timeGroup.each(function(index){
					$(this).removeClass('active');
				});	
				$this.addClass('active');
				MemoryChart($this.attr('particle'), null);
			}
		});
	})();
	}

});//End document ready functions

//---------------highcharts variable------------------//
var type_spline = {
	type: 'spline',
	zoomType: 'x'
};

var tooltip_array = [{
			crosshairs: true,
            formatter: function() {
				return '<b>'+ this.series.name +'</b><br/>'+
					Highcharts.dateFormat('%H:%M', this.x) +': '+ this.y;
			}
        },{
			crosshairs: true,
            formatter: function() {
				return '<b>'+ this.series.name +'</b><br/>'+
					Highcharts.dateFormat('%Y年%m月%d日', this.x) +': '+ this.y;
			}
        },{
			crosshairs: true,
            formatter: function() {
                return '<b>'+ this.series.name +'</b><br/>'+
                    Highcharts.dateFormat('%Y年%m月', this.x) +': '+ this.y;
			}
        }];

var xAxis_array = [{
			type: 'datetime',
            dateTimeLabelFormats: {
				minute: '%H:%M',
            }
        },{
			type: 'datetime',
			tickInterval: 1 * 24 * 3600 * 1000,
            labels: { 
				formatter: function() { 
					return Highcharts.dateFormat('%m.%d', this.value); 
				} 
			} 
        },{
			type: 'datetime',
            labels: { 
				formatter: function() { 
					return Highcharts.dateFormat('%m.%d', this.value); 
				} 
			}
        },{
            type: 'datetime',
			labels: { 
				formatter: function() { 
					return Highcharts.dateFormat('%Y.%m', this.value); 
				} 
			}
        }];

function setUnit(unit) {
	var yAxis = [{
            title: {
               text: ''
            },
            labels: {
                formatter: function() {
                    return this.value + unit;
                }
            },
            min: 0,
			minorGridLineWidth: 0,
            gridLineWidth: 0,
            alternateGridColor: 'rgba(68, 170, 213, 0.1)'
        }];
    return yAxis;
}

var plotOptions = {
            spline: {
                lineWidth: 4,
                states: {
                    hover: {
                        lineWidth: 5
                    }
                },
                marker: {
                    enabled: false
                }
            }
        };
//---------------highcharts variable End--------------//

//set options according to dateRange
function DateRange(particle_time){
	var xAxis, tooltip;
	//choose xAxis and tooltip
	switch (particle_time)
	{
		case 'history':
		xAxis = xAxis_array[0];
		tooltip = tooltip_array[0];
		case 'day':
		xAxis = xAxis_array[0];
		tooltip = tooltip_array[0];
		break;
		case 'week':
		xAxis = xAxis_array[1];
		tooltip = tooltip_array[1];
		break;
		case 'month':
		xAxis = xAxis_array[2];
		tooltip = tooltip_array[1];
		break;
		case 'season':
		xAxis = xAxis_array[2];
		tooltip = tooltip_array[1];
		break;
		case 'year':
		xAxis = xAxis_array[3];
		tooltip = tooltip_array[2];
		break;
	}
	return [xAxis, tooltip];
}

function CPUChart(particle_data, particle_time, history_date){
	var series, title, xAxis, yAxis, tooltip, url;
	//prepare data range
	var arr = DateRange(particle_time);
	xAxis = arr[0];
	tooltip = arr[1];
	yAxis = setUnit("");
	
	//prepare data 	
	switch (particle_data)
	{
		case 'cpu-info':
		title = 'CPU info';
		yAxis = setUnit("%");
		url = "http://admin.dev.com/index.php/Monitor/chartcpuload";
		if (particle_time == 'history') {			
			series = [{
				name: 'CPU IOWait',
				data: requestAjax("/index.php/Monitor/chartcpuiowait", getParams_history(hostid, history_date, 'normal'), dataFormat)
			}, {
				name: 'CPU sys',
				data: requestAjax("/index.php/Monitor/chartcpusys", getParams_history(hostid, history_date, 'normal'), dataFormat) 
			}, {
				name: 'CPU user',
				data: requestAjax("/index.php/Monitor/chartcpuuser", getParams_history(hostid, history_date, 'normal'), dataFormat) 
			}];
		} else if (particle_time == 'day') {
			series = [{
				name: 'CPU IOWait',
				data: requestAjax("/index.php/Monitor/chartcpuiowait", getParams(hostid, particle_time, 'normal'), dataFormat)
			}, {
				name: 'CPU sys',
				data: requestAjax("/index.php/Monitor/chartcpusys", getParams(hostid, particle_time, 'normal'), dataFormat) 
			}, {
				name: 'CPU user',
				data: requestAjax("/index.php/Monitor/chartcpuuser", getParams(hostid, particle_time, 'normal'), dataFormat) 
			}];
		} else if(particle_time == 'week'){

			series = [{
				name: 'CPU IOWait',
				data: requestAjax("/index.php/Monitor/chartcpuiowait", getParams(hostid, particle_time, 'day'), dataFormat)
			}, {
				name: 'CPU sys',
				data: requestAjax("/index.php/Monitor/chartcpusys", getParams(hostid, particle_time, 'day'), dataFormat) 
			}, {
				name: 'CPU user',
				data: requestAjax("/index.php/Monitor/chartcpuuser", getParams(hostid, particle_time, 'day'), dataFormat) 
			}];
		} else if(particle_time == 'month') {
			series = [{
				name: 'CPU IOWait',
				data: requestAjax("/index.php/Monitor/chartcpuiowait", getParams(hostid, particle_time, 'day'), dataFormat) 
			}, {
				name: 'CPU sys',
				data: requestAjax("/index.php/Monitor/chartcpusys", getParams(hostid, particle_time, 'day'), dataFormat) 
			}, {
				name: 'CPU user',
				data: requestAjax("/index.php/Monitor/chartcpuuser", getParams(hostid, particle_time, 'day'), dataFormat) 
			}];
		} else if(particle_time == 'season') {
			series = [{
				name: 'CPU IOWait',
				data: requestAjax("/index.php/Monitor/chartcpuiowait", getParams(hostid, particle_time, 'week'), dataFormat) 
			}, {
				name: 'CPU sys',
				data: requestAjax("/index.php/Monitor/chartcpusys", getParams(hostid, particle_time, 'week'), dataFormat) 
			}, {
				name: 'CPU user',
				data: requestAjax("/index.php/Monitor/chartcpuuser", getParams(hostid, particle_time, 'week'), dataFormat) 
			}];
		} else if (particle_time == 'year') {
			series = [{
				name: 'CPU IOWait',
				data: requestAjax("/index.php/Monitor/chartcpuiowait", getParams(hostid, particle_time, 'month'), dataFormat) 
			}, {
				name: 'CPU sys',
				data: requestAjax("/index.php/Monitor/chartcpusys", getParams(hostid, particle_time, 'month'), dataFormat) 
			}, {
				name: 'CPU user',
				data: requestAjax("/index.php/Monitor/chartcpuuser", getParams(hostid, particle_time, 'month'), dataFormat) 
			}];
		}	
		break;
		case 'cpu-IO':
		title = 'CPU load';
		url = "";
		color = '#8bbc21';
		if (particle_time == 'history') {			
			series = [{
				name: 'CPU load',
				data: requestAjax("http://admin.dev.com/index.php/Monitor/chartcpuload", getParams_history(hostid, history_date, 'normal'), dataFormat)
			}];
		} else if (particle_time == 'day') {
			series = [{
				name: 'CPU load',
				data: requestAjax("http://admin.dev.com/index.php/Monitor/chartcpuload", getParams(hostid, particle_time, 'normal'), dataFormat)
			}];
		} else if(particle_time == 'week'){
			series = [{
				name: 'CPU load',
				data: requestAjax("http://admin.dev.com/index.php/Monitor/chartcpuload", getParams(hostid, particle_time, 'day'), dataFormat) 
			}];
		} else if(particle_time == 'month') {
			series = [{
				name: 'CPU load',
				data: requestAjax("http://admin.dev.com/index.php/Monitor/chartcpuload", getParams(hostid, particle_time, 'day'), dataFormat)
			}];
		} else if(particle_time == 'season') {
			series = [{
				name: 'CPU load',
				data: requestAjax("http://admin.dev.com/index.php/Monitor/chartcpuload", getParams(hostid, particle_time, 'week'), dataFormat)
			}];
		} else if (particle_time == 'year') {
			series = [{
				name: 'CPU load',
				data: requestAjax("http://admin.dev.com/index.php/Monitor/chartcpuload", getParams(hostid, particle_time, 'month'), dataFormat)
			}];
		}
		break;		
	}
	$(function () {
	$('.cpu-state-chart').highcharts({
		chart: type_spline,
        title: {
            text: title
        },
        xAxis: xAxis,
        yAxis: yAxis,
        tooltip: tooltip,
		plotOptions: plotOptions,
        series: series
    });
	});
}

function MemoryChart(particle_time, history_date){
	var series, title, xAxis, yAxis, tooltip, url;
	//prepare data range
	var arr = DateRange(particle_time);
	xAxis = arr[0];
	tooltip = arr[1];
	yAxis = setUnit("M");

	title = 'Memory info';	 
	url = "";
	if (particle_time == 'history') {
		series = [/*{
			name: 'Total',
			data: requestAjax(url, getParams_history(hostid, history_date, 'normal'), dataFormat)
		}, */{
			name: 'used',
			data: requestAjax("/index.php/Monitor/chartmemused", getParams_history(hostid, history_date, 'normal'), dataFormat)
		}, {
			name: 'free',
			data: requestAjax("/index.php/Monitor/chartmemfree", getParams_history(hostid, history_date, 'normal'), dataFormat)
		}, {
			name: 'buffer ',
			data: requestAjax("/index.php/Monitor/chartmembuffers", getParams_history(hostid, history_date, 'normal'), dataFormat)
		}, {
			name: 'cache ',
			data: requestAjax("/index.php/Monitor/chartmemcached", getParams_history(hostid, history_date, 'normal'), dataFormat)
		}];
	} else if (particle_time == 'day') {
		series = [/*{
			name: 'Total',
			data: day_data_1
		},*/ {
			name: 'used',
			data: requestAjax("/index.php/Monitor/chartmemused", getParams(hostid, particle_time, 'normal'), dataFormat) 
		}, {
			name: 'free',
			data: requestAjax("/index.php/Monitor/chartmemfree", getParams(hostid, particle_time, 'normal'), dataFormat)
		}, {
			name: 'buffer ',
			data: requestAjax("/index.php/Monitor/chartmembuffers", getParams(hostid, particle_time, 'normal'), dataFormat)
		}, {
			name: 'cache ',
			data: requestAjax("/index.php/Monitor/chartmemcached", getParams(hostid, particle_time, 'normal'), dataFormat)
		}];
	} else if (particle_time == 'week') {
		series = [/*{
			name: 'Total',
			data: week_data_1
		},*/ {
			name: 'used',
			data: requestAjax("/index.php/Monitor/chartmemused", getParams(hostid, particle_time, 'day'), dataFormat) 
		}, {
			name: 'free',
			data: requestAjax("/index.php/Monitor/chartmemfree", getParams(hostid, particle_time, 'day'), dataFormat) 
		}, {
			name: 'buffer ',
			data: requestAjax("/index.php/Monitor/chartmembuffers", getParams(hostid, particle_time, 'day'), dataFormat)
		}, {
			name: 'cache ',
			data: requestAjax("/index.php/Monitor/chartmemcached", getParams(hostid, particle_time, 'day'), dataFormat)
		}];
	} else if (particle_time == 'month') {
		series = [/*{
			name: 'Total',
			data: month_data_1
		},*/ {
			name: 'used',
			data: requestAjax("/index.php/Monitor/chartmemused", getParams(hostid, particle_time, 'day'), dataFormat) 
		}, {
			name: 'free',
			data: requestAjax("/index.php/Monitor/chartmemfree", getParams(hostid, particle_time, 'day'), dataFormat)
		}, {
			name: 'buffer ',
			data: requestAjax("/index.php/Monitor/chartmembuffers", getParams(hostid, particle_time, 'day'), dataFormat)
		}, {
			name: 'cache ',
			data: requestAjax("/index.php/Monitor/chartmemcached", getParams(hostid, particle_time, 'day'), dataFormat)
		}];
	} else if (particle_time == 'season') {
		series = [/*{
			name: 'Total',
			data: season_data_1
		},*/ {
			name: 'used',
			data: requestAjax("/index.php/Monitor/chartmemused", getParams(hostid, particle_time, 'week'), dataFormat) 
		}, {
			name: 'free',
			data: requestAjax("/index.php/Monitor/chartmemfree", getParams(hostid, particle_time, 'week'), dataFormat)
		}, {
			name: 'buffer ',
			data: requestAjax("/index.php/Monitor/chartmembuffers", getParams(hostid, particle_time, 'week'), dataFormat)
		}, {
			name: 'cache ',
			data: requestAjax("/index.php/Monitor/chartmemcached", getParams(hostid, particle_time, 'week'), dataFormat)
		}];
	} else if (particle_time == 'year') {
		series = [/*{
			name: 'Total',
			data: year_data_1
		},*/ {
			name: 'used',
			data: requestAjax("/index.php/Monitor/chartmemused", getParams(hostid, particle_time, 'month'), dataFormat)
		}, {
			name: 'free',
			data: requestAjax("/index.php/Monitor/chartmemfree", getParams(hostid, particle_time, 'month'), dataFormat)
		}, {
			name: 'buffer ',
			data: requestAjax("/index.php/Monitor/chartmembuffers", getParams(hostid, particle_time, 'month'), dataFormat)
		}, {
			name: 'cache ',
			data: requestAjax("/index.php/Monitor/chartmemcached", getParams(hostid, particle_time, 'month'), dataFormat)
		}];
	}
	$(function () {
	$('.memory-state-chart').highcharts({
		chart: type_spline,
        title: {
            text: title
        },
        xAxis: xAxis,
        yAxis: yAxis,
        tooltip: tooltip,
		plotOptions: plotOptions,
        series: series
    });
	});
}

function showHistoryChart(chart_name, particle_data, history_date) {
	var particle_time = "history";

	if(chart_name == "cpu"){
		CPUChart(particle_data, particle_time, history_date); 

	} else if(chart_name == "memory") {
		MemoryChart(particle_time, history_date);

	} else if(chart_name = "network") {
		NetworkChart(particle_time, particle_data, history_date)
	}
}

function request(paras) { 
    var url = location.href; 
    var paraString = url.substring(url.indexOf("?")+1,url.length).split("&"); 
    var paraObj = {} 
    for (i=0; j=paraString[i]; i++){ 
        paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length); 
    } 
    var returnValue = paraObj[paras.toLowerCase()]; 
    if(typeof(returnValue)=="undefined"){ 
        return ""; 
    }else{ 
        return returnValue; 
    } 
}

//---------------------demo data-----------------------//
var testdata = [{"date":"2014-06-18 00:00:04","value":"0.30"},{"date":"2014-06-18 00:05:03","value":"0.00"},{"date":"2014-06-18 00:10:04","value":"0.00"},{"date":"2014-06-18 00:15:04","value":"0.01"},{"date":"2014-06-18 00:20:03","value":"0.12"},{"date":"2014-06-18 00:25:03","value":"0.00"},{"date":"2014-06-18 00:30:03","value":"0.02"},{"date":"2014-06-18 00:35:04","value":"0.07"},{"date":"2014-06-18 00:40:04","value":"0.02"},{"date":"2014-06-18 00:45:03","value":"0.03"},{"date":"2014-06-18 00:50:03","value":"0.08"},{"date":"2014-06-18 00:55:03","value":"0.00"},{"date":"2014-06-18 01:00:04","value":"0.01"},{"date":"2014-06-18 01:05:03","value":"0.07"},{"date":"2014-06-18 01:10:03","value":"0.00"},{"date":"2014-06-18 01:15:03","value":"0.00"},{"date":"2014-06-18 01:20:03","value":"0.31"},{"date":"2014-06-18 01:25:03","value":"0.00"},{"date":"2014-06-18 01:30:04","value":"0.00"},{"date":"2014-06-18 01:35:04","value":"0.04"},{"date":"2014-06-18 01:40:03","value":"0.12"},{"date":"2014-06-18 01:45:03","value":"0.01"},{"date":"2014-06-18 01:50:03","value":"0.08"},{"date":"2014-06-18 01:55:04","value":"0.09"},{"date":"2014-06-18 02:00:04","value":"0.27"},{"date":"2014-06-18 02:05:03","value":"0.01"},{"date":"2014-06-18 02:10:03","value":"0.04"},{"date":"2014-06-18 02:15:03","value":"0.18"},{"date":"2014-06-18 02:20:04","value":"0.00"},{"date":"2014-06-18 02:25:04","value":"0.35"},{"date":"2014-06-18 02:30:03","value":"0.00"},{"date":"2014-06-18 02:35:03","value":"0.29"},{"date":"2014-06-18 02:40:03","value":"0.06"},{"date":"2014-06-18 02:45:04","value":"0.00"},{"date":"2014-06-18 02:50:04","value":"0.43"},{"date":"2014-06-18 02:55:03","value":"0.04"},{"date":"2014-06-18 03:00:03","value":"0.30"},{"date":"2014-06-18 03:05:04","value":"0.28"},{"date":"2014-06-18 03:10:04","value":"0.16"},{"date":"2014-06-18 03:15:03","value":"0.01"},{"date":"2014-06-18 03:20:03","value":"0.03"},{"date":"2014-06-18 03:25:03","value":"0.00"},{"date":"2014-06-18 03:30:04","value":"0.00"},{"date":"2014-06-18 03:35:05","value":"0.21"},{"date":"2014-06-18 03:40:04","value":"0.18"},{"date":"2014-06-18 03:45:04","value":"0.00"},{"date":"2014-06-18 03:50:04","value":"0.00"},{"date":"2014-06-18 03:55:03","value":"0.07"},{"date":"2014-06-18 04:00:03","value":"0.00"},{"date":"2014-06-18 04:05:04","value":"0.00"},{"date":"2014-06-18 04:10:03","value":"0.02"},{"date":"2014-06-18 04:15:03","value":"0.06"},{"date":"2014-06-18 04:20:03","value":"0.00"},{"date":"2014-06-18 04:25:04","value":"0.01"},{"date":"2014-06-18 04:30:03","value":"0.18"},{"date":"2014-06-18 04:35:03","value":"0.09"},{"date":"2014-06-18 04:40:03","value":"0.00"},{"date":"2014-06-18 04:45:03","value":"0.03"},{"date":"2014-06-18 04:50:04","value":"0.00"},{"date":"2014-06-18 04:55:04","value":"0.00"},{"date":"2014-06-18 05:00:03","value":"0.01"},{"date":"2014-06-18 05:05:03","value":"0.11"},{"date":"2014-06-18 05:10:04","value":"0.32"},{"date":"2014-06-18 05:15:04","value":"0.04"},{"date":"2014-06-18 05:20:03","value":"0.00"},{"date":"2014-06-18 05:25:03","value":"0.00"},{"date":"2014-06-18 05:30:03","value":"0.05"},{"date":"2014-06-18 05:35:04","value":"0.01"},{"date":"2014-06-18 05:40:04","value":"0.09"},{"date":"2014-06-18 05:45:03","value":"0.06"},{"date":"2014-06-18 05:50:03","value":"0.10"},{"date":"2014-06-18 05:55:03","value":"0.08"},{"date":"2014-06-18 06:00:04","value":"0.01"},{"date":"2014-06-18 06:05:03","value":"0.03"},{"date":"2014-06-18 06:10:03","value":"0.00"},{"date":"2014-06-18 06:15:03","value":"0.00"},{"date":"2014-06-18 06:20:04","value":"0.13"},{"date":"2014-06-18 06:25:04","value":"0.00"},{"date":"2014-06-18 06:30:03","value":"0.01"},{"date":"2014-06-18 06:35:03","value":"0.30"},{"date":"2014-06-18 06:40:03","value":"0.16"},{"date":"2014-06-18 06:45:04","value":"0.09"},{"date":"2014-06-18 06:50:04","value":"0.00"},{"date":"2014-06-18 06:55:03","value":"0.11"},{"date":"2014-06-18 07:00:03","value":"0.16"},{"date":"2014-06-18 07:05:03","value":"0.04"},{"date":"2014-06-18 07:10:04","value":"0.00"},{"date":"2014-06-18 07:15:04","value":"0.13"},{"date":"2014-06-18 07:20:03","value":"0.00"},{"date":"2014-06-18 07:25:03","value":"0.02"},{"date":"2014-06-18 07:30:03","value":"0.13"},{"date":"2014-06-18 07:35:04","value":"0.07"},{"date":"2014-06-18 07:40:04","value":"0.01"},{"date":"2014-06-18 07:45:03","value":"0.10"},{"date":"2014-06-18 07:50:03","value":"0.16"},{"date":"2014-06-18 07:55:03","value":"0.01"},{"date":"2014-06-18 08:00:04","value":"0.20"},{"date":"2014-06-18 08:05:04","value":"0.01"},{"date":"2014-06-18 08:10:03","value":"0.05"},{"date":"2014-06-18 08:15:03","value":"0.12"},{"date":"2014-06-18 08:20:03","value":"0.00"},{"date":"2014-06-18 08:25:04","value":"0.00"},{"date":"2014-06-18 08:30:04","value":"0.16"},{"date":"2014-06-18 08:35:03","value":"0.00"},{"date":"2014-06-18 08:40:03","value":"0.10"},{"date":"2014-06-18 08:45:03","value":"0.30"},{"date":"2014-06-18 08:50:03","value":"0.04"},{"date":"2014-06-18 08:55:04","value":"0.26"},{"date":"2014-06-18 09:00:04","value":"0.40"},{"date":"2014-06-18 09:05:03","value":"0.02"},{"date":"2014-06-18 09:10:03","value":"0.00"},{"date":"2014-06-18 09:15:03","value":"0.25"},{"date":"2014-06-18 09:20:04","value":"0.19"},{"date":"2014-06-18 09:25:04","value":"0.07"},{"date":"2014-06-18 09:30:03","value":"0.10"},{"date":"2014-06-18 09:35:03","value":"0.13"},{"date":"2014-06-18 09:40:04","value":"0.13"},{"date":"2014-06-18 09:45:04","value":"0.01"},{"date":"2014-06-18 09:50:04","value":"0.03"},{"date":"2014-06-18 09:55:03","value":"0.36"},{"date":"2014-06-18 10:00:04","value":"0.10"},{"date":"2014-06-18 10:05:03","value":"0.14"},{"date":"2014-06-18 10:10:04","value":"0.06"},{"date":"2014-06-18 10:15:04","value":"0.00"},{"date":"2014-06-18 10:20:03","value":"0.09"},{"date":"2014-06-18 10:25:03","value":"0.00"},{"date":"2014-06-18 10:30:03","value":"0.00"},{"date":"2014-06-18 10:35:04","value":"0.26"},{"date":"2014-06-18 10:40:06","value":"0.28"},{"date":"2014-06-18 10:45:04","value":"0.16"},{"date":"2014-06-18 10:50:03","value":"0.16"},{"date":"2014-06-18 10:55:03","value":"0.01"},{"date":"2014-06-18 11:00:05","value":"0.39"},{"date":"2014-06-18 11:05:04","value":"0.01"},{"date":"2014-06-18 11:10:04","value":"0.08"},{"date":"2014-06-18 11:15:03","value":"0.13"},{"date":"2014-06-18 11:20:03","value":"0.01"},{"date":"2014-06-18 11:25:04","value":"0.02"},{"date":"2014-06-18 11:30:04","value":"0.03"},{"date":"2014-06-18 11:35:03","value":"0.20"},{"date":"2014-06-18 11:40:03","value":"0.12"},{"date":"2014-06-18 11:45:03","value":"0.11"},{"date":"2014-06-18 11:50:04","value":"0.17"},{"date":"2014-06-18 11:55:04","value":"0.03"},{"date":"2014-06-18 12:00:04","value":"0.08"},{"date":"2014-06-18 12:05:03","value":"0.06"},{"date":"2014-06-18 12:10:03","value":"0.08"},{"date":"2014-06-18 12:15:04","value":"0.04"},{"date":"2014-06-18 12:20:04","value":"0.01"},{"date":"2014-06-18 12:25:03","value":"0.11"},{"date":"2014-06-18 12:30:03","value":"0.00"},{"date":"2014-06-18 12:35:03","value":"0.02"},{"date":"2014-06-18 12:40:04","value":"0.11"},{"date":"2014-06-18 12:45:04","value":"0.00"},{"date":"2014-06-18 12:50:03","value":"0.01"},{"date":"2014-06-18 12:55:03","value":"0.01"},{"date":"2014-06-18 13:00:03","value":"0.05"},{"date":"2014-06-18 13:05:04","value":"0.00"},{"date":"2014-06-18 13:10:03","value":"0.08"},{"date":"2014-06-18 13:15:03","value":"0.03"},{"date":"2014-06-18 13:20:03","value":"0.05"},{"date":"2014-06-18 13:25:04","value":"0.00"},{"date":"2014-06-18 13:30:04","value":"0.12"},{"date":"2014-06-18 13:35:03","value":"0.07"},{"date":"2014-06-18 13:40:03","value":"0.02"},{"date":"2014-06-18 13:45:04","value":"0.12"},{"date":"2014-06-18 13:50:03","value":"0.29"},{"date":"2014-06-18 13:55:03","value":"0.00"},{"date":"2014-06-18 14:00:03","value":"0.16"},{"date":"2014-06-18 14:05:04","value":"0.07"},{"date":"2014-06-18 14:10:03","value":"0.00"},{"date":"2014-06-18 14:15:03","value":"0.01"},{"date":"2014-06-18 14:20:03","value":"0.03"},{"date":"2014-06-18 14:25:04","value":"0.00"},{"date":"2014-06-18 14:35:03","value":"0.07"},{"date":"2014-06-18 14:40:04","value":"0.00"},{"date":"2014-06-18 14:45:03","value":"0.00"},{"date":"2014-06-18 14:50:03","value":"0.09"},{"date":"2014-06-18 14:55:04","value":"0.01"},{"date":"2014-06-18 15:00:04","value":"0.09"},{"date":"2014-06-18 15:05:03","value":"0.10"},{"date":"2014-06-18 15:10:03","value":"0.08"},{"date":"2014-06-18 15:15:04","value":"0.05"},{"date":"2014-06-18 15:20:04","value":"0.12"},{"date":"2014-06-18 15:25:05","value":"0.07"},{"date":"2014-06-18 15:30:04","value":"0.05"},{"date":"2014-06-18 15:35:03","value":"0.47"}];
var day_data_1 = [
					[Date.UTC(2014,3,2,0,0), 0   ],
					[Date.UTC(2014,3,2,0,30), 0.6 ],
					[Date.UTC(2014,3,2,1,0), 0.7 ],
					[Date.UTC(2014,3,2,1,30), 0.8 ],
					[Date.UTC(2014,3,2,2,0), 0.6 ],
					[Date.UTC(2014,3,2,2,30), 0.6 ],
					[Date.UTC(2014,3,2,3,0), 0.67],
					[Date.UTC(2014,3,2,3,30), 0.81],
					[Date.UTC(2014,3,2,4,0), 0.78],
					[Date.UTC(2014,3,2,4,30), 0.98],
					[Date.UTC(2014,3,2,5,0), 1.84],
					[Date.UTC(2014,3,2,5,30), 1.80],
					[Date.UTC(2014,3,2,6,0), 1.80],
					[Date.UTC(2014,3,2,6,30), 1.92],
					[Date.UTC(2014,3,2,7,0), 2.49],
					[Date.UTC(2014,3,2,7,30), 2.79],
					[Date.UTC(2014,3,2,8,0), 2.73],
					[Date.UTC(2014,3,2,8,30), 2.61],
					[Date.UTC(2014,3,2,9,0), 2.76],
					[Date.UTC(2014,3,2,9,30), 2.82],
					[Date.UTC(2014,3,2,10,0), 2.8 ],
					[Date.UTC(2014,3,2,10,30), 2.1 ],
					[Date.UTC(2014,3,2,11,0), 1.1 ],
					[Date.UTC(2014,3,2,11,30), 0.25],
					[Date.UTC(2014,3,2,12,0), 0]
				];
day_data_2 = [
					[Date.UTC(2014,3,2,0,0), 0.1 ],
					[Date.UTC(2014,3,2,0,30), 0.5 ],
					[Date.UTC(2014,3,2,1,0), 0.56],
					[Date.UTC(2014,3,2,1,30), 0.71],
					[Date.UTC(2014,3,2,2,0), 1.8 ],
					[Date.UTC(2014,3,2,2,30), 1.6 ],
					[Date.UTC(2014,3,2,3,0), 0.76],
					[Date.UTC(2014,3,2,3,30), 0.68],
					[Date.UTC(2014,3,2,4,0), 0.87],
					[Date.UTC(2014,3,2,4,30), 1.08],
					[Date.UTC(2014,3,2,5,0), 1.14],
					[Date.UTC(2014,3,2,5,30), 1.08],
					[Date.UTC(2014,3,2,6,0), 2.77],
					[Date.UTC(2014,3,2,6,30), 2.87],
					[Date.UTC(2014,3,2,7,0), 3.30],
					[Date.UTC(2014,3,2,7,30), 3.15],
					[Date.UTC(2014,3,2,8,0), 3.05],
					[Date.UTC(2014,3,2,8,30), 2.16],
					[Date.UTC(2014,3,2,9,0), 2.67],
					[Date.UTC(2014,3,2,9,30), 2.62],
					[Date.UTC(2014,3,2,10,0), 2.5 ],
					[Date.UTC(2014,3,2,10,30), 2.0 ],
					[Date.UTC(2014,3,2,11,0), 1.19],
					[Date.UTC(2014,3,2,11,30), 0.52],
					[Date.UTC(2014,3,2,12,0), 1.25]
				];
day_data_3 = [
					[Date.UTC(2014,3,2,0,0), 1.1 ],
					[Date.UTC(2014,3,2,0,30), 0.6 ],
					[Date.UTC(2014,3,2,1,0), 1.56],
					[Date.UTC(2014,3,2,1,30), 1.99],
					[Date.UTC(2014,3,2,2,0), 2.5 ],
					[Date.UTC(2014,3,2,2,30), 2.6 ],
					[Date.UTC(2014,3,2,3,0), 1.76],
					[Date.UTC(2014,3,2,3,30), 1.68],
					[Date.UTC(2014,3,2,4,0), 1.87],
					[Date.UTC(2014,3,2,4,30), 0.78],
					[Date.UTC(2014,3,2,5,0), 1.24],
					[Date.UTC(2014,3,2,5,30), 1.48],
					[Date.UTC(2014,3,2,6,0), 2.67],
					[Date.UTC(2014,3,2,6,30), 2.17],
					[Date.UTC(2014,3,2,7,0), 3.0],
					[Date.UTC(2014,3,2,7,30), 3.5],
					[Date.UTC(2014,3,2,8,0), 3.05],
					[Date.UTC(2014,3,2,8,30), 2.16],
					[Date.UTC(2014,3,2,9,0), 2.67],
					[Date.UTC(2014,3,2,9,30), 2.62],
					[Date.UTC(2014,3,2,10,0), 2.5 ],
					[Date.UTC(2014,3,2,10,30), 2.0 ],
					[Date.UTC(2014,3,2,11,0), 1.19],
					[Date.UTC(2014,3,2,11,30), 0.52],
					[Date.UTC(2014,3,2,12,0), 1.25]
				];
day_data_4 = [
					[Date.UTC(2014,3,2,0,0), 0   ],
					[Date.UTC(2014,3,2,0,30), 0.6 ],
					[Date.UTC(2014,3,2,1,0), 0.7 ],
					[Date.UTC(2014,3,2,1,30), 0.8 ],
					[Date.UTC(2014,3,2,2,0), 0.6 ],
					[Date.UTC(2014,3,2,2,30), 0.6 ],
					[Date.UTC(2014,3,2,3,0), 0.67],
					[Date.UTC(2014,3,2,3,30), 0.81],
					[Date.UTC(2014,3,2,4,0), 0.78],
					[Date.UTC(2014,3,2,4,30), 0.98],
					[Date.UTC(2014,3,2,5,0), 1.84],
					[Date.UTC(2014,3,2,5,30), 1.80],
					[Date.UTC(2014,3,2,6,0), 1.80],
					[Date.UTC(2014,3,2,6,30), 1.92],
					[Date.UTC(2014,3,2,7,0), 2.49],
					[Date.UTC(2014,3,2,7,30), 2.79],
					[Date.UTC(2014,3,2,8,0), 2.73],
					[Date.UTC(2014,3,2,8,30), 2.61],
					[Date.UTC(2014,3,2,9,0), 2.76],
					[Date.UTC(2014,3,2,9,30), 2.82],
					[Date.UTC(2014,3,2,10,0), 2.8 ],
					[Date.UTC(2014,3,2,10,30), 2.1 ],
					[Date.UTC(2014,3,2,11,0), 1.1 ],
					[Date.UTC(2014,3,2,11,30), 0.25],
					[Date.UTC(2014,3,2,12,0), 0]
				];
week_data_1 = [
					[Date.UTC(2014,2,27), 0   ],
					[Date.UTC(2014,2,28), 0.6 ],
					[Date.UTC(2014,2,29), 0.7 ],
					[Date.UTC(2014,2,30), 0.8 ],
					[Date.UTC(2014,2,31), 0.6 ],
					[Date.UTC(2014,3,1), 0.6 ],
					[Date.UTC(2014,3,2), 0.67]
				];
week_data_2 = [
					[Date.UTC(2014,2,27), 0.1 ],
					[Date.UTC(2014,2,28), 0.5 ],
					[Date.UTC(2014,2,29), 0.56],
					[Date.UTC(2014,2,30), 0.71],
					[Date.UTC(2014,2,31), 1.8 ],
					[Date.UTC(2014,3,1), 1.6 ],
					[Date.UTC(2014,3,2), 0.76]
				];
week_data_3 = [
					[Date.UTC(2014,2,27), 1.1 ],
					[Date.UTC(2014,2,28), 0.6 ],
					[Date.UTC(2014,2,29), 1.56],
					[Date.UTC(2014,2,30), 1.99],
					[Date.UTC(2014,2,31), 2.5 ],
					[Date.UTC(2014,3,1), 2.6 ],
					[Date.UTC(2014,3,2), 1.76]
				];
week_data_4 = [
					[Date.UTC(2014,2,27), 0   ],
					[Date.UTC(2014,2,28), 0.6 ],
					[Date.UTC(2014,2,29), 0.7 ],
					[Date.UTC(2014,2,30), 0.8 ],
					[Date.UTC(2014,2,31), 0.6 ],
					[Date.UTC(2014,3,1), 0.6 ],
					[Date.UTC(2014,3,2), 0.67]
				];
month_data_1 = [
					[Date.UTC(2014,2,12), 1.84],
					[Date.UTC(2014,2,13), 1.80],
					[Date.UTC(2014,2,14), 1.80],
					[Date.UTC(2014,2,15), 1.92],
					[Date.UTC(2014,2,16), 2.49],
					[Date.UTC(2014,2,17), 2.79],
					[Date.UTC(2014,2,18), 2.73],
					[Date.UTC(2014,2,19), 2.61],
					[Date.UTC(2014,2,20), 2.76],
					[Date.UTC(2014,2,21), 2.82],
					[Date.UTC(2014,2,22), 2.8 ],
					[Date.UTC(2014,2,23), 2.1 ],
					[Date.UTC(2014,2,24), 1.1 ],
					[Date.UTC(2014,2,25), 0.25],
					[Date.UTC(2014,2,26), 0   ],
					[Date.UTC(2014,2,27), 0   ],
					[Date.UTC(2014,2,28), 0.6 ],
					[Date.UTC(2014,2,29), 0.7 ],
					[Date.UTC(2014,2,30), 0.8 ],
					[Date.UTC(2014,2,31), 0.6 ],
					[Date.UTC(2014,3,1), 0.6 ],
					[Date.UTC(2014,3,2), 0.67]
				];
month_data_2 = [
					[Date.UTC(2014,2,12), 1.14],
					[Date.UTC(2014,2,13), 1.08],
					[Date.UTC(2014,2,14), 2.77],
					[Date.UTC(2014,2,15), 2.87],
					[Date.UTC(2014,2,16), 3.30],
					[Date.UTC(2014,2,17), 3.15],
					[Date.UTC(2014,2,18), 3.05],
					[Date.UTC(2014,2,19), 2.16],
					[Date.UTC(2014,2,20), 2.67],
					[Date.UTC(2014,2,21), 2.62],
					[Date.UTC(2014,2,22), 2.5 ],
					[Date.UTC(2014,2,23), 2.0 ],
					[Date.UTC(2014,2,24), 1.19],
					[Date.UTC(2014,2,25), 0.52],
					[Date.UTC(2014,2,26), 1.25],
					[Date.UTC(2014,2,27), 0.1 ],
					[Date.UTC(2014,2,28), 0.5 ],
					[Date.UTC(2014,2,29), 0.56],
					[Date.UTC(2014,2,30), 0.71],
					[Date.UTC(2014,2,31), 1.8 ],
					[Date.UTC(2014,3,1), 1.6 ],
					[Date.UTC(2014,3,2), 0.76]
				];
month_data_3 = [
					[Date.UTC(2014,2,12), 1.24],
					[Date.UTC(2014,2,13), 1.48],
					[Date.UTC(2014,2,14), 2.67],
					[Date.UTC(2014,2,15), 2.17],
					[Date.UTC(2014,2,16), 3.0],
					[Date.UTC(2014,2,17), 3.5],
					[Date.UTC(2014,2,18), 3.05],
					[Date.UTC(2014,2,19), 2.16],
					[Date.UTC(2014,2,20), 2.67],
					[Date.UTC(2014,2,21), 2.62],
					[Date.UTC(2014,2,22), 2.5 ],
					[Date.UTC(2014,2,23), 2.0 ],
					[Date.UTC(2014,2,24), 1.19],
					[Date.UTC(2014,2,25), 0.52],
					[Date.UTC(2014,2,26), 1.25],
					[Date.UTC(2014,2,27), 1.1 ],
					[Date.UTC(2014,2,28), 0.6 ],
					[Date.UTC(2014,2,29), 1.56],
					[Date.UTC(2014,2,30), 1.99],
					[Date.UTC(2014,2,31), 2.5 ],
					[Date.UTC(2014,3,1), 2.6 ],
					[Date.UTC(2014,3,2), 1.76]
				];
month_data_4 = [
					[Date.UTC(2014,2,12), 1.84],
					[Date.UTC(2014,2,13), 1.80],
					[Date.UTC(2014,2,14), 1.80],
					[Date.UTC(2014,2,15), 1.92],
					[Date.UTC(2014,2,16), 2.49],
					[Date.UTC(2014,2,17), 2.79],
					[Date.UTC(2014,2,18), 2.73],
					[Date.UTC(2014,2,19), 2.61],
					[Date.UTC(2014,2,20), 2.76],
					[Date.UTC(2014,2,21), 2.82],
					[Date.UTC(2014,2,22), 2.8 ],
					[Date.UTC(2014,2,23), 2.1 ],
					[Date.UTC(2014,2,24), 1.1 ],
					[Date.UTC(2014,2,25), 0.25],
					[Date.UTC(2014,2,26), 0   ],
					[Date.UTC(2014,2,27), 0   ],
					[Date.UTC(2014,2,28), 0.6 ],
					[Date.UTC(2014,2,29), 0.7 ],
					[Date.UTC(2014,2,30), 0.8 ],
					[Date.UTC(2014,2,31), 0.6 ],
					[Date.UTC(2014,3,1), 0.6 ],
					[Date.UTC(2014,3,2), 0.67]
				];
season_data_1 = [
					[Date.UTC(2014,2,12), 1.84],
					[Date.UTC(2014,2,13), 1.80],
					[Date.UTC(2014,2,14), 1.80],
					[Date.UTC(2014,2,15), 1.92],
					[Date.UTC(2014,2,16), 2.49],
					[Date.UTC(2014,2,17), 2.79],
					[Date.UTC(2014,2,18), 2.73],
					[Date.UTC(2014,2,19), 2.61],
					[Date.UTC(2014,2,20), 2.76],
					[Date.UTC(2014,2,21), 2.82],
					[Date.UTC(2014,2,22), 2.8 ],
					[Date.UTC(2014,2,23), 2.1 ],
					[Date.UTC(2014,2,24), 1.1 ],
					[Date.UTC(2014,2,25), 0.25],
					[Date.UTC(2014,2,26), 0   ],
					[Date.UTC(2014,2,27), 0   ],
					[Date.UTC(2014,2,28), 0.6 ],
					[Date.UTC(2014,2,29), 0.7 ],
					[Date.UTC(2014,2,30), 0.8 ],
					[Date.UTC(2014,2,31), 0.6 ],
					[Date.UTC(2014,3,1), 0.6 ],
					[Date.UTC(2014,3,2), 0.67]
				];
season_data_2 = [
					[Date.UTC(2014,2,12), 1.14],
					[Date.UTC(2014,2,13), 1.08],
					[Date.UTC(2014,2,14), 2.77],
					[Date.UTC(2014,2,15), 2.87],
					[Date.UTC(2014,2,16), 3.30],
					[Date.UTC(2014,2,17), 3.15],
					[Date.UTC(2014,2,18), 3.05],
					[Date.UTC(2014,2,19), 2.16],
					[Date.UTC(2014,2,20), 2.67],
					[Date.UTC(2014,2,21), 2.62],
					[Date.UTC(2014,2,22), 2.5 ],
					[Date.UTC(2014,2,23), 2.0 ],
					[Date.UTC(2014,2,24), 1.19],
					[Date.UTC(2014,2,25), 0.52],
					[Date.UTC(2014,2,26), 1.25],
					[Date.UTC(2014,2,27), 0.1 ],
					[Date.UTC(2014,2,28), 0.5 ],
					[Date.UTC(2014,2,29), 0.56],
					[Date.UTC(2014,2,30), 0.71],
					[Date.UTC(2014,2,31), 1.8 ],
					[Date.UTC(2014,3,1), 1.6 ],
					[Date.UTC(2014,3,2), 0.76]
				];
season_data_3 = [
					[Date.UTC(2014,2,12), 1.24],
					[Date.UTC(2014,2,13), 1.48],
					[Date.UTC(2014,2,14), 2.67],
					[Date.UTC(2014,2,15), 2.17],
					[Date.UTC(2014,2,16), 3.0],
					[Date.UTC(2014,2,17), 3.5],
					[Date.UTC(2014,2,18), 3.05],
					[Date.UTC(2014,2,19), 2.16],
					[Date.UTC(2014,2,20), 2.67],
					[Date.UTC(2014,2,21), 2.62],
					[Date.UTC(2014,2,22), 2.5 ],
					[Date.UTC(2014,2,23), 2.0 ],
					[Date.UTC(2014,2,24), 1.19],
					[Date.UTC(2014,2,25), 0.52],
					[Date.UTC(2014,2,26), 1.25],
					[Date.UTC(2014,2,27), 1.1 ],
					[Date.UTC(2014,2,28), 0.6 ],
					[Date.UTC(2014,2,29), 1.56],
					[Date.UTC(2014,2,30), 1.99],
					[Date.UTC(2014,2,31), 2.5 ],
					[Date.UTC(2014,3,1), 2.6 ],
					[Date.UTC(2014,3,2), 1.76]
				];
season_data_4 = [
					[Date.UTC(2014,2,12), 1.84],
					[Date.UTC(2014,2,13), 1.80],
					[Date.UTC(2014,2,14), 1.80],
					[Date.UTC(2014,2,15), 1.92],
					[Date.UTC(2014,2,16), 2.49],
					[Date.UTC(2014,2,17), 2.79],
					[Date.UTC(2014,2,18), 2.73],
					[Date.UTC(2014,2,19), 2.61],
					[Date.UTC(2014,2,20), 2.76],
					[Date.UTC(2014,2,21), 2.82],
					[Date.UTC(2014,2,22), 2.8 ],
					[Date.UTC(2014,2,23), 2.1 ],
					[Date.UTC(2014,2,24), 1.1 ],
					[Date.UTC(2014,2,25), 0.25],
					[Date.UTC(2014,2,26), 0   ],
					[Date.UTC(2014,2,27), 0   ],
					[Date.UTC(2014,2,28), 0.6 ],
					[Date.UTC(2014,2,29), 0.7 ],
					[Date.UTC(2014,2,30), 0.8 ],
					[Date.UTC(2014,2,31), 0.6 ],
					[Date.UTC(2014,3,1), 0.6 ],
					[Date.UTC(2014,3,2), 0.67]
				];
year_data_1 = [
					[Date.UTC(2014,0), 1.84],
					[Date.UTC(2014,1), 1.80],
					[Date.UTC(2014,2), 1.80],
					[Date.UTC(2014,3), 1.92],
					[Date.UTC(2014,4), 2.49],
					[Date.UTC(2014,5), 2.79],
					[Date.UTC(2014,6), 2.73],
					[Date.UTC(2014,7), 2.61],
					[Date.UTC(2014,8), 2.76],
					[Date.UTC(2014,9), 2.82],
					[Date.UTC(2014,10), 2.8 ],
					[Date.UTC(2014,11), 2.1 ]						
				];
year_data_2 = [
					[Date.UTC(2014,0), 1.14],
					[Date.UTC(2014,1), 1.08],
					[Date.UTC(2014,2), 2.77],
					[Date.UTC(2014,3), 2.87],
					[Date.UTC(2014,4), 3.30],
					[Date.UTC(2014,5), 3.15],
					[Date.UTC(2014,6), 3.05],
					[Date.UTC(2014,7), 2.16],
					[Date.UTC(2014,8), 2.67],
					[Date.UTC(2014,9), 2.62],
					[Date.UTC(2014,10), 2.5 ],
					[Date.UTC(2014,11), 2.0 ]
				];
year_data_3 = [
					[Date.UTC(2014,0), 1.24],
					[Date.UTC(2014,1), 1.48],
					[Date.UTC(2014,2), 2.67],
					[Date.UTC(2014,3), 2.17],
					[Date.UTC(2014,4), 3.0],
					[Date.UTC(2014,5), 3.5],
					[Date.UTC(2014,6), 3.05],
					[Date.UTC(2014,7), 2.16],
					[Date.UTC(2014,8), 2.67],
					[Date.UTC(2014,9), 2.62],
					[Date.UTC(2014,10), 2.5 ],
					[Date.UTC(2014,11), 2.0 ]
				];
year_data_4 = [
					[Date.UTC(2014,0), 1.84],
					[Date.UTC(2014,1), 1.80],
					[Date.UTC(2014,2), 1.80],
					[Date.UTC(2014,3), 1.92],
					[Date.UTC(2014,4), 2.49],
					[Date.UTC(2014,5), 2.79],
					[Date.UTC(2014,6), 2.73],
					[Date.UTC(2014,7), 2.61],
					[Date.UTC(2014,8), 2.76],
					[Date.UTC(2014,9), 2.82],
					[Date.UTC(2014,10), 2.8 ],
					[Date.UTC(2014,11), 2.1 ]						
				];
