// document ready function
$(document).ready(function() { 	

	//--------------- Data tables ------------------//
	if($('table').hasClass('dynamicTable')){
		$('.dynamicTable').dataTable({
			"sPaginationType": "full_numbers",
			"bJQueryUI": false,
			"bAutoWidth": false,
			"bLengthChange": true,
			"bSort":false,  
			"fnInitComplete": function(oSettings, json) {
		      $('.dataTables_filter>label>input').attr('id', 'search');
		    }
		});
	}

	$('#newServer').on('hide', function () {
  		$(this).find("input[name='server_ip']").attr("value","");
  		$(this).find("input[name='server_port']").attr("value","22");
  		$(this).find("input[name='ssh_account']").attr("value","");
  		$(this).find("input[name='ssh_password']").attr("value","");
  		$(this).find("input[name='server_desc']").attr("value","");
  		$("#new_test_tip").hide(); 		
	})

	$('#editServer').on('hide', function () {
  		$(this).find("input[name='server_ip']").attr("value","");
  		$(this).find("input[name='server_port']").attr("value","22");
  		$(this).find("input[name='ssh_account']").attr("value","");
  		$(this).find("input[name='ssh_password']").attr("value","");
  		$(this).find("input[name='server_desc']").attr("value","");
  		$("#edit_test_tip").hide(); 		
	})

});//End document ready functions

function DelServer(){
	if (confirm("确认删除？"))  {  
		alert('删除成功');
	}
}

function testConnect(modalName){
	var flag = true;
	var tipId = modalName + "_test_tip";
	if (flag) {
		$("#" + tipId).hide();
		$("#" + tipId).removeClass("alert-error");
		$("#" + tipId).addClass("alert-success");
		$("#" + tipId).html("<strong>成功!</strong> 已成功连接到服务器");
		$("#" + tipId).show();
	} else {
		$("#" + tipId).hide();
		$("#" + tipId).removeClass("alert-success");
		$("#" + tipId).addClass("alert-error");
		$("#" + tipId).html("<strong>失败!</strong> 密码错误");
		$("#" + tipId).show();
	}
}