// common js

// plugins: overly & parallax
(function($) {
	$.extend({
		ovrly: function(wrapper) {
			var container = wrapper ? wrapper : "body";
			var i = "Please Wait";
			var methods = {
				init: function() {
					$(container).css("position", "relative");

					$(container)
						.find(".overlay-block")
						.remove();
					$(
						'<div class="overlay-block"><h2><i class="fa fa-spinner fa-pulse fa-2x fa-fw d-block mx-auto" aria-hidden="true"></i></h2></div>'
					).appendTo(container);
					// return this;
					$(
						"<style>.overlay-block { position: fixed; height: 100%; width: 100%; top: 0; left: 0; background-color: rgba(30, 30, 30, 0.75); z-index: 999999; color: #fff; }.overlay-block>* { position: absolute; transform: translate3d(-50%, -50%, 0); top: 50%; left: 50%; }</style>"
					).appendTo("body");
				},
				kill: function() {
					$(container)
						.css("position", "")
						.find(".overlay-block")
						.fadeOut(250, function() {
							$(this).remove();
						});
				}
			};

			// init from inside
			// methods.init();
			return methods;
		}
	});

	$.fn.parallax = function() {
		return this.each(function() {
			var $elm = $(this),
				speed = $elm.attr("data-speed") ? $elm.attr("data-speed") : 1.5,
				scale = $elm.attr("data-scale") ? $elm.attr("data-scale") : 1;

			function updateParallax(initial) {
				var $img = $elm.children("img").first(),
					ch = $elm.height(),
					dt = $elm.offset().top,
					db = dt + ch,
					st = $(window).scrollTop(),
					wh = $(window).innerHeight(),
					sp = speed,
					scl = scale,
					wb = st + wh,
					parallax,
					trans;
				if (initial) {
					$img.css("display", "block");
				}
				if (dt < wb) {
					parallax = Math.round((st - dt) / sp + 28);
					trans =
						"translate3d(-50%," +
						parallax +
						"px, 0) scale(" +
						scl +
						")";
				}
				$img.css({ transform: trans });
			}
			$elm.children("img")
				.one("load", function() {
					updateParallax(true);
				})
				.each(function() {
					if (this.complete) {
						$(this).trigger("load");
					}
				});
			$(window).scroll(function() {
				updateParallax(false);
			});
		});
	};

	$.fn.elasticMenu = function() {
		if ($(window).outerWidth() < 992) {
			console.log("small device not supported");
			return;
		} else {
			var $elm = $(this);
			$elm.each(function() {
				var $nav = $(this);
				var activeItem = $($nav).find(".active");
				var navItems = $($nav).attr("data-targets");
				var shadow = $("<div>", { class: "nav-shadow" }).css({
					width: 0,
					transform: "translate3d(-50%,-100%, 0)",
					opacity: 0
				});

				// activeItem.addClass("is-active");
				shadow.insertAfter($nav);

				// i_ = initial;
				var i_top = 0;
				var i_left = 0;
				var i_height = 0;
				var i_width = 0;
				var i_opacity = 0;

				function UpdateActiveCoords() {
					if (activeItem.length == 1) {
						i_top = activeItem.offset().top;
						i_left = activeItem.offset().left;
						i_height = activeItem.outerHeight();
						i_width = activeItem.outerWidth();
						i_opacity = 1;
					} else {
						i_top = $nav.offset().top;
						i_left = $nav.offset().left;
						i_height = $nav.outerHeight();
						i_width = 0; //$nav.outerWidth();
						i_opacity = 0;
					}
				}

				function moveShadow(t, l, h, w, o) {
					shadow.css({
						"background-color": "#f90",
						transition: "0.35s all",
						opacity: o,
						position: "fixed",
						"z-index": -1,
						height: h,
						width: w,
						// "top": t,
						left: l + w / 2
					});
				}

				UpdateActiveCoords();
				moveShadow(i_top, i_left, i_height, i_width, i_opacity);

				// c_ = current
				var c_height;
				var c_width;
				var c_top;
				var c_left;
				var c_opacity;

				$(navItems).each(function() {
					$(this).hover(
						function() {
							c_height = $(this).outerHeight();
							c_width = $(this).outerWidth();
							c_top = $(this).offset().top;
							c_left = $(this).offset().left;
							c_opacity = 1;
							// console.log(top, left, height, width);
							moveShadow(
								c_top,
								c_left,
								c_height,
								c_width,
								c_opacity
							);
						},
						function() {
							moveShadow(
								i_top,
								i_left,
								i_height,
								i_width,
								i_opacity
							);
						}
					);
					$(window).on("resize scroll", function() {
						setTimeout(function() {
							if (activeItem.length == 1) {
								UpdateActiveCoords();
								moveShadow(
									i_top,
									i_left,
									i_height,
									i_width,
									i_opacity
								);
							}
						}, 300);
						// console.log(left, top, height, width);
					});
				});
			});
		}
	};
})(jQuery);

