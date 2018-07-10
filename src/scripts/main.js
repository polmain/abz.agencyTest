const aut = "ce65547700f2f68bad08d99521f966208c6d28b2";
const maxImgSize = 5242880;
const minImgWidth = 300;
const minImgHeigth = 300;

$(document).ready(function (e) {
	/* Main page */
	if($('.service-list').length > 0){
		getServices();
	}

	$('.modal-close').click(function () {
		$(this).parents('.modal').hide('300');
		$("#overlay").hide();
	});

	trunscateText('.featured-products-text',82);
	trunscateText('.recomend-people-proffesion',30);

	/* End main page */

	/* Contact page */

	if($('#enquiry-type').length > 0){
		getEnquiryTypes();
	}

	/* End contact page*/

});

function getServices() {
	$.ajax({
		type: "GET",
		dataType: "json",
		url: "http://504080.com/api/v1/services/categories",
		headers: {
			"Authorization": aut
		},
		success: function (response,textStatus) {
			if(textStatus==="success"){
				renderServices(response);
			}
		},
		error:  function(xhr, textStatus){
			if(textStatus==="error"){
				renderModalErr(xhr.status,xhr.responseJSON.error['message'],xhr.responseJSON.error['description']);
			}
		}
	});
}

function renderServices(data){
	data["data"].forEach(function (item) {
		var newItem = $('<div class="service-item"></div>');
		$('.service-list').append(newItem);
		$(newItem).append('<div class="service-img"><img src="'+item.icon+'" alt="'+item.title+'"></div>');
		$(newItem).append('<div class="service-title">'+item.title+'</div>');
	});
	defaultHeight('.service-list .service-item');
}
function renderModalErr(code,subject,message){
	var modal = $('.modal-error');
	modal.find('.code-error').html(code);
	modal.find('.subject').html(subject);
	modal.find('.message').html(message);
	modal.show(500);
	$("#overlay").show();
}

function defaultHeight(elements) {
	var paramMaxHeight = 0;
	$(elements).css('height','');
	$(elements).each(function () {
		var thisHeight = Number($(this).css('height').replace('px',''));
		if(paramMaxHeight < thisHeight){
			paramMaxHeight = thisHeight;
		}
	});
	$(elements).css('height',paramMaxHeight+'px');
}

function trunscateText(element,symbols) {
	var el = $(element);
	el.each(function () {
		var newsText = $(this).html();
		if(newsText.length > symbols){
			$(this).html(newsText.slice(0, symbols) + ' ...');
		}
	});
}

/* Contact page */
function getEnquiryTypes() {
	$.ajax({
		type: "GET",
		dataType: "json",
		url: "http://504080.com/api/v1/directories/enquiry-types",
		success: function (response,textStatus) {
			if(textStatus==="success"){
				renderEnquiryTypes(response);
			}
		},
		error:  function(xhr, textStatus){
			if(textStatus==="error"){
				renderModalErr(xhr.responseJSON,xhr.status);
			}

		}
	});
}

function renderEnquiryTypes(data) {
	data["data"].forEach(function (item) {
		var newItem = $('<option value="'+(item.name)+'">'+(item.name)+'</option>');
		$('#enquiry-type').append(newItem);
	});
	$('#enquiry-type').select2();
}

$('#enquiry-type').change(function () {
	if($(this).val() === 'Other'){
		$(this).parent().find('.hide-input').show(500);
		$(this).attr('name','');
		$(this).parent().find('.hide-input input').attr('name','enquiry_type');
	}else{
		$(this).parent().find('.hide-input').hide(500);
		$(this).attr('name','enquiry_type');
		$(this).parent().find('.hide-input input').attr('name','');
	}
});

$("#description").keyup(function()
{
	var box = $(this).val();
	var maxLength = $(this).attr('maxlength');
	var count = box.length;
	if(count <= maxLength)
	{
		$(this).parent().find('.count-symbols').text('('+count+','+maxLength+')');
	}
	return false;
});

$("#inputImage").change(function() {
	$("#imageMessage").empty();
	var file = this.files[0];
	var imagefile = file.type;
	switch (imagefile){
		case "image/jpeg":
		case "image/png":
		case "image/jpg":
			break;
		default:{
			imgageLoadError("Not valid file type");
			return false;
		}
	}
	if(file.size>maxImgSize)
	{
		imgageLoadError("The allowed file size is exceeded");
		return false;
	}
	var reader = new FileReader();
	reader.readAsDataURL(this.files[0]);
	reader.onload = imgLoad;
});

function imgageLoadError(error) {
	$('#image_preview').css("display","none");
	$("#inputImage").removeClass('is-valid');
	$("#inputImage").addClass('is-invalid');
	$("#imageMessage").html("<p>"+error+"</p>");
	$("#inputImage").replaceWith(input.val('').clone(true));
}

function imgLoad(e){
	var image = new Image();
	image.src = e.target.result;
	var isMinWidthError = false;
	image.onload = function() {
		if(this.width >= minImgWidth && this.height >= minImgHeigth){
			imageIsLoaded(this);
		}else{
			imgageLoadError("The image is too small");
		}
	};
}

function imageIsLoaded(e) {
	$("#inputImage").addClass('is-valid');
	$("#inputImage").removeClass('is-invalid');
	$('#image_preview').css("display","inline-block");
	$('#image_preview').css("background-image","url('"+e.src+"')");
};

$("#support").validate({
	rules: {
		user_name: "required",
		description: "required",
		subject: "required",
		enquiry_type: "required",
		email: {
			required: true,
			email: true
		},
	},
	submitHandler: function (form) {
		$.ajax({
			type: "POST",
			url: "http://504080.com/api/v1/support",
			data: new FormData(form),
			contentType: false,
			cache: false,
			processData:false,
			success: function (response,textStatus) {
				if(textStatus==="success"){
					renderModalSuccess(response);
				}
			},
			error:  function(xhr, textStatus){
				if(textStatus==="error"){
					var desctiption = xhr.responseJSON.error['description'];
					desctiption += '<div>';
					xhr.responseJSON.error['details'].forEach(function (item) {
						desctiption += '<p>';
						desctiption += '<strong>'+item["field"]+' ('+item["code"]+'): </strong>';
						desctiption += item["description"];
						desctiption += '</p>';
					});
					desctiption += '</div>';

					renderModalErr(xhr.status,xhr.responseJSON.error['message'],desctiption);
				}
			}
		});
	}
});

function renderModalSuccess(data){
	var modal = $('.modal-success');
	modal.find('.message').text(data.data['message']);
	modal.show(500);
	$("#overlay").show();
}
$('.modal-success .modal-close').click(function () {
	document.location.reload();
});


