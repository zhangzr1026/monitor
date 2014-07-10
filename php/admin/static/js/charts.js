// document ready function
$(document).ready(function() { 	

	var divElement = $('div'); //log all div elements

	//--------------- Data tables ------------------//
	if($('table').hasClass('dynamicTable')){
		$('.dynamicTable').dataTable({
			"sPaginationType": "full_numbers",
			"bJQueryUI": false,
			"bAutoWidth": false,
			"bSort": false, //排序功能
			"bLengthChange": false,
			"fnInitComplete": function(oSettings, json) {
		      $('.dataTables_filter>label>input').attr('id', 'search');
		    }
		});
	}

	//-------------- Date Picker ------------------//
	$('#today_constr_date_popform').datepicker({ 
		prevText: "",
		nextText: "",
		maxDate: '-1d',
		minDate: '-12m',
		dateFormat: "yy.mm.dd",
		onSelect: function(dateText, inst){
			var date = $(this).val();
			var chart = $('.once-duration-chart').highcharts();
			chart.addSeries({
				name: $(this).val(),
				data: [5.5, 11.6, 20.9, 29.9, 18.5, 10.5, 2.1, 1.0]
			});
			$('#today_constr_date_popform').hide();
		} 
	});
	$('#once-duration-date').click(function(){
		$('#today_constr_date_popform').show();
	});

	//Boostrap modal
	$('#myModal').modal({ show: false});
	
	//add event to modal after closed
	$('#myModal').on('hidden', function () {
	  	console.log('modal is closed');
	})
	
	//User charts	
	if (divElement.hasClass('user-trends-switch')) {
		var userSwitch = $('.user-trends-switch');
		var buttonGroup = userSwitch.find('.btn');
		
		//User
		buttonGroup.each(function(index) {
			$this = $(this);
			if($this.hasClass('active')) {
				UserChart($this.attr('particle'));
			}
		});

		//User switch
		buttonGroup.click(function(event) {
			$this = $(this);
			if($this.hasClass('active')) {
				return;
			} else {
				buttonGroup.each(function(index) {
					$(this).removeClass('active');
				});
				$this.addClass('active');
				UserChart($this.attr('particle'));
			}
		});
	}

	function UserChart(particle){
		var series, title, color;
		//prepare data
		switch(particle)
		{
			case 'increased':
			title = '最近30天新增用户';
			color = '#00abe8',
			series = [{
                name: '新增用户数',
				color: '#00abe8',
                data: [
                    [Date.UTC(2014,  3,  1), 0   ],
                    [Date.UTC(2014,  3,  2), 0.6 ],
                    [Date.UTC(2014,  3,  3), 0.7 ],
                    [Date.UTC(2014,  3,  4), 0.8 ],
                    [Date.UTC(2014,  3,  5), 0.6 ],
                    [Date.UTC(2014,  3,  6), 0.6 ],
                    [Date.UTC(2014,  3,  7), 0.67],
                    [Date.UTC(2014,  3,  8), 0.81],
                    [Date.UTC(2014,  3,  9), 0.78],
                    [Date.UTC(2014,  3, 10), 0.98],
                    [Date.UTC(2014,  3, 11), 1.84],
                    [Date.UTC(2014,  3, 12), 1.80],
                    [Date.UTC(2014,  3, 13), 1.80],
                    [Date.UTC(2014,  3, 14), 1.92],
                    [Date.UTC(2014,  3, 15), 2.49],
                    [Date.UTC(2014,  3, 16), 2.79],
                    [Date.UTC(2014,  3, 17), 2.73],
                    [Date.UTC(2014,  3, 18), 2.61],
                    [Date.UTC(2014,  3, 19), 2.76],
                    [Date.UTC(2014,  3, 20), 2.82],
                    [Date.UTC(2014,  3, 21), 2.8 ],
                    [Date.UTC(2014,  3, 22), 2.1 ],
                    [Date.UTC(2014,  3, 23), 1.1 ],
                    [Date.UTC(2014,  3, 24), 0.25],
                    [Date.UTC(2014,  3, 25), 0   ]
                ]
            }];
			break;
			case 'active':
			title = '最近30天活跃用户';
			color = '#8bbc21',
			series = [{
                name: '活跃用户数',
				color: '#8bbc21',
                data: [
                    [Date.UTC(1970,  9, 18), 0   ],
                    [Date.UTC(1970,  9, 26), 0.2 ],
                    [Date.UTC(1970, 11,  1), 0.47],
                    [Date.UTC(1970, 11, 11), 0.55],
                    [Date.UTC(1970, 11, 25), 1.38],
                    [Date.UTC(1971,  0,  8), 1.38],
                    [Date.UTC(1971,  0, 15), 1.38],
                    [Date.UTC(1971,  1,  1), 1.38],
                    [Date.UTC(1971,  1,  8), 1.48],
                    [Date.UTC(1971,  1, 21), 1.5 ],
                    [Date.UTC(1971,  2, 12), 1.89],
                    [Date.UTC(1971,  2, 25), 2.0 ],
                    [Date.UTC(1971,  3,  4), 1.94],
                    [Date.UTC(1971,  3,  9), 1.91],
                    [Date.UTC(1971,  3, 13), 1.75],
                    [Date.UTC(1971,  3, 19), 1.6 ],
                    [Date.UTC(1971,  4, 25), 0.6 ],
                    [Date.UTC(1971,  4, 31), 0.35],
                    [Date.UTC(1971,  5,  7), 0   ]
                ]
            }];
			break;
			case 'device-connect':
			title = '最近30天设备连接';
			color = '#0d233a',
			series = [{
                name: '设备连接数',
				color: '#0d233a',
                data: [
                    [Date.UTC(1970,  9,  9), 0   ],
                    [Date.UTC(1970,  9, 14), 0.15],
                    [Date.UTC(1970, 10, 28), 0.35],
                    [Date.UTC(1970, 11, 12), 0.46],
                    [Date.UTC(1971,  0,  1), 0.59],
                    [Date.UTC(1971,  0, 24), 0.58],
                    [Date.UTC(1971,  1,  1), 0.62],
                    [Date.UTC(1971,  1,  7), 0.65],
                    [Date.UTC(1971,  1, 23), 0.77],
                    [Date.UTC(1971,  2,  8), 0.77],
                    [Date.UTC(1971,  2, 14), 0.79],
                    [Date.UTC(1971,  2, 24), 0.86],
                    [Date.UTC(1971,  3,  4), 0.8 ],
                    [Date.UTC(1971,  3, 18), 0.94],
                    [Date.UTC(1971,  3, 24), 0.9 ],
                    [Date.UTC(1971,  4, 16), 0.39],
                    [Date.UTC(1971,  4, 21), 0   ]
                ]
            }];
			break;
			default:
			title = '最近30天新增用户';
			color = '#00abe8',
			series = [{
                name: '新增用户数',
				color: '#00abe8',
                data: [
                    [Date.UTC(2014,  3,  1), 0   ],
                    [Date.UTC(2014,  3,  2), 0.6 ],
                    [Date.UTC(2014,  3,  3), 0.7 ],
                    [Date.UTC(2014,  3,  4), 0.8 ],
                    [Date.UTC(2014,  3,  5), 0.6 ],
                    [Date.UTC(2014,  3,  6), 0.6 ],
                    [Date.UTC(2014,  3,  7), 0.67],
                    [Date.UTC(2014,  3,  8), 0.81],
                    [Date.UTC(2014,  3,  9), 0.78],
                    [Date.UTC(2014,  3, 10), 0.98],
                    [Date.UTC(2014,  3, 11), 1.84],
                    [Date.UTC(2014,  3, 12), 1.80],
                    [Date.UTC(2014,  3, 13), 1.80],
                    [Date.UTC(2014,  3, 14), 1.92],
                    [Date.UTC(2014,  3, 15), 2.49],
                    [Date.UTC(2014,  3, 16), 2.79],
                    [Date.UTC(2014,  3, 17), 2.73],
                    [Date.UTC(2014,  3, 18), 2.61],
                    [Date.UTC(2014,  3, 19), 2.76],
                    [Date.UTC(2014,  3, 20), 2.82],
                    [Date.UTC(2014,  3, 21), 2.8 ],
                    [Date.UTC(2014,  3, 22), 2.1 ],
                    [Date.UTC(2014,  3, 23), 1.1 ],
                    [Date.UTC(2014,  3, 24), 0.25],
                    [Date.UTC(2014,  3, 25), 0   ]
                ]
            }];

		}
		$(function () {
		$('.user-trends-chart').highcharts({
            chart: {
                type: 'spline'
            },
            title: {
                text: title
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
                    month: '%e. %b',
                    year: '%b'
                }
            },
            yAxis: {
                title: {
                    text: '人数 (k)'
                },
                min: 0
            },
            tooltip: {
                formatter: function() {
                        return '<b>'+ this.series.name +'</b><br/>'+
                        Highcharts.dateFormat('%e. %b', this.x) +': '+ this.y +' m';
                }
            },
			plotOptions: {
                series: {
					marker: {
		    			fillColor: 'white',
		    			lineWidth: 2,
		    			lineColor: color
		    		}
                }
            },
            series: series
        });
		});
	}

	//Once duration chart
	if (divElement.hasClass('once-duration-chart')) {
	$(function () {
		// Create the chart
        $('.once-duration-chart').highcharts({
        chart: {
			type: 'column'
        },
		title: {
            text: '单次用户使用时长'
        },
        xAxis: {
            //type: 'category'
			categories: [
                    '1-3秒',
					'4-10秒',
					'11-30秒',
					'31-60秒',
					'1-3分',
					'3-10分',
					'10-30分',
					'30分以上'
                ]
        },
        yAxis: {
            title: {
				text: '所占百分比'
            }
        },
        legend: {
			layout: 'horizontal',
			align: 'center',
			verticalAlign: 'bottom',
			borderWidth: 0
        },
        plotOptions: {
            series: {
				borderWidth: 0,
				dataLabels: {
					enabled: true,
					format: '{point.y:.1f}%'
				}
            }
		},

		tooltip: {
			headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
			pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
		}, 

		series: [{
			name: '2014.4.1',
			//colorByPoint: true,
			data: [8.0,11.3,27.3,25.1,20.9,6.2,1.0,0]
        }]
		});
	});
	}

	//Terminal chart 
	if (divElement.hasClass('terminal-chart')) {
	$(function() {
		var chart;
		// Create the chart
        $('.terminal-chart').highcharts({
			chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: ''
            },
            tooltip: {
        	    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
					allowPointSelect: true,
					dataLabels: {
						enabled: true,
						distance: -50,
						style: {
							fontWeight: 'bold',
							color: 'white',
							textShadow: '0px 1px 2px black'
						}
					}	
				}
            },
			legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'bottom',
                borderWidth: 0
            },
            series: [{
                type: 'pie',
                name: '占有率',
                data: [{
					name: 'iOS',
					y: 55.0,
					color:'#94c2cd',
					sliced: true,
                    selected: true
				},{
					name: 'Android',
					y: 45.0,
					color:'#ed7a53'
				}]
            }]
		});
	});
	}

	//Use frequency
	if (divElement.hasClass('use-frequency-chart')) {
	$(function() {
		var chart;
		// Create the chart
		$('.use-frequency-chart').highcharts({
			chart: {
                type: 'area'
            },
            title: {
                text: '启动次数统计'
            },
            xAxis: {
				type: 'datetime',
				labels: {
					step: 1, 
					formatter: function () {
						return Highcharts.dateFormat('%m.%d', this.value);
					}
				}
            },
            yAxis: {
                title: {
                    text: '次数'
                },
                labels: {
                    formatter: function() {
                        return this.value / 1000 +'k';
                    }
                }
            },
            tooltip: {
                pointFormat: '{series.name} {point.y:,.0f}'
            },
            plotOptions: {
                area: {
                    //pointStart: 2014-3-1,
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                }
            },
            series: [{
                name: '启动次数',
				color: '#86bbc8',
                data: [ 
					[Date.UTC(2014,  3,  1), 8339],
					[Date.UTC(2014,  3,  2), 27935],
					[Date.UTC(2014,  3,  3), 45000],
					[Date.UTC(2014,  3,  4), 23000],
					[Date.UTC(2014,  3,  5), 15915],
					[Date.UTC(2014,  3,  6), 13092],
					[Date.UTC(2014,  3,  7), 18000],
					[Date.UTC(2014,  3,  8), 14478],
					[Date.UTC(2014,  3,  9), 43000],
					[Date.UTC(2014,  3,  10), 33000],
					[Date.UTC(2014,  3,  11), 24000],
					[Date.UTC(2014,  3,  12), 25000],
					[Date.UTC(2014,  3,  13), 22000],
					[Date.UTC(2014,  3,  14), 39197],
					[Date.UTC(2014,  3,  15), 13092],
					[Date.UTC(2014,  3,  16), 19055],
					[Date.UTC(2014,  3,  17), 45000],
					[Date.UTC(2014,  3,  18), 11643],
					[Date.UTC(2014,  3,  19), 33000],
					[Date.UTC(2014,  3,  20), 14478],
					[Date.UTC(2014,  3,  21), 31000],
					[Date.UTC(2014,  3,  22), 18000],
					[Date.UTC(2014,  3,  23), 16000],
					[Date.UTC(2014,  3,  24), 17000],
					[Date.UTC(2014,  3,  25), 9399],
					[Date.UTC(2014,  3,  26), 7089],
					[Date.UTC(2014,  3,  27), 10538],
					[Date.UTC(2014,  3,  28), 11643],
					[Date.UTC(2014,  3,  29), 6129],
					[Date.UTC(2014,  3,  30), 19055]]
            }]	
		});
	});	
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