function showLoader() {
	$.ovrly().init();
}

function hideLoader() {
	$.ovrly().kill();
}

$(document).on("click", ".reset-wild-tigers", function() {
	showLoader();
	window.location.reload();
});

function alertifyMessage(type, message) {
	switch (type) {
		case "error":
			alertify.notify(message, "error", 5);
			break;
		case "success":
			alertify.notify(message, "success", 5);
			break;
		case "warning":
			alertify.notify(message, "warning", 5);
			break;
		case "info":
			alertify.notify(message);
			break;
		default:
			alertify.notify(message);
	}
}

//override defaults
if (typeof alertify !== "undefined") {
	alertify.defaults.transition = "slide";
	alertify.defaults.theme.ok = "btn btn-primary";
	alertify.defaults.theme.cancel = "btn btn-danger";
	alertify.defaults.theme.input = "form-control";
}

if (typeof jQuery.validator !== "undefined") {
	jQuery.validator.setDefaults({
		errorPlacement: function(error, element) {
			if (
				element.hasClass("select2") &&
				element.next(".select2-container").length
			) {
				error.insertAfter(element.next(".select2-container"));
			} else if (element.parent(".input-group").length) {
				error.insertAfter(element.parent());
			} else if (
				element.prop("type") === "radio" &&
				element.parent(".radio-inline").length
			) {
				error.insertAfter(element.parent().parent());
			} else if (
				element.prop("type") === "checkbox" ||
				element.prop("type") === "radio"
			) {
				error.appendTo(element.parent().parent());
			} else if (element.prop("type") === "file") {
				error.appendTo(
					element
						.parent()
						.parent()
						.parent()
				);
			} else {
				error.insertAfter(element);
			}
		}
	});

	$.validator.addMethod(
		"email_regex",
		function(value, element, regexp) {
			var re = new RegExp(regexp);
			return this.optional(element) || re.test(value);
		},
		"Please enter valid emailaddress."
	);

	$.validator.addMethod(
		"noSpace",
		function(value, element) {
			return this.optional(element) || $.trim(value) != "";
		},
		"This field is required"
	);

	$.validator.addMethod(
		"mobile_regex",
		function(value, element, regexp) {
			var re = new RegExp(regexp);
			return this.optional(element) || re.test(value);
		},
		"Please enter valid contact number."
	);
}

function onlyDecimal(thisitem) {
	var val = $(thisitem)
		.val()
		.trim();

	if (parseInt(val) == 0) {
		var newValue = val.replace(/^0+/, "");
		return $(thisitem).val(newValue);
	}

	if (isNaN(val)) {
		val = val.replace(/[^1-9\.]/g, "");
		if (val.split(".").length > 2) val = val.replace(/\.+$/, "");
	}
	return $(thisitem).val(val);
}

function onlyNumber(thisitem) {
	var $val = $(thisitem)
		.val()
		.trim()
		.replace(/[^\d]/g, "");
	$(thisitem).val($val);
}

function naturalNumber(thisitem) {
	var $val = $(thisitem)
		.val()
		.trim()
		.replace(/[^\d]/g, "")
		.replace(/^0+/g, "");
	$(thisitem).val($val);
}

