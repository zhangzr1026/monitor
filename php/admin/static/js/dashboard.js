// document ready function
$(document).ready(function() { 	

	//------------- Full calendar  -------------//
	$(function () {
		var date = new Date();
		var d = date.getDate();
		var m = date.getMonth();
		var y = date.getFullYear();
		
		//front page calendar
		$('#calendar').fullCalendar({
			//isRTL: true,
			//theme: true,
			header: {
				left: 'title,today',
				center: 'prev,next',
				right: 'month,agendaWeek,agendaDay'
			},
			buttonText: {
	        	prev: '<span class="icon24 icomoon-icon-arrow-left-2"></span>',
	        	next: '<span class="icon24 icomoon-icon-arrow-right-2"></span>'
	    	},
			editable: true,
			events: [
				{
					title: 'All Day Event',
					start: new Date(y, m, 1)
				},
				{
					title: 'Long Event',
					start: new Date(y, m, d-5),
					end: new Date(y, m, d-2)
				},
				{
					id: 999,
					title: 'Repeating Event',
					start: new Date(y, m, d-3, 16, 0),
					allDay: false
				},
				{
					id: 999,
					title: 'Repeating Event',
					start: new Date(y, m, d+4, 16, 0),
					allDay: false
				},
				{
					title: 'Meeting',
					start: new Date(y, m, d, 10, 30),
					allDay: false
				},
				{
					title: 'Lunch',
					start: new Date(y, m, d, 12, 0),
					end: new Date(y, m, d, 14, 0),
					allDay: false,
					color: '#9FC569'
				},
				{
					title: 'Birthday Party',
					start: new Date(y, m, d+1, 19, 0),
					end: new Date(y, m, d+1, 22, 30),
					allDay: false,
					color: '#ED7A53'
				},
				{
					title: 'Click for Google',
					start: new Date(y, m, 28),
					end: new Date(y, m, 29),
					url: 'http://google.com/'
				}
			]
		});
	});

	//Boostrap modal
	$('#myModal').modal({ show: false});
	
	//add event to modal after closed
	$('#myModal').on('hidden', function () {
	  	console.log('modal is closed');
	})


	//circular progrress bar
	$(function () {

		$(".greenCircle").knob({
            'min':0,
            'max':100,
            'readOnly': true,
            'width': 80,
            'height': 80,
            'fgColor': '#9FC569',
            'dynamicDraw': true,
            'thickness': 0.2,
            'tickColorizeValues': true
        })
        $(".redCircle").knob({
            'min':0,
            'max':100,
            'readOnly': true,
            'width': 80,
            'height': 80,
            'fgColor': '#ED7A53',
            'dynamicDraw': true,
            'thickness': 0.2,
            'tickColorizeValues': true
        })
        $(".blueCircle").knob({
            'min':0,
            'max':100,
            'readOnly': true,
            'width': 80,
            'height': 80,
            'fgColor': '#88BBC8',
            'dynamicDraw': true,
            'thickness': 0.2,
            'tickColorizeValues': true
        })

	});

	var divElement = $('div'); //log all div elements

	//------------- Visitor chart -------------//

	if (divElement.hasClass('visitors-chart')) {
	$(function () {
		$('.visitors-chart').highcharts({
			chart: {
				zoomType: 'x',
			},
            title: {
				text:'',
                x: -20 //center
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {
                title: {
                    text: 'Temperature (°C)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: '°C'
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                borderWidth: 0
            },
            series: [{
                name: 'Tokyo',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }, {
                name: 'New York',
                data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
            }, {
                name: 'Berlin',
                data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
            }, {
                name: 'London',
                data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
            }]
        });	        
    });
    }//end if

    //pie visits graph
	if (divElement.hasClass('pieStats')) {
	$(function () {
		var chart;
		// Build the chart
        $('.pieStats').highcharts({
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
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
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
                name: 'Browser share',
                data: [
                    ['Firefox',   45.0],
                    ['IE',       26.8],
                    {
                        name: 'Chrome',
                        y: 12.8,
                        sliced: true,
                        selected: true
                    },
                    ['Safari',    8.5],
                    ['Opera',     6.2],
                    ['Others',   0.7]
                ]
            }]
        });
	});
	}//end if

	//Active user charts	
	if (divElement.hasClass('active-user-switch')) {
		var activeUserSwitch = $('.active-user-switch');
		var buttonGroup = activeUserSwitch.find('.btn');
		
		//Active user
		buttonGroup.each(function(index) {
			$this = $(this);
			if($this.hasClass('active')) {
				ActiveUserChart($this.attr('particle'));
			}
		});

		//Active user switch
		buttonGroup.click(function(event) {
			$this = $(this);
			if($this.hasClass('active')) {
				return;
			} else {
				buttonGroup.each(function(index) {
					$(this).removeClass('active');
				});
				$this.addClass('active');
				ActiveUserChart($this.attr('particle'));
			}
		});
	}

	//Dynamic server load graph
	if (divElement.hasClass('server-load-chart')) {
	$(function () {
		Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
    
        var chart;
        $('.server-load-chart').highcharts({
            chart: {
                type: 'spline',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: function() {
    
                        // set up the updating of the chart each second
                        var series = this.series[0];
                        setInterval(function() {
                            var x = (new Date()).getTime(), // current time
                                y = Math.random();
                            series.addPoint([x, y], true, true);
                        }, 1000);
                    }
                }
            },
            title: {
                text: ''
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function() {
                        return '<b>'+ this.series.name +'</b><br/>'+
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                        Highcharts.numberFormat(this.y, 2);
                }
            },
			plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    lineWidth: 1,
                    marker: {
                        enabled: false
                    },
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
				type: 'area',
                name: '负载量',
                data: (function() {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;
    
                    for (i = -19; i <= 0; i++) {
                        data.push({
                            x: time + i * 1000,
                            y: Math.random()
                        });
                    }
                    return data;
                })()
            }]
        });	
	});
	}


});//End document ready functions

