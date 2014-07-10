// document ready function
$(document).ready(function() { 	

	alterUserInfo(1);

});//End document ready functions

function alterUserInfo(id){
	for(var i=1;i<7;i++){
		if(i==id){
			$('#mInfo_'+i).removeClass().addClass("list-group-item active");
			$('#info_'+i).show();
		}else{
			$('#mInfo_'+i).removeClass().addClass("list-group-item");
			$('#info_'+i).hide();
		}
	}
}

function audituser(url,uid,type){
	$.ajax({type:'POST', dataType:'json', url:url, data:'uid='+uid+'&type='+type, timeout:5000,	
		success:function (data) {
			if(data.status){
				$('#op_'+type).attr('title',data.info);
				$('#op_'+type).popover('show');	
				setTimeout(function(){ window.location.reload();},3000);
			}else{
				$('#op_'+type).attr('title',data.info);
				$('#op_'+type).popover('show');
			}
		}
	});

}