function deleteRecord(thisitem, moduleName) {
	//console.log("has");
	alertify.confirm(
		messages["delete_record"],
		messages["confirm_delete_record"],
		function() {
			//user id
			var record_id = $(thisitem).data("record-id");

			//delete  url
			var deleteUrl = site_url + moduleName + "/delete/" + record_id;

			//redirt to delete req
			window.location = deleteUrl;
		},
		function() {}
	);
}

function imagePreview(thisitem) {
	var filedId = $(thisitem).attr("id");
	if ($("#" + filedId).valid() == true) {
		//$(this).next('label').text($(this).val().replace(/C:\\fakepath\\/i, ''));

		var input = this;

		if (thisitem.files && thisitem.files[0]) {
			var reader = new FileReader();

			reader.onload = function(e) {
				console.log("#" + filedId + "-preview");

				$("." + filedId + "-preview-div").show();
				$("." + filedId + "-preview").show();
				$("." + filedId + "-preview").attr("src", "");
				$("." + filedId + "-preview").attr("src", e.target.result);
			};

			reader.readAsDataURL(thisitem.files[0]);
		}
	} else {
		$("." + filedId + "-preview-+").hide();
		$("." + filedId + "-preview").attr("src", "");
	}
}

function searchAjax(ajaxUrl, ajaxData, pagination = false) {
	var result;
	$.ajax({
		type: "POST",
		url: ajaxUrl,
		async: false,
		data: ajaxData,
		beforeSend: function() {
			//block ui
			showLoader();
		},
		success: function(response) {
			hideLoader();
			if (pagination != false) {
				$(".ajax-view").append(response);
			} else {
				$(".ajax-view").html("");
				$(".ajax-view").html(response);
			}
			result = response;
		},
		error: function() {
			hideLoader();
		}
	});
	return result;
}
var multipleImageName = [];
var single_image_field_name = ["gallery_img"];
function multipleImagePreview(thisitem, placeToInsertImagePreview) {
	var invalidImage = false;
	var field_id = $(thisitem).attr("id");
	var field_name = $(thisitem).attr("data-field-name");

	$("." + field_id + "-preview-div").html("");
	if (thisitem.files) {
		var filesAmount = thisitem.files.length;

		for (i = 0; i < filesAmount; i++) {
			var f = thisitem.files[i];
			var reader = new FileReader();

			if (
				thisitem.files[i].type == "image/jpg" ||
				thisitem.files[i].type == "image/png" ||
				thisitem.files[i].type == "image/jpeg"
			) {
				reader.onload = (function(theFile) {
					return function(e) {
						var imageName = "";
						var imageName = theFile.name;
						var imageHtml = "";

						if (imageName != "") {
							multipleImageName.push(imageName);
							$("#final_selected_image").val(
								multipleImageName.toString()
							);
						}
						imageHtml =
							'<div class="col-lg-4 mb-5 "><div class="img-gallery"><img src="' +
							event.target.result +
							'" alt="" srcset="" class="img-fluid gallery_img-preview"><button type="button" class="button-gallery btn btn-danger rounded" onclick="removeImage(this)" data-field-name="' +
							field_name +
							'" data-preview-name="' +
							imageName +
							'"><i class="fas fa-times cancel-icon"></i></button></div></div>';
						$("." + field_id + "-preview-div").append(
							$.parseHTML(imageHtml)
						);
					};
				})(f);
			} else {
				invalidImage = true;
			}

			reader.readAsDataURL(thisitem.files[i]);
		}

		$("#final_selected_image").val(multipleImageName.toString());

		if (invalidImage != false) {
			$("#" + field_id).val("");
			$("." + field_id + "-preview-div").hide();
			$("." + field_id + "-preview-div").html("");
			alertifyMessage("error", messages["invalid-image"]);
		} else {
			$("." + field_id + "-preview-div").show();
		}
	}
}

