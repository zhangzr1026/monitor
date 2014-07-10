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

	//--------------- Check box ------------------//
	$('input').iCheck({
    	checkboxClass: 'icheckbox_flat-blue',
    	radioClass: 'iradio_flat-blue'
  	});

});//End document ready functions

function update_ircode(url,id){
	$.ajax({type:'POST', dataType:'json', url:url, data:'ircode_id='+id, timeout:3000,	
		success:function (data) {
			$('#ir_'+id).attr('title',data.info);
			$('#ir_'+id).popover('show');	
			if(data.status){setTimeout(function(){ window.location.reload();},3000);}
		}
	});
}

function uploadIrVer(){
	var s = document.getElementsByName('gid');
	var url = $('#ir_up_url').val();
	var c = $('#ir_desc').val();
	var l=[];
	var j=0;
	for(var i=0;i<s.length;i++){
		if(s[i].checked){
			l[j]=s[i].value;
			j++;
		}
	}
	$.ajaxFileUpload({
        url:url,//处理图片脚本
        secureuri :false,
        fileElementId :'ir_file',//file控件id
        dataType : 'json',
		data: {//加入的文本参数  
            "comment": c,
			"gid": l
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