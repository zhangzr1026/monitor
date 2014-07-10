// document ready function
$(document).ready(function() { 	

	//--------------- Data tables ------------------//
	if($('table').hasClass('dynamicTable')){
		$('.dynamicTable').dataTable({
			"sPaginationType": "full_numbers",
			"bJQueryUI": false,
			"bAutoWidth": false,
			"bLengthChange": true,
			"bSort": false, 
			"fnInitComplete": function(oSettings, json) {
		      $('.dataTables_filter>label>input').attr('id', 'search');
		    }
		});
	}

	//delete role
	$("#appList .del").click(function() { 
		if (confirm("确认删除该应用？"))  {  
			alert('删除成功');
			$(this).parents("tr").remove(); 
		}
    });

});//End document ready functions

function uploadAppVer(){
	var url = $("#form_appver").attr('action');
	var iscur = 1;
	var vernum = $("#version_id").val();
	var explain = $("#desc").val();
	var channel_tag = $("#channel_tag").val();
	if($("#curver").is(':checked')==true){
		iscur = 1;
	}else{
		iscur = 0;
	}
	$.ajaxFileUpload({
        url:url,//处理图片脚本
        secureuri :false,
        fileElementId :'appfile',//file控件id
        dataType : 'json',
		data: {//加入的文本参数  
            "vernum": vernum,
			"explain": explain,	
            "curver": iscur,
			"channel_tag":channel_tag
        },
        success : function (data, status){
            if(data.status){
				$('.modal-body').remove();
				$('#tip_info').removeClass('alert alert-error').addClass('alert alert-success');
				$('#tip_info').html(data.info);
				$(".modal-footer").remove();
				setTimeout(function(){ window.location.reload();},3000);
			}else{
				$('#tip_info').removeClass('alert alert-success').addClass('alert alert-error');
				$('#tip_info').html(data.info);
			}
        }
	});
}

function opAppVersion(url,id){
	$.ajax({type:'POST', dataType:'json', url:url, data:'appverid='+id, timeout:3000,	
		success:function (data) {
			if(data.status){
				$('#op_'+id).attr('title',data.info);
				$('#op_'+id).popover('show');	
				setTimeout(function(){ window.location.reload();},3000);
			}else{
				$('#op_'+id).attr('title',data.info);
				$('#op_'+id).popover('show');
			}
		}
	});
}