function removeImage(thisitem) {
	alertify.confirm(
		messages["remove_image"],
		messages["delete-image-msg"],
		function() {
			//console.log($(thisitem).attr('data-preview-name'));
			var image_name = $(thisitem).attr("data-image-name");
			var module_name = $(thisitem).attr("data-module-name");
			var record_id = $(thisitem).attr("data-record-id");
			var field_name = $(thisitem).attr("data-field-name");

			if (image_name != "" && image_name != null) {
				$.ajax({
					type: "POST",
					dataType: "json",
					url: site_url + "product/removeUploadedFile",
					async: false,
					data: {
						image_name: image_name,
						module_name: module_name,
						record_id: record_id,
						field_name: field_name
					},
					beforeSend: function() {
						//block ui
						//showLoader();
					},
					success: function(response) {
						//hideLoader();
						//window.location.reload()
						console.log(response);
					},
					error: function() {
						//hideLoader();
					}
				});
			}

			//console.log(field_name);
			//console.log(single_image_field_name);
			//console.log($.inArray(field_name, single_image_field_name));
			if ($.inArray(field_name, single_image_field_name) !== -1) {
				console.log("check");
				$(thisitem)
					.parents(".img-gallery")
					.parent()
					.remove();
				$("input[name='" + field_name + "']").val("");
			} else {
				console.log("remopve unuploaded image");
				//console.log("input[name='" + field_name + "']");
				var preview_image_name = $(thisitem).attr("data-preview-name");

				$(thisitem)
					.parents(".img-gallery")
					.parent()
					.remove();
				if (preview_image_name != "") {
					multipleImageName.splice(
						$.inArray(preview_image_name, multipleImageName),
						1
					);
				}
				console.log($(thisitem).attr("data-preview-name"));
				//console.log(multipleImageName);
				$("#final_selected_image").val(multipleImageName.toString());
			}
		},
		function() {}
	);
}

// boundry -------------------------------------------------------------------------------------------------------

// designers
function menuDrop() {
	if ($(window).innerWidth() > 991) {
		$(
			".twt-navbar .nav-item.dropdown, .twt-navbar .dropdown-submenu"
		).hover(
			function() {
				$(this)
					.find(".dropdown-menu")
					.first()
					.stop(true, true)
					.delay(250)
					.slideDown(150);
			},
			function() {
				$(this)
					.find(".dropdown-menu")
					.first()
					.stop(true, true)
					.delay(100)
					.slideUp(100);
			}
		);
		$(".twt-navbar .dropdown > a").click(function() {
			location.href = this.href;
		});
	}
}

