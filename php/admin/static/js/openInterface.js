// document ready function
$(document).ready(function() { 	

	$('input').iCheck({
    	checkboxClass: 'icheckbox_flat-blue',
    	radioClass: 'iradio_flat-blue'
  	});

	//reset max-height of result area 
	var result_max_height = 110;
  	(function(){
  		$('#interfaceList tbody tr').each(function() {
  			var max_height = Number($(this).css('height').split('px')[0])-20;
  			if(max_height > result_max_height) {
  				$(this).find('.testResult').css('max-height', max_height.toString() + "px");
  			}			
  		});
  	})();

  	$(window).resize(function() {
  		$('#interfaceList tbody tr').each(function() {
  			var max_height = Number($(this).css('height').split('px')[0])-20;
  			if(max_height > result_max_height) {
  				$(this).find('.testResult').css('max-height', max_height.toString() + "px");
  			} else {
  				$(this).find('.testResult').css('max-height', "110px");
  			}			
  		});
	});

	//checkAll click
	$('#checkAll').on('ifClicked', function () {
		if($(this).parent().hasClass('checked')) { //uncheck
			$('#interfaceList tbody tr').each(function() {
				if($(this).find('td').first().html() != undefined) {
					$(this).find('td').first().find('input').iCheck('uncheck');
				}
			});
		} else { //check
			$('#uncheckAll').iCheck('uncheck');
			$('#interfaceList tbody tr').each(function() {
				if($(this).find('td').first().html() != undefined) {
					$(this).find('td').first().find('input').iCheck('check');
				}
			});
		}
	});

	//uncheck All click
	$('#uncheckAll').on('ifClicked', function () {
		if(!$(this).parent().hasClass('checked')) {
			$('#interfaceList tbody tr').each(function() {
				if($(this).find('td').first().html() != undefined) {
					$(this).find('td').first().find('input').iCheck('uncheck');
				}
			});
		}
	});

	$('#interfaceList tbody tr td .checkbox').on('ifChecked', function () {
		$('#uncheckAll').iCheck('uncheck'); 
	});
	$('#interfaceList tbody tr td .checkbox').on('ifUnchecked', function () {
		$('#checkAll').iCheck('uncheck'); 
	});

	/*$('#if_domain').change(function(){
		var p1	= $(this).children('option:selected').val();
			p1	= p1-1;
		window.location.href = $('#domain_site').val()+p1; 
	});*/

});//End document ready functions

var tall= -1;

function testInterface(k,id){
	 var app_key 	= $('#if_app_key').val();
	 var app_secret = $('#if_app_secret').val(); 
	 var list	= document.getElementById('IF_param_'+id).getElementsByTagName("input");
	 var IF_url = $('#if_domain').val()+$('#IF_url_'+id).val();
	 var url = $('#tIFPath').val();
	 var strData="";
	 //var result = document.getElementById("result_"+id);
	  //对表单中所有的input进行遍历
	 var dt = 'text';
	 if(id == 1){
		dt = 'json';
	 }
	for(var i=0;i<list.length && list[i];i++)
	 {
		   //判断是否为文本框
		   if(list[i].type=="text")   
		   {
				strData +=list[i].id+"="+list[i].value+"&";          
		   }
	 }


	 $.ajax({type:"POST", dataType:dt, url:url, data:'app_key='+app_key+'&app_secret='+app_secret+'&id='+id+'&k='+k+'&if_url='+IF_url+'&'+strData,timeout:5000,
			success:function (data) {
				if(id == 1){
					$('#IF_result_'+id).html(data.info);
					var aid = document.getElementsByName("access_id");
					for(var j=0;j<aid.length;j++){
						aid[j].value = data.access_id;
					}
					var gwlist		= $('#gw_list').val();
					var gwuplist	= $('#gw_updatelist').val();
					var appidlist	= $('#app_id_list').val();
					var modecontent = document.getElementsByName("mode_content");
					for(var m=0;m<modecontent.length;m++){
						var mv = modecontent[m].value.replace('access_id_data',data.access_id);
						modecontent[m].value = mv;
					}
					var rulecontent = document.getElementsByName("rule_content");
					for(var m=0;m<rulecontent.length;m++){
						var mv = rulecontent[m].value.replace('access_id_data',data.access_id);
						rulecontent[m].value = mv;
					}					
					gwlist 			= gwlist.replace('app_id_data',data.app_id);
					gwuplist		= gwuplist.replace('old_app_id_data',data.app_id);
					gwuplist		= gwuplist.replace('new_app_id_data',data.app_id);
					appidlist		= appidlist.replace('app_id_data',data.app_id);
					$('#gw_list').val(gwlist);
					$('#gw_updatelist').val(gwuplist);
					$('#app_id_list').val(appidlist)
					
				}else{
					$('#IF_result_'+id).html(data);
				}
				if(tall>=0){
					tall++;
					testAllIF(k);
				}	
			},
			fail:function(data){
				if(tall>=0){
					tall++;
					testAllIF(k);
				}
			}
		});		 
	 
}


