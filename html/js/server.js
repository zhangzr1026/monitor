// document ready function
$(document).ready(function() { 	

	var divElement = $('div'); //log all div elements

	//-------------- Date Picker ------------------//
	$('.singledate').datepicker({
		prevText: "",
		nextText: "",
		maxDate: '-1d',
		minDate: '-12m',
		dateFormat: "yy.mm.dd",
		onSelect: function(dateText, inst){
			$this = $(this);
			var date = $this.val();
			var id_head = $this.attr('id').split('_',1);

			//remove data range active
			$('#'+id_head+'-date-switch li').each(function(index){
				$(this).removeClass('active');
			});

			//repaint highcharts
			var chart = $('.'+id_head+'-state-chart').highcharts();
			$this.hide();
		} 
	});

	$('#cpu-history-date').click(function(){
		$('#cpu_today_constr_date_popform').show();
	});

	$('#memory-history-date').click(function(){
		$('#memory_today_constr_date_popform').show();
	});

	$('#io-history-date').click(function(){
		$('#io_today_constr_date_popform').show();
	});

	$('#network-history-date').click(function(){
		$('#network_today_constr_date_popform').show();
	});
	//-------------- Date Picker End---------------//

	//Boostrap modal
	$('#myModal').modal({ show: false});
	
	//add event to modal after closed
	$('#myModal').on('hidden', function () {
	  	console.log('modal is closed');
	})
	
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
						CPUChart(particle_data, particle_time);
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
						CPUChart(particle_data, particle_time);
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
						CPUChart(particle_data, particle_time);
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
				MemoryChart(particle_time);
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
				MemoryChart($this.attr('particle'));
			}
		});
	})();
	}

	//IO chart
	if (divElement.hasClass('io-state-chart')) {
	(function(){
		var timeSwitch = $('#io-date-switch ul');
		var timeGroup = timeSwitch.find('li');

		timeGroup.each(function(index){
			$this = $(this);
			if($this.hasClass('active')){
				var particle_time = $this.attr('particle');
				IOChart(particle_time);
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
				IOChart($this.attr('particle'));
			}
		});
	})();
	}

	//Network chart
	if (divElement.hasClass('network-state-chart')) {
	(function(){
		var cateSwitch = $('.network-state-switch');
		var buttonGroup = cateSwitch.find('.btn');
		var timeSwitch = $('#network-date-switch ul');
		var timeGroup = timeSwitch.find('li');

		//Network
		buttonGroup.each(function(index) {
			$this = $(this);
			if($this.hasClass('active')) {
				var particle_data = $this.attr('particle');
				timeGroup.each(function(index){
					$this = $(this);
					if($this.hasClass('active')){
						var particle_time = $this.attr('particle');
						NetworkChart(particle_data, particle_time);
					}
				});
			}
		});

		//Network switch
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
						NetworkChart(particle_data, particle_time);
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
						NetworkChart(particle_data, particle_time);
					}
				});
			}
		});
	})();
	}

});//End document ready functions

//sparkline in sidebar area
var positive = [1,5,3,7,8,6,10];
var negative = [10,6,8,7,3,5,1]
var negative1 = [7,6,8,7,6,5,4]

$('#stat1').sparkline(positive,{
	height:15,
	spotRadius: 0,
	barColor: '#9FC569',
	type: 'bar'
});
$('#stat2').sparkline(negative,{
	height:15,
	spotRadius: 0,
	barColor: '#ED7A53',
	type: 'bar'
});
$('#stat3').sparkline(negative1,{
	height:15,
	spotRadius: 0,
	barColor: '#ED7A53',
	type: 'bar'
});
$('#stat4').sparkline(positive,{
	height:15,
	spotRadius: 0,
	barColor: '#9FC569',
	type: 'bar'
});
//sparkline in widget
$('#stat5').sparkline(positive,{
	height:15,
	spotRadius: 0,
	barColor: '#9FC569',
	type: 'bar'
});

$('#stat6').sparkline(positive, { 
	width: 70,//Width of the chart - Defaults to 'auto' - May be any valid css width - 1.5em, 20px, etc (using a number without a unit specifier won't do what you want) - This option does nothing for bar and tristate chars (see barWidth)
	height: 20,//Height of the chart - Defaults to 'auto' (line height of the containing tag)
	lineColor: '#88bbc8',//Used by line and discrete charts to specify the colour of the line drawn as a CSS values string
	fillColor: '#f2f7f9',//Specify the colour used to fill the area under the graph as a CSS value. Set to false to disable fill
	spotColor: '#e72828',//The CSS colour of the final value marker. Set to false or an empty string to hide it
	maxSpotColor: '#005e20',//The CSS colour of the marker displayed for the maximum value. Set to false or an empty string to hide it
	minSpotColor: '#f7941d',//The CSS colour of the marker displayed for the mimum value. Set to false or an empty string to hide it
	spotRadius: 3,//Radius of all spot markers, In pixels (default: 1.5) - Integer
	lineWidth: 2//In pixels (default: 1) - Integer
});

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

