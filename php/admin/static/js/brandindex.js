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

	$("#newBrand").on("hide", function() {
		$(this).find("input[name='brand_type']").attr("value", "");
		$("#newbrand_tip").hide();
	});

});//End document ready functions

function delBrand(url,brand_name,k) {
	$.ajax({type:'POST', dataType:'json', url:url, data:'brand_name='+brand_name, timeout:3000,	
		success:function (data) {
			$('#delbind_'+k).attr('title',data.info);
			$('#delbind_'+k).popover('show');	
			if(data.status){setTimeout(function(){ window.location.reload();},3000);}
		}
	});
}

function getbrandname(name){
	$('#brand_name').val(name);
}

function brandbind(url){
	var cate_name	= $('#cate_name').val();
	var brand_name	= $('#brand_name').val();
	$.ajax({type:'POST', dataType:'json', url:url, data:'cate_name='+cate_name+'&brand_name='+brand_name, timeout:3000,	
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

function delbrandbind(url,cate_name,brand_name,k,g){
	$.ajax({type:'POST', dataType:'json', url:url, data:'cate_name='+cate_name+'&brand_name='+brand_name, timeout:3000,	
		success:function (data) {
			$('#bind_'+k+'_'+g).attr('title',data.info);
			$('#bind_'+k+'_'+g).popover('show');	
			if(data.status){setTimeout(function(){ window.location.reload();},3000);}
		}
	});
}

function addnewbrand(url){
	var new_brand = $('#new_brand').val();
	$.ajax({type:'POST', dataType:'json', url:url, data:'new_brand_name='+new_brand, timeout:3000,	
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