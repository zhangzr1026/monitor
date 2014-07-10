$('#signIn').click(
	function(d){
		var url = $('#formaction').val();
		var user = $('#username').val();
		var pass = $('#password').val();
		$.ajax({type:'POST', dataType:'json', url:url, data:'user='+user+'&pass='+pass, timeout:3000,	
		success:function (data) {
			if(data.status){
				$('#error_tip').html('<span class="alert-error">'+data.info+'</span>');	
			}else{
				$('#error_tip').html('<span class="alert-success">'+data.info+'</span>');
				setTimeout(function(){ window.location.href=data.data;},2000);
			}
		}
		});
	}
);