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

	//------------- Toggle button  -------------//
	$('.iToggle-button').toggleButtons({
	    width: 70,
	    label: {
	        enabled: "<span class='icon16 icomoon-icon-checkmark-2 white'></span>",
	        disabled: "<span class='icon16 icomoon-icon-cancel-3 white marginL5'></span>"
	    }
	});

});//End document ready functions

function delBckstgRole() {
	if (confirm("确认删除该用户？"))  {  
		alert('删除成功');
	}
}

function addBckstgRole(){
	var formData=$("#role_form").serialize(); 
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