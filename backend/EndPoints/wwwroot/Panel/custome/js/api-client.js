/*
 * ApiClient - کلاینت مرکزی HTTP پنل مدیریت
 * - BaseURL یکپارچه برای همه درخواست‌ها
 * - اینترسپتور درخواست/پاسخ (افزودن توکن AntiForgery، مدیریت Content-Type)
 * - مدیریت سراسری خطاها با SweetAlert
 */
window.ApiClient = (function () {
	'use strict';

	var baseUrl = '/Admin';

	function getAntiForgeryToken() {
		var el = document.querySelector('input[name="__RequestVerificationToken"]');
		return el ? el.value : '';
	}

	// اینترسپتور پاسخ: مدیریت سراسری خطاها
	function handleError(message) {
		if (window.Swal) {
			Swal.fire({
				icon: 'error',
				title: message || 'خطا در ارتباط با سرور',
				toast: true,
				position: 'top-end',
				timer: 3000,
				showConfirmButton: false
			});
		}
	}

	async function request(url, options) {
		options = options || {};
		options.headers = options.headers || {};

		// اینترسپتور درخواست
		if (options.body && !(options.body instanceof FormData)) {
			options.headers['Content-Type'] = 'application/json';
		}
		var token = getAntiForgeryToken();
		if (token) {
			options.headers['RequestVerificationToken'] = token;
		}

		var response;
		try {
			response = await fetch(baseUrl + url, options);
		} catch (networkError) {
			handleError('عدم دسترسی به سرور. اتصال اینترنت را بررسی کنید.');
			throw networkError;
		}

		if (!response.ok) {
			var message = 'خطای سرور (' + response.status + ')';
			try {
				var errBody = await response.json();
				if (errBody && errBody.message) message = errBody.message;
			} catch (e) { /* پاسخ JSON نیست */ }
			handleError(message);
			throw new Error(message);
		}

		var contentType = response.headers.get('content-type') || '';
		return contentType.indexOf('application/json') >= 0 ? response.json() : response.text();
	}

	return {
		baseUrl: baseUrl,

		get: function (url) {
			return request(url, { method: 'GET' });
		},

		post: function (url, data) {
			return request(url, { method: 'POST', body: JSON.stringify(data || {}) });
		},

		// اکشن‌های Delete در MVC از نوع POST هستند
		del: function (url) {
			return request(url, { method: 'POST' });
		},

		// آپلود multipart/form-data
		upload: function (url, formData) {
			return request(url, { method: 'POST', body: formData });
		},

		// آداپتر آماده برای DataTables: ajax: ApiClient.dataTableAjax(service, params)
		dataTableAjax: function (service, params) {
			return function (data, callback) {
				service.getList(params)
					.then(function (json) { callback({ data: (json && json.data) || [] }); })
					.catch(function () { callback({ data: [] }); });
			};
		}
	};
})();
