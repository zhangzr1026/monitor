var FormValidation = function () {


    return {
        //main function to initiate the module
        init: function () {

            // for more info visit the official plugin documentation: 
            // http://docs.jquery.com/Plugins/Validation

            var form1 = $('#form_manager_add');
            var error1 = $('.alert-error', form1);
            var success1 = $('.alert-success', form1);

            form1.validate({
                errorElement: 'span', //default input error message container
                errorClass: 'help-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",
                rules: {
                    manager_user_name: {
                        //minlength: 2,
						maxlength:20,
                        required: true
                    },
					manager_password: {
                        //minlength: 2,
						maxlength:50,
                        required: true
                    },
					manager_nick_name: {
                        //minlength: 2,
						maxlength:50,
                        required: false
                    },
					manager_comment: {
                        //minlength: 2,
						maxlength:50,
                        required: false
                    }
                },

				messages: {
	                manager_user_name: {
						maxlength:'用户名不能超过20个字符',
	                    required: "用户名不能为空."
	                },
					manager_password: {
						maxlength:'密码不能超过20个字符',
	                    required: "密码不能为空."
	                },
					manager_nick_name: {
						maxlength:'昵称不能超过20个字符'
	                },
					manager_comment: {
						maxlength:'备注不能超过50个字符'
	                },
	            },

                invalidHandler: function (event, validator) { //display error alert on form submit              
                    success1.hide();
                    error1.show();
                    App.scrollTo(error1, -200);
                },

                highlight: function (element) { // hightlight error inputs
                    $(element)
                        .closest('.help-inline').removeClass('ok'); // display OK icon
                    $(element)
                        .closest('.control-group').removeClass('success').addClass('error'); // set error class to the control group
                },

                unhighlight: function (element) { // revert the change dony by hightlight
                    $(element)
                        .closest('.control-group').removeClass('error'); // set error class to the control group
                },

                success: function (label) {
                    label
                        .addClass('valid').addClass('help-inline ok') // mark the current input as valid and display OK icon
                    .closest('.control-group').removeClass('error').addClass('success'); // set success class to the control group
                },

                submitHandler: function (form) {
                    success1.show();
                    error1.hide();
					form.submit();
                }
            });

        }

    };

}();