$(document).ready(function() {
	menuDrop();
	$("#slide-toggle").on("click", function() {
		$("body").toggleClass("nav-slide-open");
	});

	$(function() {
		// var current = window.location.href.substring(window.location.href.lastIndexOf("/") + 1);
		var current = window.location.href;

		if (current != "") {
			$(".nav-link").each(function() {
				var href = $(this).attr("href");
				if (href == current) {
					$(this)
						.parent()
						.addClass("active");
				}
			});
		}
	});

	$(document).on("click", function(e) {
		// console.log(!$(e.target).is('#slide-toggle, #slide-toggle .fas'), $(window).innerWidth() < 992);
		if (
			$(window).innerWidth() < 992 &&
			!$(e.target).is("#slide-toggle, #slide-toggle .fas")
		) {
			$("body").removeClass("nav-slide-open");
		}
	});

	// sidebar
	$(document).on("click", ".navbar-toggler", function() {
		$("#wrapper").toggleClass("toggled");
	});
	// sidebar sub menu
	$('.sidebar [data-toggle="collapse"]').on("click", function() {
		var current = $(this);
		current
			.parent()
			.siblings()
			.find(".collapse.show")
			.collapse("hide");
	});

	// sidebar close on outside click
	$(document).on("click", function(e) {
		if (
			$(window).innerWidth() < 1200 &&
			!$(e.target).closest("#sidebar").length > 0 &&
			!$(e.target).is(".navbar-toggler")
		) {
			$("#wrapper").removeClass("toggled");
		}
	});

	if (window.location.hash) {
		console.log(window.location.hash);

		setTimeout(function() {
			window.scrollTo(0, 0);
		}, 1);
		setTimeout(function() {
			$("html, body").animate(
				{
					scrollTop: $(window.location.hash).offset().top - 96
				},
				1000
			);
		}, 300);
	}

	$('a[href*="#"]').on("click", function(event) {
		if (this.hash !== "") {
			event.preventDefault();
			var hash = this.hash;
			var n_scroll = 60;
			if ($(window).innerWidth() < 768) {
				n_scroll = 90;
			}

			if (!$(this).attr("data-toggle")) {
				$("html, body").animate(
					{
						scrollTop:
							$(hash).offset().top -   $(".navbar").outerHeight() - n_scroll
					},
					800
				);
			}
			console.log(n_scroll);
		}
	});

	var topOffset = $("#navMain").attr("data-offset")
		? parseInt($("#navMain").attr("data-offset"))
		: 0;
	if ($(".main-navbar-wrapper").hasClass("fallen-nav")) {
		$(".main-navbar-wrapper").css(
			"min-height",
			$("#navMain").outerHeight() + topOffset
		);
	} else if ($(".main-navbar-wrapper").hasClass("notch-nav")) {
		$(".main-navbar-wrapper").css(
			"min-height",
			$("#navMain").outerHeight() + topOffset
		);
	} else {
		$(".main-navbar-wrapper").css(
			"min-height",
			$("#navMain").outerHeight()
		);
	}

	$(".parallax").parallax();

	setTimeout(function()  {
		$("#elastic_parent").elasticMenu();
	}, 300);

	if ($(document).find(".select2").length > 0) {
		$(".select2").select2();
	}

	// slick slider
	$("#header-slider").on("init", function(e, slick) {
		var $firstAnimatingElements = $("div.header-slide:first-child").find(
			"[data-animation]"
		);
		doAnimations($firstAnimatingElements);
	});
	$("#header-slider").on("beforeChange", function(
		e,
		slick,
		currentSlide,
		nextSlide
	) {
		var $animatingElements = $(
			'div.header-slide[data-slick-index="' + nextSlide + '"]'
		).find("[data-animation]");
		doAnimations($animatingElements);
	});
	if ($("#header-slider").length > 0) {
		$("#header-slider").slick({
			autoplay: true,
			autoplaySpeed: 4000,
			dots: false,
			arrows: true,
			// fade: true,
			pauseOnHover: false
		});
	}

	function doAnimations(elm) {
		var animationEndEvents =
			"webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
		elm.each(function() {
			var $this = $(this);
			var $animationDelay = $this.data("delay");
			var $animationType = "animated " + $this.data("animation");
			$this.css({
				"animation-delay": $animationDelay,
				"-webkit-animation-delay": $animationDelay
			});
			$this.addClass($animationType).one(animationEndEvents, function() {
				$this.removeClass($animationType);
			});
		});
	}

	$('input[type="file"]').each(function() {
		var finput = $(this);
		finput.on("change", function(e) {
			let filenames = [];

			let files = e.target.files;

			if (files.length > 1) {
				// filenames.push(files.length + " images added");
				filenames.push("Multiple images added");
			} else {
				for (let i in files) {
					if (files.hasOwnProperty(i)) {
						filenames.push(files[i].name);
					}
				}
			}
			$(this)
				.siblings(".custom-file-label")
				.html(filenames.join(","));
		});
	});

	$(".dropdown-submenu > a").on("click", function(e) {
		console.log("submenu clicked");
		if ($(window).innerWidth() < 992) {
			e.preventDefault();
		}

		var submenu = $(this);
		$(this)
			.parent()
			.siblings()
			.find(".dropdown-menu")
			.removeClass("show");
		submenu.next(".dropdown-menu").addClass("show");
		e.stopPropagation();
	});

	$(".dropdown").on("hidden.bs.dropdown", function() {
		// hide any open menus when parent closes
		$(".dropdown-menu.show").removeClass("show");
	});
});
$(window).resize(function() {
	setTimeout(function() {
		console.log("resized to =>", $(window).innerWidth());
		menuDrop();
	}, 500);
});

$(window).scroll(function() {
	// console.log($(this).scrollTop());
	if ($(this).scrollTop() > 72) {
		$(".twt-navbar").addClass("fixed");
	} else {
		$(".twt-navbar").removeClass("fixed");
	}
});

// $(function() {
// 	$('[data-toggle="tooltip"]').tooltip();
// });

$(document).on("keypress", function(e) {
	if (e.keyCode == 13 && $("input:focus").val() != "") {
		$("input:focus")
			.parents("#searchFilter")
			.find('[onclick*="filterData()"]')
			.click();
	}
});
