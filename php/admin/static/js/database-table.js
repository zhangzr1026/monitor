// document ready function
$(document).ready(function() { 	

	//--------------- Data tables ------------------//
	if($('table').hasClass('dynamicTable')){
		$('.dynamicTable').dataTable({
			"sPaginationType": "full_numbers",
			"bJQueryUI": false,
			"bAutoWidth": false,
			"bLengthChange": true,
			"fnInitComplete": function(oSettings, json) {
		      $('.dataTables_filter>label>input').attr('id', 'search');
		    }
		});
	}

});//End document ready functions