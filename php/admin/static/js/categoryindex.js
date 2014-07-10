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

function delCategory(url,name,id) {
	$.ajax({type:'POST', dataType:'json', url:url, data:'cate_name='+name, timeout:3000,	
		success:function (data) {
			$('#delCate_'+id).attr('title',data.info);
			$('#delCate_'+id).popover('show');				
			if(data.status){setTimeout(function(){ window.location.reload();},3000)};
		}
	});
}

function addCategory(){
	var formData=$("#cate_form").serialize(); 
	var url = $('#cate_url').val();
	$.ajax({type:'POST', dataType:'json', url:url, data:formData, timeout:3000,	
		success:function (data) {
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