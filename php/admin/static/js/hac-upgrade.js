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

});//End document ready functions

function uploadDevVer(){
	var url = $("#form_devver").attr('action');
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
        fileElementId :'devfile',//file控件id
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

function opDevVersion(url,id){
	$.ajax({type:'POST', dataType:'json', url:url, data:'devverid='+id, timeout:3000,	
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
function opDevChannel(type,url,tagName,id){
	if(tagName==''){
		tagName = $('#dev_tag').val();
	}
	$.ajax({type:'POST', dataType:'json', url:url, data:'type='+type+'&tag='+tagName, timeout:3000,	
		success:function (data) {
			if(data.status){
				if(type=='add'){
					var str;
					$('#opTag').removeAttr('title');
					if(id%2==1){str= '<tr class="odd gradeX"><td>';}
					else{str= '<tr class="even gradeC"><td>';}
					str = str +tagName+'</td><td><a id="opTag_'+id+'" href="javascript:;;" onclick="opDevChannel(\'del\',\''+url+'\',\''+tagName+'\','+id+')">删除</a></td></tr>';
					$("#devTagContent").append(str);
					id = id +1;
					$("#opTag").attr("onclick","opDevChannel('add','"+url+"','',"+id+")");
				}
				if(type=='del'){
					$('#opTag_'+id).parent().parent().remove();    
				}
			}else{
				if(type=='add'){
					$('#opTag').attr('title',data.info);
					$('#opTag').popover('show');
				}
				if(type=='del'){
					$('#opTag_'+id).attr('title',data.info);
					$('#opTag_'+id).popover('show');
				}
			}
		}
	});
}

function delDevVersion(url,id){
	$.ajax({type:'POST', dataType:'json', url:url, data:'devverid='+id, timeout:3000,	
		success:function (data) {
			if(data.status){
				$('#delDev_'+id).attr('title',data.info);
				$('#delDev_'+id).popover('show');	
				setTimeout(function(){ window.location.reload();},3000);
			}else{
				$('#delDev_'+id).attr('title',data.info);
				$('#delDev_'+id).popover('show');
			}
		}
	});
}