var yAxis = {
            title: {
               text: ''
            },
            min: 0,
			minorGridLineWidth: 0,
            gridLineWidth: 0,
            alternateGridColor: 'rgba(68, 170, 213, 0.1)'
        };

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

function CPUChart(particle_data, particle_time){
	var series, title, xAxis, tooltip;
	//prepare data range
	var arr = DateRange(particle_time);
	xAxis = arr[0];
	tooltip = arr[1];
	
	//prepare data 	
	switch (particle_data)
	{
		case 'cpu-info':
		title = 'CPU info';
		if (particle_time == 'day') {
			series = [{
				name: 'CPU load',
				data: day_data_1
			}, {
				name: 'CPU sys',
				data: day_data_2
			}, {
				name: 'CPU user',
				data: day_data_3
			}];
		} else if(particle_time == 'week'){
			series = [{
				name: 'CPU load',
				data: week_data_1
			}, {
				name: 'CPU sys',
				data: week_data_2
			}, {
				name: 'CPU user',
				data: week_data_3
			}];
		} else if(particle_time == 'month') {
			series = [{
				name: 'CPU load',
				data: month_data_1
			}, {
				name: 'CPU sys',
				data: month_data_2
			}, {
				name: 'CPU user',
				data: month_data_3
			}];
		} else if(particle_time == 'season') {
			series = [{
				name: 'CPU load',
				data: season_data_1
			}, {
				name: 'CPU sys',
				data: season_data_2
			}, {
				name: 'CPU user',
				data: season_data_3
			}];
		} else if (particle_time == 'year') {
			series = [{
				name: 'CPU load',
				data: year_data_1
			}, {
				name: 'CPU sys',
				data: year_data_2
			}, {
				name: 'CPU user',
				data: year_data_3
			}];
		}	
		break;
		case 'cpu-IO':
		title = 'CPU IOWait';
		color = '#8bbc21';
		if (particle_time == 'day') {
			series = [{
				name: 'CPU IOWait',
				data: day_data_4
			}];
		} else if(particle_time == 'week'){
			series = [{
				name: 'CPU IOWait',
				data: week_data_4
			}];
		} else if(particle_time == 'month') {
			series = [{
				name: 'CPU IOWait',
				data: month_data_4
			}];
		} else if(particle_time == 'season') {
			series = [{
				name: 'CPU IOWait',
				data: season_data_4
			}];
		} else if (particle_time == 'year') {
			series = [{
				name: 'CPU IOwrite',
				data: year_data_4
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

function MemoryChart(particle_time){
	var series, title, xAxis ,tooltip;
	//prepare data range
	var arr = DateRange(particle_time);
	xAxis = arr[0];
	tooltip = arr[1];

	title = 'Memory info';
	if (particle_time == 'day') {
		series = [{
			name: 'Total',
			data: day_data_1
		}, {
			name: 'used',
			data: day_data_2
		}, {
			name: 'free',
			data: day_data_3
		}, {
			name: 'buffer ',
			data: day_data_4
		}, {
			name: 'cache ',
			data: []
		}];
	} else if (particle_time == 'week') {
		series = [{
			name: 'Total',
			data: week_data_1
		}, {
			name: 'used',
			data: week_data_2
		}, {
			name: 'free',
			data: week_data_3
		}, {
			name: 'buffer ',
			data: week_data_4
		}, {
			name: 'cache ',
			data: []
		}];
	} else if (particle_time == 'month') {
		series = [{
			name: 'Total',
			data: month_data_1
		}, {
			name: 'used',
			data: month_data_2
		}, {
			name: 'free',
			data: month_data_3
		}, {
			name: 'buffer ',
			data: month_data_4
		}, {
			name: 'cache ',
			data: []
		}];
	} else if (particle_time == 'season') {
		series = [{
			name: 'Total',
			data: season_data_1
		}, {
			name: 'used',
			data: season_data_2
		}, {
			name: 'free',
			data: season_data_3
		}, {
			name: 'buffer ',
			data: season_data_4
		}, {
			name: 'cache ',
			data: []
		}];
	} else if (particle_time == 'year') {
		series = [{
			name: 'Total',
			data: year_data_1
		}, {
			name: 'used',
			data: year_data_2
		}, {
			name: 'free',
			data: year_data_3
		}, {
			name: 'buffer ',
			data: year_data_4
		}, {
			name: 'cache ',
			data: []
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

function IOChart(particle_time){
	var series, title, xAxis ,tooltip;
	//prepare data range
	var arr = DateRange(particle_time);
	xAxis = arr[0];
	tooltip = arr[1];

	title = 'IO info';
	if (particle_time == 'day') {
		series = [{
			name: 'read',
			data: day_data_1
		}, {
			name: 'write',
			data: day_data_2
		}];
	} else if (particle_time == 'week') {
		series = [{
			name: 'read',
			data: week_data_1
		}, {
			name: 'write',
			data: week_data_2
		}];
	} else if (particle_time == 'month') {
		series = [{
			name: 'read',
			data: month_data_1
		}, {
			name: 'write',
			data: month_data_2
		}];
	} else if (particle_time == 'season') {
		series = [{
			name: 'read',
			data: season_data_1
		}, {
			name: 'write',
			data: season_data_2
		}];
	} else if (particle_time == 'year') {
		series = [{
			name: 'read',
			data: year_data_1
		}, {
			name: 'write',
			data: year_data_2
		}];
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

function NetworkChart(particle_data, particle_time){
	var series, title, xAxis ,tooltip;
	//prepare data range
	var arr = DateRange(particle_time);
	xAxis = arr[0];
	tooltip = arr[1];

	//prepare data 	
	switch (particle_data){
		case 'network-info' : 
		title = 'Network info';
		if (particle_time == 'day') {
			series = [{
				name: 'recice packets',
				data: day_data_1
			}, {
				name: 'send packts',
				data: day_data_2
			}];
		} else if (particle_time == 'week') {
			series = [{
				name: 'recice packets',
				data: week_data_1
			}, {
				name: 'send packts',
				data: week_data_2
			}];
		} else if (particle_time == 'month') {
			series = [{
				name: 'recice packets',
				data: month_data_1
			}, {
				name: 'send packts',
				data: month_data_2
			}];
		} else if (particle_time == 'season') {
			series = [{
				name: 'recice packets',
				data: season_data_1
			}, {
				name: 'send packts',
				data: season_data_2
			}];
		} else if (particle_time == 'year') {
			series = [{
				name: 'recice packets',
				data: year_data_1
			}, {
				name: 'send packts',
				data: year_data_2
			}];
		}
		break;
		case 'network-speed':
		if (particle_time == 'day') {
			series = [{
				name: 'receive kb/s',
				data: day_data_3
			}, {
				name: 'send kb/s',
				data: day_data_4
			}];
		} else if (particle_time == 'week') {
			series = [ {
				name: 'receive kb/s',
				data: week_data_3
			}, {
				name: 'send kb/s',
				data: week_data_4
			}];
		} else if (particle_time == 'month') {
			series = [{
				name: 'receive kb/s',
				data: month_data_3
			}, {
				name: 'send kb/s',
				data: month_data_4
			}];
		} else if (particle_time == 'season') {
			series = [{
				name: 'receive kb/s',
				data: season_data_3
			}, {
				name: 'send kb/s',
				data: season_data_4
			}];
		} else if (particle_time == 'year') {
			series = [{
				name: 'receive kb/s',
				data: year_data_3
			}, {
				name: 'send kb/s',
				data: year_data_4
			}];
		}
		break;
	}
	
	$(function () {
	$('.network-state-chart').highcharts({
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
var day_data_2 = [
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
var day_data_3 = [
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
var day_data_4 = [
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
var week_data_1 = [
					[Date.UTC(2014,2,27), 0   ],
					[Date.UTC(2014,2,28), 0.6 ],
					[Date.UTC(2014,2,29), 0.7 ],
					[Date.UTC(2014,2,30), 0.8 ],
					[Date.UTC(2014,2,31), 0.6 ],
					[Date.UTC(2014,3,1), 0.6 ],
					[Date.UTC(2014,3,2), 0.67]
				];
var week_data_2 = [
					[Date.UTC(2014,2,27), 0.1 ],
					[Date.UTC(2014,2,28), 0.5 ],
					[Date.UTC(2014,2,29), 0.56],
					[Date.UTC(2014,2,30), 0.71],
					[Date.UTC(2014,2,31), 1.8 ],
					[Date.UTC(2014,3,1), 1.6 ],
					[Date.UTC(2014,3,2), 0.76]
				];
var week_data_3 = [
					[Date.UTC(2014,2,27), 1.1 ],
					[Date.UTC(2014,2,28), 0.6 ],
					[Date.UTC(2014,2,29), 1.56],
					[Date.UTC(2014,2,30), 1.99],
					[Date.UTC(2014,2,31), 2.5 ],
					[Date.UTC(2014,3,1), 2.6 ],
					[Date.UTC(2014,3,2), 1.76]
				];
var week_data_4 = [
					[Date.UTC(2014,2,27), 0   ],
					[Date.UTC(2014,2,28), 0.6 ],
					[Date.UTC(2014,2,29), 0.7 ],
					[Date.UTC(2014,2,30), 0.8 ],
					[Date.UTC(2014,2,31), 0.6 ],
					[Date.UTC(2014,3,1), 0.6 ],
					[Date.UTC(2014,3,2), 0.67]
				];
var month_data_1 = [
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
var month_data_2 = [
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
var month_data_3 = [
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
var month_data_4 = [
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
var season_data_1 = [
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
var season_data_2 = [
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
var season_data_3 = [
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
var season_data_4 = [
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
var year_data_1 = [
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
var year_data_2 = [
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
var year_data_3 = [
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
var year_data_4 = [
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