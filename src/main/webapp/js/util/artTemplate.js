define('util/artTemplate', ['util/artTemplate.source'], function(require) {
	var tmpl = require('util/artTemplate.source');
	tmpl.helper('capitalAlpha', function(i) {
		return String.fromCharCode(65 + i);
	});
	return tmpl;
});