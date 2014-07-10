// document ready function
$(document).ready(function() { 	

	var divElement = $('div'); //log all div elements'
	diskid = request('id');

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

	$('#io-history-date').click(function(){
		$('#io_today_constr_date_popform').show();
	});
	//-------------- Date Picker End---------------//

	//IO chart
	if (divElement.hasClass('io-state-chart')) {
	(function(){
		var cateSwitch = $('.io-state-switch');
		var buttonGroup = cateSwitch.find('.btn');
		var timeSwitch = $('#io-date-switch ul');
		var timeGroup = timeSwitch.find('li');

		//IO
		buttonGroup.each(function(index) {
			$this = $(this);
			if($this.hasClass('active')) {
				var particle_data = $this.attr('particle');
				timeGroup.each(function(index){
					$this = $(this);
					if($this.hasClass('active')){
						var particle_time = $this.attr('particle');
						IOChart(particle_data, particle_time, null);
					}
				});
			}
		});

		//IO switch
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
						IOChart(particle_data, particle_time, null);
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
						IOChart(particle_data, particle_time, null);
					}
				});
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

function IOChart(particle_data, particle_time, history_date){
	var series, title, xAxis, yAxis, tooltip, url;
	//prepare data range
	var arr = DateRange(particle_time);
	xAxis = arr[0];
	tooltip = arr[1];
	yAxis = setUnit(""); 

	//prepare data
	switch (particle_data) {
		case 'IOPS':
		title = 'IOPS';
		url = "";
		if (particle_time == 'history') {
			series = [{
				name: 'tps',
				data: requestAjax("/index.php/Monitor/chartdisktps", getParams_history(diskid, history_date, 'normal'), dataFormat)
			}];
		} else if (particle_time == 'day') {
			series = [{
				name: 'tps',
				data: requestAjax("/index.php/Monitor/chartdisktps", getParams(diskid, particle_time, 'normal'), dataFormat) 
			}];
		} else if (particle_time == 'week') {
			series = [{
				name: 'tps',
				data: requestAjax("/index.php/Monitor/chartdisktps", getParams(diskid, particle_time, 'day'), dataFormat) 
			}];
		} else if (particle_time == 'month') {
			series = [{
				name: 'tps',
				data: requestAjax("/index.php/Monitor/chartdisktps", getParams(diskid, particle_time, 'day'), dataFormat) 
			}];
		} else if (particle_time == 'season') {
			series = [{
				name: 'tps',
				data: requestAjax("/index.php/Monitor/chartdisktps", getParams(diskid, particle_time, 'week'), dataFormat) 
			}];
		} else if (particle_time == 'year') {
			series = [{
				name: 'tps',
				data: requestAjax("/index.php/Monitor/chartdisktps", getParams(diskid, particle_time, 'month'), dataFormat) 
			}];
		}
		break;
		case 'IO-speed':
		title = 'IO-speed';
		yAxis = setUnit('kb');
		url = "kb";
		if (particle_time == 'history') {
			series = [{
				name: 'rsec',
				data: requestAjax("/index.php/Monitor/chartdiskrsec", getParams_history(diskid, history_date, 'normal'), dataFormat)
			},{
				name: 'wsec',
				data: requestAjax("/index.php/Monitor/chartdiskwsec", getParams_history(diskid, history_date, 'normal'), dataFormat)
			}];
		} else if (particle_time == 'day') {
			series = [{
				name: 'rsec',
				data: requestAjax("/index.php/Monitor/chartdiskrsec", getParams(diskid, particle_time, 'normal'), dataFormat) 
			}, {
				name: 'wsec',
				data: requestAjax("/index.php/Monitor/chartdiskwsec", getParams(diskid, particle_time, 'normal'), dataFormat) 
			}];
		} else if (particle_time == 'week') {
			series = [{
				name: 'rsec',
				data: requestAjax("/index.php/Monitor/chartdiskrsec", getParams(diskid, particle_time, 'day'), dataFormat) 
			}, {
				name: 'wsec',
				data: requestAjax("/index.php/Monitor/chartdiskwsec", getParams(diskid, particle_time, 'day'), dataFormat) 
			}];
		} else if (particle_time == 'month') {
			series = [{
				name: 'rsec',
				data: requestAjax("/index.php/Monitor/chartdiskrsec", getParams(diskid, particle_time, 'day'), dataFormat) 
			}, {
				name: 'wsec',
				data: requestAjax("/index.php/Monitor/chartdiskwsec", getParams(diskid, particle_time, 'day'), dataFormat) 
			}];
		} else if (particle_time == 'season') {
			series = [{
				name: 'rsec',
				data: requestAjax("/index.php/Monitor/chartdiskrsec", getParams(diskid, particle_time, 'week'), dataFormat) 
			}, {
				name: 'wsec',
				data: requestAjax("/index.php/Monitor/chartdiskwsec", getParams(diskid, particle_time, 'week'), dataFormat) 
			}];
		} else if (particle_time == 'year') {
			series = [{
				name: 'rsec',
				data: requestAjax("/index.php/Monitor/chartdiskrsec", getParams(diskid, particle_time, 'month'), dataFormat) 
			}, {
				name: 'wsec',
				data: requestAjax("/index.php/Monitor/chartdiskwsec", getParams(diskid, particle_time, 'month'), dataFormat) 
			}];
		}
		break;
		case 'IO-handing':
		title = 'IO-handing';
		yAxis = setUnit('ms');
		url = "";
		if (particle_time == 'history') {
			series = [{
				name: 'await',
				data: requestAjax("/index.php/Monitor/chartdiskawait", getParams_history(diskid, history_date, 'normal'), dataFormat)
			},{
				name: 'svctm',
				data: requestAjax("/index.php/Monitor/chartdisksvctm", getParams_history(diskid, history_date, 'normal'), dataFormat)
			}];
		} else if (particle_time == 'day') {
			series = [{
				name: 'await',
				data: requestAjax("/index.php/Monitor/chartdiskawait", getParams(diskid, particle_time, 'normal'), dataFormat) 
			}, {
				name: 'svctm',
				data: requestAjax("/index.php/Monitor/chartdisksvctm", getParams(diskid, particle_time, 'normal'), dataFormat) 
			}];
		} else if (particle_time == 'week') {
			series = [{
				name: 'await',
				data: requestAjax("/index.php/Monitor/chartdiskawait", getParams(diskid, particle_time, 'day'), dataFormat) 
			}, {
				name: 'svctm',
				data: requestAjax("/index.php/Monitor/chartdisksvctm", getParams(diskid, particle_time, 'day'), dataFormat)
			}];
		} else if (particle_time == 'month') {
			series = [{
				name: 'await',
				data: requestAjax("/index.php/Monitor/chartdiskawait", getParams(diskid, particle_time, 'day'), dataFormat)
			}, {
				name: 'svctm',
				data: requestAjax("/index.php/Monitor/chartdisksvctm", getParams(diskid, particle_time, 'day'), dataFormat)
			}];
		} else if (particle_time == 'season') {
			series = [{
				name: 'await',
				data: requestAjax("/index.php/Monitor/chartdiskawait", getParams(diskid, particle_time, 'week'), dataFormat)
			}, {
				name: 'svctm',
				data: requestAjax("/index.php/Monitor/chartdisksvctm", getParams(diskid, particle_time, 'week'), dataFormat)
			}];
		} else if (particle_time == 'year') {
			series = [{
				name: 'await',
				data: requestAjax("/index.php/Monitor/chartdiskawait", getParams(diskid, particle_time, 'month'), dataFormat)
			}, {
				name: 'svctm',
				data: requestAjax("/index.php/Monitor/chartdisksvctm", getParams(diskid, particle_time, 'month'), dataFormat)
			}];
		}
		break;
		case 'IO-busy':
		title = 'IO-busy';
		yAxis = setUnit('%');
		url = "";
		if (particle_time == 'history') {
			series = [{
				name: 'util',
				data: requestAjax("/index.php/Monitor/chartdiskutil", getParams_history(diskid, history_date, 'normal'), dataFormat)
			}];
		} else if (particle_time == 'day') {
			series = [{
				name: 'util',
				data: requestAjax("/index.php/Monitor/chartdiskutil", getParams(diskid, particle_time, 'normal'), dataFormat) 
			}];
		} else if (particle_time == 'week') {
			series = [{
				name: 'util',
				data: requestAjax("/index.php/Monitor/chartdiskutil", getParams(diskid, particle_time, 'day'), dataFormat) 
			}];
		} else if (particle_time == 'month') {
			series = [{
				name: 'util',
				data: requestAjax("/index.php/Monitor/chartdiskutil", getParams(diskid, particle_time, 'day'), dataFormat)
			}];
		} else if (particle_time == 'season') {
			series = [{
				name: 'util',
				data: requestAjax("/index.php/Monitor/chartdiskutil", getParams(diskid, particle_time, 'week'), dataFormat)
			}];
		} else if (particle_time == 'year') {
			series = [{
				name: 'util',
				data: requestAjax("/index.php/Monitor/chartdiskutil", getParams(diskid, particle_time, 'month'), dataFormat)
			}];
		}
		break;
	}
	
	$(function () {
	$('.io-state-chart').highcharts({
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
	IOChart(particle_data, particle_time, history_date);
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
