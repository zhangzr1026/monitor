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
			"bFilter": false,
			"fnInitComplete": function(oSettings, json) {
		      $('.dataTables_filter>label>input').attr('id', 'search');
		    }
		});
	}

});//End document ready functions

function opIrCodeGather(url,id,op,val){
	$.ajax({type:'POST', dataType:'json', url:url, data:'gid='+id+'&'+op+'='+val, timeout:3000,	
		success:function (data) {
			if(op=='status'){
				$('#opIrGt_'+id).attr('title',data.info);
				$('#opIrGt_'+id).popover('show');	
			}
			if(op=='state'){
				$('#opIr_'+id).attr('title',data.info);
				$('#opIr_'+id).popover('show');	
			}
			if(data.status){setTimeout(function(){ window.location.reload();},3000)};
		}
	});
}

function delIrConfirm(url,id){
	$('delCode_'+id).confirm({
            'title': 'Delete Confirmation',
            'message': 'You are about to delete this item .It cannot be restored at a later time! Continue?',
            'buttons': {
                'Yes': {
                    'class': 'blue',
                    'action': function(){
                        
                    }
                },
                'No': {
                    'class': 'gray',
                    'action': function(){}// Nothing to do in this case. You can as well omit the action property.
                }
            }
        });
}

function shownext(ajaxurl,inputString) {
	if(inputString.length == 0) {
	} else {
		$.post(ajaxurl, {argc: ""+inputString+""}, function(data){
			var x = document.getElementById("ir_brand");
			x.options.length = 0;
			if(data.length >0) {
				var s=data.split(",");
				for(var i=0; i<s.length; i++){
					var op = document.createElement("option");
					op.value = s[i];
					op.text = s[i];
					x.add(op);
				}
			}
		});
	}
}

function shownext2(ajaxurl,inputString) {
	if(inputString.length == 0) {
	} else {
		$.post(ajaxurl, {argc: ""+inputString+""}, function(data){
			var x = document.getElementById("ir_new_brand");
			x.options.length = 0;
			if(data.length >0) {
				var s=data.split(",");
				for(var i=0; i<s.length; i++){
					op = document.createElement("option");
					op.value = s[i];
					op.text = s[i];
					x.add(op);
				}
			}
		});
	}
}

function addnewbrand(url){
	var cate_name	= $('#ir_new_cate').val();
	var brand_name	= $('#ir_new_brand').val();
	var mode_name	= $('#ir_new_mode').val();
	$.ajax({type:'POST', dataType:'json', url:url, data:'cate_name='+cate_name+'&brand_name='+brand_name+'&model_name='+mode_name, timeout:3000,	
		success:function (data) {
			if(data.status){
				$('.modal-body').remove();
				$('#new_tip_info').removeClass('alert alert-error').addClass('alert alert-success');
				$('#new_tip_info').html(data.info);
				$(".modal-footer").remove();
				setTimeout(function(){ window.location.reload();},3000);
			}else{
				$('#new_tip_info').removeClass('alert alert-success').addClass('alert alert-error');
				$('#new_tip_info').html(data.info);
			}
		}
	});
}