/*
 * FileUploader - کامپوننت ماژولار آپلود فایل
 * قابلیت‌ها: Drag & Drop، پیش‌نمایش، اعتبارسنجی فرمت و حجم، آپلود multipart/form-data
 *
 * استفاده: پارشیال _FileUploader.cshtml را در فرم قرار دهید؛
 * مسیر ذخیره‌شده در input مخفی .fu-value (با name مشخص‌شده) ثبت می‌شود.
 */
window.FileUploader = (function ($) {
	'use strict';

	function humanSize(bytes) {
		if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' مگابایت';
		if (bytes >= 1024) return (bytes / 1024).toFixed(0) + ' کیلوبایت';
		return bytes + ' بایت';
	}

	function showToast(icon, message, timer) {
		Swal.fire({
			icon: icon,
			title: message,
			toast: true,
			position: 'top-end',
			timer: timer || 3000,
			showConfirmButton: false
		});
	}

	function init(el) {
		var $u = $(el);
		if ($u.data('fu-initialized')) return;
		$u.data('fu-initialized', true);

		var $hidden = $u.find('.fu-value');
		var $input = $u.find('.fu-input');
		var $drop = $u.find('.fu-dropzone');
		var $empty = $u.find('.fu-empty');
		var $previewWrap = $u.find('.fu-preview');
		var $img = $u.find('.fu-preview-img');
		var $pathLabel = $u.find('.fu-path');

		var accept = ($u.attr('data-fu-accept') || '')
			.split(',')
			.map(function (s) { return s.trim().toLowerCase(); })
			.filter(Boolean);
		var maxSize = parseInt($u.attr('data-fu-max-size'), 10) || 10 * 1024 * 1024;

		function render() {
			var value = ($hidden.val() || '').trim();
			if (value) {
				$img.attr('src', value);
				$pathLabel.text(value).attr('title', value);
				$previewWrap.removeClass('d-none');
				$empty.addClass('d-none');
			} else {
				$img.attr('src', '');
				$pathLabel.text('');
				$previewWrap.addClass('d-none');
				$empty.removeClass('d-none');
			}
		}

		function validate(file) {
			var ext = '.' + file.name.split('.').pop().toLowerCase();
			if (accept.length && accept.indexOf(ext) === -1) {
				return 'فرمت فایل مجاز نیست. فرمت‌های مجاز: ' + accept.join(' ، ');
			}
			if (file.size > maxSize) {
				return 'حجم فایل نباید بیشتر از ' + humanSize(maxSize) + ' باشد.';
			}
			return null;
		}

		function setLoading(loading) {
			$u.toggleClass('fu-loading', loading);
			$drop.toggleClass('fu-uploading', loading);
		}

		function upload(file) {
			var error = validate(file);
			if (error) {
				showToast('error', error);
				return;
			}

			setLoading(true);
			AdminServices.Upload.uploadImage(file)
				.then(function (res) {
					if (res && res.success) {
						$hidden.val(res.filePath).trigger('change');
						render();
						showToast('success', 'آپلود با موفقیت انجام شد', 1500);
					} else {
						showToast('error', (res && res.message) || 'خطا در آپلود فایل');
					}
				})
				.catch(function () {
					// خطا توسط مدیریت سراسری ApiClient نمایش داده شده است
				})
				.finally(function () {
					setLoading(false);
					$input.val('');
				});
		}

		// کلیک روی ناحیه (به‌جز دکمه‌ها) → انتخاب فایل
		$drop.on('click', function (e) {
			if ($(e.target).closest('.fu-actions').length) return;
			$input.trigger('click');
		});

		$input.on('change', function () {
			if (this.files && this.files[0]) upload(this.files[0]);
		});

		// Drag & Drop
		$drop.on('dragover dragenter', function (e) {
			e.preventDefault();
			e.stopPropagation();
			$drop.addClass('fu-dragover');
		});
		$drop.on('dragleave dragend', function (e) {
			e.preventDefault();
			$drop.removeClass('fu-dragover');
		});
		$drop.on('drop', function (e) {
			e.preventDefault();
			e.stopPropagation();
			$drop.removeClass('fu-dragover');
			var files = e.originalEvent && e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files;
			if (files && files[0]) upload(files[0]);
		});

		// حذف فایل انتخاب‌شده
		$u.find('.fu-remove').on('click', function (e) {
			e.preventDefault();
			e.stopPropagation();
			$hidden.val('').trigger('change');
			$input.val('');
			render();
		});

		// تغییر فایل
		$u.find('.fu-change').on('click', function (e) {
			e.preventDefault();
			e.stopPropagation();
			$input.trigger('click');
		});

		render();
	}

	function initAll(root) {
		$(root || document).find('.file-uploader').each(function () {
			init(this);
		});
	}

	$(function () { initAll(); });

	return { init: init, initAll: initAll };
})(jQuery);
