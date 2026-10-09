/*
 * AdminServices - سرویس‌های تفکیک‌شده API برای موجودیت‌های پنل مدیریت
 * تمام فراخوانی‌های AJAX باید از طریق این سرویس‌ها و ApiClient انجام شوند.
 *
 * مثال:
 *   AdminServices.Client.getList().then(...)
 *   AdminServices.ProjectImage.getList({ projectId: 5 }).then(...)
 *   AdminServices.Client.remove(12).then(...)
 *   AdminServices.Upload.uploadImage(file).then(...)
 */
window.AdminServices = (function () {
	'use strict';

	function createCrudService(controller) {
		return {
			controller: controller,

			// لیست رکوردها؛ params اختیاری برای فیلتر (مثلاً { projectId: 5 })
			getList: function (params) {
				var query = '';
				if (params) {
					var parts = [];
					for (var key in params) {
						if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
							parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
						}
					}
					if (parts.length) query = '?' + parts.join('&');
				}
				return ApiClient.get('/' + controller + '/GetList' + query);
			},

			remove: function (id) {
				return ApiClient.del('/' + controller + '/Delete/' + id);
			}
		};
	}

	var services = {};

	[
		'AppDownloadLink',
		'Client',
		'ContactMessage',
		'FaqItem',
		'HomeServiceCard',
		'InquiryType',
		'Milestone',
		'NavigationItem',
		'PageMeta',
		'PageSection',
		'PageSectionItem',
		'PaymentTransaction',
		'PortfolioCategory',
		'PortfolioProject',
		'ProcessStep',
		'ProcessStepDeliverable',
		'ProjectFeature',
		'ProjectImage',
		'ProjectStat',
		'Service',
		'ServiceHighlight',
		'SitePhone',
		'SiteStat',
		'SocialLink',
		'StoreOrder',
		'StorePlan',
		'StorePlanItem',
		'StoreTemplate',
		'StoreTemplateFeature',
		'StoreTemplateScreenshot',
		'Tag',
		'TeamDiscipline',
		'Testimonial',
		'UiText'
	].forEach(function (name) {
		services[name] = createCrudService(name);
	});

	// سرویس آپلود فایل (multipart/form-data)
	services.Upload = {
		uploadImage: function (file) {
			var formData = new FormData();
			formData.append('file', file);
			return ApiClient.upload('/Upload/UploadImage', formData);
		}
	};

	return services;
})();
