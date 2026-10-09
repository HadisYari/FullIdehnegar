/*
 * admin.js — رفتارهای مشترک پنل مدیریت ایده‌نگار
 * ۱) باز و بسته کردن منوی کناری
 * ۲) تأیید حذف/عملیات خطرناک با SweetAlert
 * ۳) ویرایشگر تکرارشدنی (Repeater) که محتوای JSON را با ردیف‌ها همگام نگه می‌دارد
 * ۴) شمارنده کاراکتر برای فیلدهای کوتاه
 * وابستگی‌ها: jQuery + file-uploader.js (برای ردیف‌های تصویری) و SweetAlert2 (اختیاری).
 */
(function () {
	'use strict';

	var IMAGE_ACCEPT = '.jpg,.jpeg,.png,.webp,.svg,.ico,.gif';
	var IMAGE_MAX_SIZE = 6 * 1024 * 1024;

	function onReady(fn) {
		if (document.readyState !== 'loading') {
			fn();
		} else {
			document.addEventListener('DOMContentLoaded', fn);
		}
	}

	/* ─────────────────────────── منوی کناری ─────────────────────────── */
	function initSidebar() {
		var toggle = document.getElementById('adminSidebarToggle');
		var shell = document.querySelector('.admin-shell');
		if (!toggle || !shell) return;

		toggle.addEventListener('click', function () {
			shell.classList.toggle('sidebar-collapsed');
			try {
				localStorage.setItem('idehnegar-sidebar', shell.classList.contains('sidebar-collapsed') ? 'collapsed' : 'open');
			} catch (error) { /* حالت خصوصی مرورگر */ }
		});

		try {
			if (localStorage.getItem('idehnegar-sidebar') === 'collapsed') {
				shell.classList.add('sidebar-collapsed');
			}
		} catch (error) { /* ignore */ }
	}

	/* ─────────────────────────── تأیید عملیات ─────────────────────────── */
	function initConfirmations() {
		document.addEventListener('submit', function (event) {
			var form = event.target;
			if (!(form instanceof HTMLFormElement)) return;

			var message = form.getAttribute('data-confirm');
			if (!message || form.dataset.confirmed === '1') return;

			event.preventDefault();

			function proceed() {
				form.dataset.confirmed = '1';
				if (typeof form.requestSubmit === 'function') {
					form.requestSubmit();
				} else {
					form.submit();
				}
			}

			if (window.Swal) {
				window.Swal.fire({
					icon: 'warning',
					title: 'مطمئنید؟',
					text: message,
					showCancelButton: true,
					confirmButtonText: 'بله، انجام بده',
					cancelButtonText: 'انصراف',
					focusCancel: true
				}).then(function (result) {
					if (result && result.isConfirmed) proceed();
				});
			} else if (window.confirm(message)) {
				proceed();
			}
		});
	}

	/* ─────────────────────────── ویرایشگر تکرارشدنی ─────────────────────────── */
	function parseColumns(node) {
		var raw = node.getAttribute('data-repeater-columns') || '[]';
		try {
			return JSON.parse(raw);
		} catch (error) {
			return [];
		}
	}

	function columnInput(column) {
		var kind = (column.kind || 'text').toLowerCase();

		if (kind === 'textarea') {
			var area = document.createElement('textarea');
			area.className = 'form-control form-control-sm admin-latin';
			area.rows = 2;
			area.setAttribute('data-prop', column.property);
			area.dir = 'auto';
			return area;
		}

		if (kind === 'checkbox') {
			var wrap = document.createElement('div');
			wrap.className = 'form-check mb-0';
			var box = document.createElement('input');
			box.className = 'form-check-input';
			box.type = 'checkbox';
			box.setAttribute('data-prop', column.property);
			wrap.appendChild(box);
			return wrap;
		}

		if (kind === 'image') {
			// همان ساختاری که file-uploader.js انتظار دارد؛ مقدار در .fu-value می‌نشیند.
			var uploader = document.createElement('div');
			uploader.className = 'file-uploader file-uploader-sm';
			uploader.setAttribute('data-fu-accept', IMAGE_ACCEPT);
			uploader.setAttribute('data-fu-max-size', String(IMAGE_MAX_SIZE));
			uploader.innerHTML =
				'<input type="hidden" class="fu-value" />' +
				'<div class="fu-dropzone">' +
				'<div class="fu-empty"><i class="ti ti-upload fu-icon"></i><div class="fu-hint">رها کنید یا کلیک کنید</div></div>' +
				'<div class="fu-preview d-none"><img class="fu-preview-img" alt="" /><div class="fu-path small text-muted text-truncate"></div>' +
				'<div class="fu-actions"><button type="button" class="btn btn-sm btn-label-primary fu-change">تغییر</button>' +
				'<button type="button" class="btn btn-sm btn-label-danger fu-remove">حذف</button></div></div>' +
				'<input class="fu-input d-none" type="file" accept="' + IMAGE_ACCEPT + '" />' +
				'</div>';
			uploader.querySelector('.fu-value').setAttribute('data-prop', column.property);
			return uploader;
		}

		var input = document.createElement('input');
		input.type = kind === 'number' ? 'number' : 'text';
		input.className = 'form-control form-control-sm';
		input.setAttribute('data-prop', column.property);
		if (column.maxLength) {
			input.maxLength = column.maxLength;
		}
		input.dir = 'auto';
		if (kind === 'number') {
			input.step = 'any';
		}
		return input;
	}

	function readColumn(root, column) {
		var element = root.querySelector('[data-prop="' + column.property + '"]');
		if (!element) return '';

		var kind = (column.kind || 'text').toLowerCase();
		if (kind === 'checkbox') {
			return !!element.checked;
		}
		if (kind === 'number') {
			var parsed = parseFloat(element.value);
			return isNaN(parsed) ? null : parsed;
		}
		return (element.value || '').trim();
	}

	function writeColumn(root, column, value) {
		var element = root.querySelector('[data-prop="' + column.property + '"]');
		if (!element) return;

		var kind = (column.kind || 'text').toLowerCase();
		if (kind === 'checkbox') {
			element.checked = value === true || value === 'true' || value === 1 || value === '1';
			return;
		}
		element.value = value === null || value === undefined ? '' : String(value);
	}

	function buildRow(columns, values) {
		var row = document.createElement('div');
		row.className = 'admin-repeater-row row g-2 align-items-end';
		row.setAttribute('data-repeater-row', '');

		var width = columns.length >= 3 ? 'col-12 col-lg' : 'col-12 col-md';

		columns.forEach(function (column) {
			var cell = document.createElement('div');
			cell.className = width;
			var label = document.createElement('label');
			label.className = 'form-label small text-muted mb-1';
			label.textContent = column.label || column.property;
			var control = columnInput(column);
			cell.appendChild(label);
			cell.appendChild(control);
			row.appendChild(cell);
		});

		var actions = document.createElement('div');
		actions.className = 'col-auto d-flex gap-1';
		var remove = document.createElement('button');
		remove.type = 'button';
		remove.className = 'btn btn-sm btn-icon btn-label-danger mb-1';
		remove.title = 'حذف این ردیف';
		remove.setAttribute('data-repeater-remove', '');
		remove.innerHTML = '<i class="ti ti-x"></i>';
		actions.appendChild(remove);
		row.appendChild(actions);

		if (values && typeof values === 'object') {
			columns.forEach(function (column) {
				writeColumn(row, column, values[column.property]);
			});
		}

		return row;
	}

	function initRepeater(node) {
		var columns = parseColumns(node);
		var rowsBox = node.querySelector('[data-repeater-rows]');
		var jsonField = node.querySelector('[data-repeater-json]');
		var addButton = node.querySelector('[data-repeater-add]');
		if (!rowsBox || !jsonField || columns.length === 0) return;

		function currentValues() {
			return Array.prototype.map.call(rowsBox.children, function (row) {
				var item = {};
				columns.forEach(function (column) {
					var value = readColumn(row, column);
					if (value !== '' && value !== null) {
						item[column.property] = value;
					}
				});
				return item;
			}).filter(function (item) {
				return Object.keys(item).length > 0;
			});
		}

		function syncToJson() {
			var list = currentValues();
			jsonField.value = list.length ? JSON.stringify(list) : '';
		}

		function rebuildFromJson() {
			var list = [];
			var text = (jsonField.value || '').trim();
			if (text) {
				try {
					var parsed = JSON.parse(text);
					if (Array.isArray(parsed)) list = parsed;
				} catch (error) {
					node.classList.add('has-error');
					return;
				}
			}
			node.classList.remove('has-error');

			rowsBox.textContent = '';
			list.forEach(function (item) {
				rowsBox.appendChild(buildRow(columns, item));
			});
			refreshPreviews();
		}

		function refreshPreviews() {
			if (window.FileUploader && typeof window.FileUploader.initAll === 'function') {
				window.FileUploader.initAll(node);
			}
		}

		rowsBox.addEventListener('input', function (event) {
			var prop = event.target && event.target.getAttribute ? event.target.getAttribute('data-prop') : null;
			if (prop) {
				syncToJson();
			}
		});
		rowsBox.addEventListener('change', syncToJson);

		// با آپلود تصویر، مقدار input مخفی با jQuery تغییر می‌کند؛
		// فقط یک هندلر واگذارشدهٔ jQuery آن رویداد را می‌بیند.
		if (window.jQuery) {
			window.jQuery(rowsBox).on('change', '.fu-value', function () {
				syncToJson();
			});
		}
		jsonField.addEventListener('input', function () {
			// دستی ویرایش شد: ردیف‌ها را با آن هم‌راستا کن.
			window.clearTimeout(node._timer);
			node._timer = window.setTimeout(rebuildFromJson, 500);
		});

		if (addButton) {
			addButton.addEventListener('click', function () {
				var row = buildRow(columns, null);
				rowsBox.appendChild(row);
				refreshPreviews();
				syncToJson();
				var first = row.querySelector('input:not([type="hidden"]), textarea');
				if (first) first.focus();
			});
		}

		rowsBox.addEventListener('click', function (event) {
			var button = event.target.closest ? event.target.closest('[data-repeater-remove]') : null;
			if (!button) return;
			event.preventDefault();
			var row = button.closest('[data-repeater-row]');
			if (row) row.remove();
			syncToJson();
		});

		rebuildFromJson();
		syncToJson();
	}

	function initRepeaters() {
		Array.prototype.forEach.call(document.querySelectorAll('[data-repeater]'), initRepeater);
	}

	/* ─────────────────────────── کمک‌ورودی‌ها ─────────────────────────── */
	function initCounters() {
		Array.prototype.forEach.call(document.querySelectorAll('textarea[maxlength], input[maxlength]'), function (field) {
			var max = parseInt(field.getAttribute('maxlength'), 10);
			if (!max || max > 1000) return;

			var hint = document.createElement('div');
			hint.className = 'form-text admin-counter';
			field.parentNode.insertBefore(hint, field.nextSibling);

			function render() {
				var length = (field.value || '').length;
				hint.textContent = length + ' / ' + max + ' کاراکتر';
				hint.classList.toggle('text-danger', length >= max);
			}

			field.addEventListener('input', render);
			render();
		});
	}

	/* پیش‌نمایش مسیرهای تصویر در فیلدهای متنی ساده */
	function initPathPreviews() {
		Array.prototype.forEach.call(document.querySelectorAll('.admin-latin'), function (field) {
			if (field.tagName !== 'INPUT' || !/^\/(uploads|images)\//i.test(field.value || '')) return;
			var preview = document.createElement('img');
			preview.src = field.value;
			preview.alt = '';
			preview.className = 'admin-inline-thumb';
			preview.loading = 'lazy';
			field.insertAdjacentElement('afterend', preview);
			field.addEventListener('change', function () {
				if (/^\/(uploads|images)\//i.test(field.value || '')) {
					preview.src = field.value;
				}
			});
		});
	}

	onReady(function () {
		initSidebar();
		initConfirmations();
		initRepeaters();
		initCounters();
		initPathPreviews();
	});
})();
