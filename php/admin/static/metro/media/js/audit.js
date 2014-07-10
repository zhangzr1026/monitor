function getCheckResult(d){
	if(!d){
		return;
	}
	var e		=	$('#inputEmail').val();
	var url     =   $('#checkurl').val()
	var to     =   $('#tourl').val()
	$.ajax({type:"POST", dataType:'json', url:url, data:'um='+e+'&md='+d,timeout:3000,
		success:function (data) {
			if(data.status==0){
				$('#check_tip').html('<div class="alert alert-info">'+data.info+'</div>');
			}else{
				$('#check_tip').html('<div class="alert alert-info">'+data.info+'</div>');
			}
			setTimeout('window.location.href="'+to+'";',2000);
		}
	});
}

function resetPwd(){
	var um	       =	$('#user_name').val();
	var oldpwd     =    $('#oldpwd').val();
	var newpwd     =    $('#newpwd').val();
	var url		   =	$('#editurl').val();
	var to		   =	$('#tourl').val();
	$.ajax({type:"POST", dataType:'json', url:url, data:'user_name='+um+'&old_pwd='+oldpwd+'&new_pwd='+newpwd,timeout:3000,
		success:function (data) {
			if(data.status==0){
				$('#check_tip').html('<div class="alert alert-info">'+data.info+'</div>');
				setTimeout('window.location.href="'+to+'";',2000);
			}else{
				$('#check_tip').html('<div class="alert alert-info">'+data.info+'</div>');
			}
		}
	});
}

function testInterface(id){
	 var mainurl = $('#testdoim').val();
	 var app_key = $('#app_key').val();
	 var app_secret = $('#app_secret').val();
	 var list=document.getElementById('param_'+id).getElementsByTagName("input");
	 var interface_url = mainurl + $('#interface_'+id).val();
	 var url = $('#testurl').val();
	 var strData="";
	 var result = document.getElementById("result_"+id);
	  //对表单中所有的input进行遍历
	 for(var i=0;i<list.length && list[i];i++)
	 {
	       //判断是否为文本框
	       if(list[i].type=="text")   
	       {
	            strData +=list[i].id+"="+list[i].value+"&";          
	       }
	 }

	
	 $.ajax({type:"POST", dataType:'text', url:url, data:'interface_url='+interface_url+'&app_key='+app_key+'&app_secret='+app_secret+'&'+strData,timeout:3000,
			success:function (data) {
				//alert(data);
				result.innerHTML=data;
			}
		});
}

function testAllInterface(){
	 var url = $('#testallurl').val(); 
	 var sub = $('input[name="subBoxIf"]');
	 var v = new Array();
	 var j=0
	 for(var i=0;i<sub.length;i++){
		if(sub[i].checked){
			v[j]=sub[i].value;
			j++;
		}
	 }
	 $.ajax({type:"POST", dataType:'text', url:url, data:'t=1&ifid='+v,timeout:10000,
			success:function (data) {
				editor.html(data);
			}
	});
}
function setParamRd(p){
	var pname = $('#Param_'+p).val();
	var pvalue = $('#ParamValue_'+p).val();
	var url = $('#seturl').val();
	$.ajax({type:"POST", dataType:'text', url:url, data:'name='+pname+'&value='+pvalue,timeout:3000,
		success:function (data) {
			alert(data);
			window.location.Reload();
		}
	});
}

function setTimingParam(id){
	 var url = $('#seturl').val();
	  //对表单中所有的input进行遍历
	 var strData='';
	 var list=document.getElementById('param_'+id).getElementsByTagName("input");
	 var interface_url = $('#interface_'+id).val();
	 for(var i=0;i<list.length && list[i];i++)
	 {
	   //判断是否为文本框
	   if(list[i].type=="text")   
	   {
			strData +=list[i].id+"="+list[i].value+"&";          
	   }
	 }
	 $.ajax({type:"POST", dataType:'text', url:url, data:'pid='+id+'&interface_url='+interface_url+'&'+strData,timeout:3000,
		success:function (data) {
			alert('setting ok!');
		}
	});
}

function setTimingParam1(){
	 var domainurl = $('#testdoim').val();
	 var app_key = $('#app_key').val();
	 var app_secret = $('#app_secret').val();
	 var url = $('#seturll').val();
	 $.ajax({type:"POST", dataType:'text', url:url, data:'domainurl='+domainurl+'&app_key='+app_key+'&app_secret='+app_secret,timeout:3000,
		success:function (data) {
			alert('setting ok!');
		}
	});
}