function testNewInterface(k,id){
	var list	= document.getElementById('IF_param_'+id).getElementsByTagName("input");
	var IF_url = $('#if_domain').val()+$('#IF_url_'+id).val();

	var url = $('#tNewIFPath').val();
	var strData="";
	 //var result = document.getElementById("result_"+id);
	  //对表单中所有的input进行遍历
	var dt = 'text';
	if(id == 22){
		dt = 'json';
	}
	for(var i=0;i<list.length && list[i];i++)
	 {
		   //判断是否为文本框
		   if(list[i].type=="text")   
		   {
				strData +=list[i].id+"="+list[i].value+"&";          
		   }
	 }

	 $.ajax({type:"POST", dataType:dt, url:url, data:'id='+id+'&k='+k+'&if_url='+IF_url+'&'+strData,timeout:5000,
			success:function (data) {
				if(id == 22){
					$('#IF_result_'+id).html(data.info);
					var utk = document.getElementsByName("user_token");
					for(var j=0;j<utk.length;j++){
						utk[j].value = data.user_token;
					}
				}else{
					$('#IF_result_'+id).html(data);
				}
				if(tall>=0){
					tall++;
					testAllIF(k);
				}				
			},
			fail:function(data){
				if(tall>=0){
					tall++;
					testAllIF(k);
				}
			}
		});	

}

function testAllIF(k){
	var sub = $('input[name="subBoxIf"]');
	//for(var i=0;i<sub.length;i++){
	if(tall==-1){
		tall = 0;
	}
	
	if(sub[tall].checked){
		if(sub[tall].value>19){
			//setTimeout('testNewInterface('+k+','+sub[i].value+');',5000);
			testNewInterface(k,sub[tall].value);
		}
		else if(sub[tall].value<20){
			//setTimeout('testInterface('+k+','+sub[i].value+');',5000);
			testInterface(k,sub[tall].value);
		}
	}else{
		tall++;
		testAllIF(k);
	}

	//}
}

function setEpId(){
	var epid = $('#IF_ep_id').val();
	var dpid = $('#IF_dp_id').val();
	var modecontent = document.getElementsByName("mode_content");
	for(var m=0;m<2;m++){
		var mode_content_bak=$('#mode_content_bak').val();
		var mv = mode_content_bak.replace('ep_id_data',epid);
		mv = mv.replace('dp_id_data',dpid);
		modecontent[m].value = mv;
	}
	var rulecontent = document.getElementsByName("rule_content");
	for(var m=0;m<2;m++){
		var rule_content_bak=$('#rule_content_bak').val();
		var mv = rule_content_bak.replace('ep_id_data',epid);		
		mv = mv.replace('dp_id_data',dpid);
		rulecontent[m].value = mv;
	}
	$('#ep_id').val(epid);
}

function setDpId(){
	var epid = $('#IF_ep_id').val();
	var dpid = $('#IF_dp_id').val();
	var modecontent = document.getElementsByName("mode_content");
	for(var m=0;m<2;m++){
		var mode_content_bak=$('#mode_content_bak').val();
		var mv = mode_content_bak.replace('dp_id_data',dpid);
		mv = mv.replace('ep_id_data',epid);
		 modecontent[m].value = mv;
	}
	var rulecontent = document.getElementsByName("rule_content");
	for(var m=0;m<2;m++){
		var rule_content_bak=$('#rule_content_bak').val();
		var mv = rule_content_bak.replace('dp_id_data',dpid);
		mv = mv.replace('ep_id_data',epid);
		rulecontent[m].value = mv;
	}
	$('#dp_id').val(dpid);
}

function setDeviceSn(){
	var devicesn = $('#if_device_sn').val();
	var devicekey= $('#if_device_key').val();
	$('#device_sn').val(devicesn);
	$('#device_key').val(devicekey);
}

function setIfParameter(id){
	var set_id 	= '';
	var strData = "";
	var url 	= $('#setIFPath').val();
	if(id==0){
		var if_domain = $('#if_domain').val();
		strData = "IF_url="+if_domain+'&';
		set_id = 'st';
	}else{
		set_id = 'IF_param_'+id;
	}
	var list	= document.getElementById(set_id).getElementsByTagName("input");
	for(var i=0;i<list.length && list[i];i++)
	 {
		   //判断是否为文本框
		   if(list[i].type=="text")   
		   {
				var key = list[i].id;
				if(id==0){
					key = key.replace('if','IF');
				}else if(id<20){
					key = 'IF_'+key;
				}
				strData +=key+"="+list[i].value+"&";          
		   }
	 }
	 $.ajax({type:"POST", dataType:'json', url:url, data:strData,timeout:3000,
			success:function (data) {
				alert(data.info);
			}
		});		 
}

function resizetable(){
	alert('test');
}