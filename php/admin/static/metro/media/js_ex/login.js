var Login = function () {
    
    return {
        //main function to initiate the module
        init: function () {
        	
           $('#formview').validate({
	            errorElement: 'label', //default input error message container
	            errorClass: 'help-inline', // default input error message class
	            focusInvalid: true, // do not focus the last invalid input

	            rules: {
	                user: {
	                    required: true
	                },
	                pass: {
	                    required: true
	                }
	            },
	            messages: {
	                user: {
	                    required: "用户名不能为空."
	                },
	                pass: {
	                    required: "密码不能为空."
	                }
	            },

	            invalidHandler: function (event, validator) { //display error alert on form submit
	                //$('.alert-error', $('#formview')).show();
					showMessage('');
	            },
	            highlight: function (element) { // hightlight error inputs
	                $(element).closest('.control-group').addClass('error'); // set error class to the control group
	            },
	            success: function (label) {
	                label.closest('.control-group').removeClass('error');
	                label.remove();					
	            },
	            errorPlacement: function (error, element) {
	                error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
	            },
	            submitHandler: function (form) {
					$('.alert-error', $('#formview')).hide();
					submitForm();
	            }
	        });

	        $('#formview input').keypress(function (e) {
	            if (e.which == 13) {
	                if ($('#formview').validate().form()) {
						submitForm();
	                }
	                return false;
	            }
	        });
			
			var submitForm = function () {
				var data = $("#formview").serialize();
				var url = $("#formview").find("#action").val();
						
				$.ajax({type:"POST", dataType:'json', url:url, data:data, timeout:30000,							
					beforeSend: function(XMLHttpRequest){/*$('#loading').show();*/},
					success:function (data) {
						showMessage(data.info);
						if(data.status == 0) {
							window.location.href = data.data;
						}
					},							
					complete: function(XMLHttpRequest, textStatus){/*$('#loading').hide();*/},
					error: function(error){alert('出错啦,请稍后重试');}
				});
			}

			var showMessage = function (message) {
				if(message == '') {message = '用户名和密码不能为空';}
				$('#message').html(message);
	            $('.alert-error', $('#formview')).show();
			}

        }

    };

}();