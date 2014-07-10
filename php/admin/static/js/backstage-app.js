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

function addBckstgApp(){
	var formData=$("#app_form").serialize(); 
	var url = $('#sub_url').val();
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