//generate random number for charts
randNum = function(){
	//return Math.floor(Math.random()*101);
	return (Math.floor( Math.random()* (1+40-20) ) ) + 20;
}

var chartColours = ['#88bbc8', '#ed7a53', '#9FC569', '#bbdce3', '#9a3b1b', '#5a8022', '#2c7282'];

//sparklines (making loop with random data for all 7 sparkline)
i=1;
for (i=1; i<8; i++) {
 	var data = [[1, 3+randNum()], [2, 5+randNum()], [3, 8+randNum()], [4, 11+randNum()],[5, 14+randNum()],[6, 17+randNum()],[7, 20+randNum()], [8, 15+randNum()], [9, 18+randNum()], [10, 22+randNum()]];
 	placeholder = '.sparkLine' + i;
	$(placeholder).sparkline(data, { 
		width: 100,//Width of the chart - Defaults to 'auto' - May be any valid css width - 1.5em, 20px, etc (using a number without a unit specifier won't do what you want) - This option does nothing for bar and tristate chars (see barWidth)
		height: 30,//Height of the chart - Defaults to 'auto' (line height of the containing tag)
		lineColor: '#88bbc8',//Used by line and discrete charts to specify the colour of the line drawn as a CSS values string
		fillColor: '#f2f7f9',//Specify the colour used to fill the area under the graph as a CSS value. Set to false to disable fill
		spotColor: '#467e8c',//The CSS colour of the final value marker. Set to false or an empty string to hide it
		maxSpotColor: '#9FC569',//The CSS colour of the marker displayed for the maximum value. Set to false or an empty string to hide it
		minSpotColor: '#ED7A53',//The CSS colour of the marker displayed for the mimum value. Set to false or an empty string to hide it
		spotRadius: 3,//Radius of all spot markers, In pixels (default: 1.5) - Integer
		lineWidth: 2//In pixels (default: 1) - Integer
	});
}

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

//rendering activeUser
function ActiveUserChart(particle){
	var series;
	//prepare data
	switch(particle)
	{
		case 'day':
		series = [{
			name: '昨日',
            data: [107, 31],
			color: '#0d233a',
			pointWidth: 15
        }, {
            name: '今日',
            data: [133, 156],
			color: '#8bbc21',
			pointWidth: 15
        }];
		break;
		case 'week':
		series = [{
            name: '上周',
            data: [833, 556],
			color: '#00abe8',
			pointWidth: 15
        }, {
            name: '本周',
            data: [907, 180],
			color: '#8bbc21',
			pointWidth: 15
        }];
		break;
		case 'month':
		series = [{
            name: '上月',
			color: '#aa1919',
			pointWidth: 15,
            data: [3033, 2756]			
        }, {
            name: '本月',
			color: '#8bbc21',
			pointWidth: 15,
            data: [2707, 901]
        }];
		break;
		default:
		series = [{
            name: '昨日',
			color: '#0d233a',
			pointWidth: 15,
            data: [107, 31]
        }, {
            name: '今日',
			color: '#8bbc21',
			pointWidth: 15,
            data: [133, 156]
        }];
	}
	$(function () {
		$('.active-user-chart').highcharts({
            chart: {
                type: 'bar'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: ['v1.0', 'v2.0'],
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Population (millions)',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                valueSuffix: ' millions'
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            legend: {
                layout: 'horizontal',
                align: 'left',
                verticalAlign: 'bottom',
				x: 30,
                y: 10,
                floating: true,
                borderWidth: 1,
                backgroundColor: '#FFFFFF',
                shadow: true
            },
            credits: {
                enabled: false
            },
            series: series
        });
	});
}


