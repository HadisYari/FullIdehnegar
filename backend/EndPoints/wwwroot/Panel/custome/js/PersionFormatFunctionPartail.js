
 
	// ۱. تابع کمکی برای تبدیل اعداد فارسی/عربی به انگلیسی
				function format(input) {
		let value = input.value + '';

		// ذخیره موقعیت فعلی مکان‌نما و طول متن قبل از تغییر
		const selectionStart = input.selectionStart;
		const oldLength = value.length;

		// ۱. تبدیل سریع و بهینه اعداد فارسی/عربی به انگلیسی
		value = value.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
					 .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

		// ۲. حذف کاراکترهای غیر عددی (فقط اولین نقطه اعشار حفظ می‌شود)
		value = value.replace(/[^0-9.]/g, "");

		const parts = value.split('.');
		let integerPart = parts[0];

		// اگر نقطه وجود داشت، فقط پارت اول اعشار رو بردار
		let decimalPart = parts.length > 1 ? '.' + parts[1] : '';

		// ۳. کاما گذاری بخش صحیح با استفاده از Intl.NumberFormat (بهینه و بدون لوپ)
		if (integerPart) {
			const num = parseInt(integerPart, 10);
			if (!isNaN(num)) {
				integerPart = new Intl.NumberFormat('en-US').format(num);
			}
		}

		// ۴. اعمال خروجی نهایی
		input.value = integerPart + decimalPart;

		// ۵. محاسبه و بازگرداندن مکان‌نما به موقعیت درست خودش
		const newLength = input.value.length;
		const nextPosition = selectionStart + (newLength - oldLength);
		input.setSelectionRange(nextPosition, nextPosition);
	}
 
	$(document).ready(function () {
		// تنظیمات قبلی دیتاتیبل شما
		if (jQuery.fn.DataTable) {
			jQuery.fn.DataTable.ext.type.search.string = function (data) {
				return !data ? '' : normalizePersian(data);
			};
		}

		// راهکار قطعی و سینیور برای تمام Select2ها (اورراید کردن متد داخلی مچ‌ر)
		if (jQuery.fn.select2 && $.fn.select2.amd) {
			$.fn.select2.amd.require(['select2/compat/matcher'], function (oldMatcher) {
				// ایجاد یک ماژول مچ‌ر سفارشی بر پایه نرمالایز شما
				var customMatcher = function (params, data) {
					if ($.trim(params.term) === '') {
						return data;
					}
					if (typeof data.text === 'undefined') {
						return null;
					}

					// نرمالایز کردن هر دو سمت
					var search = normalizePersian(params.term);
					var text = normalizePersian(data.text);

					if (text.indexOf(search) > -1) {
						return data;
					}

					// پشتیبانی از ساختارهای درختی و optgroup
					if (data.children && data.children.length > 0) {
						var matchChildren = [];
						$.each(data.children, function (index, child) {
							var childMatch = customMatcher(params, child);
							if (childMatch !== null) {
								matchChildren.push(childMatch);
							}
						});

						if (matchChildren.length > 0) {
							var clonedData = $.extend(true, {}, data);
							clonedData.children = matchChildren;
							return clonedData;
						}
					}
					return null;
				};

				// تزریق مچ‌ر سفارشی به آپشن‌های پیش‌فرض دکوراتورهای Select2
				$.fn.select2.defaults.defaults.matcher = customMatcher;
			});
		}
	});



			function normalizePersian(text) {
		if (!text) return '';

		return text
			.toString()
			.toLowerCase()
			// تبدیل 'ي' (عربی) به 'ی' (فارسی)
			.replace(/ي/g, 'ی')
			// تبدیل 'ك' (عربی) به 'ک' (فارسی)
			.replace(/ك/g, 'ک')
			// تبدیل ه‌های دو نقطه (ة) به ه معمولی
			.replace(/ة/g, 'ه')
			// یکدست‌سازی انواع نیم‌فاصله
			.replace(/[\u200B-\u200D\uFEFF]/g, ' ')
			// حذف اعراب (فتحه، ضمه، کسره، تنوین‌ها و تشدید)
			.replace(/[\u064B-\u0652]/g, '')
			// یکدست‌سازی اعداد (تبدیل همه به اعداد انگلیسی یا فارسی - در اینجا همه به انگلیسی تبدیل می‌شوند تا سرچ یکسان شود)
			.replace(/[۰-۹]/g, c => String.fromCharCode(c.charCodeAt(0) - 1728))
			.replace(/[٠-٩]/g, c => String.fromCharCode(c.charCodeAt(0) - 1632))
			// حذف فاصله‌های اضافی احتمالی
			.replace(/\s+/g, ' ')
			.trim();
	}
 