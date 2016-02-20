if (opera.extension && opera.extension.bgProcess) {
	_.bg = opera.extension.bgProcess;
	_.i18n = _.bg._.i18n;
	// Promise MUST be the same contructor
	window.Promise = _.bg.Promise;
} else {
	_.bg = window;
}

_.options = function () {
	var defaults = {
		isApplied: true,
		autoUpdate: true,
		lastUpdate: 0,
		showButton: true,
		showBadge: true,
		exportValues: true,
		closeAfterInstall: false,
	};

	function getOption(key, def) {
		var value = widget.preferences.getItem(key), obj;
		if(value) try {
			obj = JSON.parse(value);
		} catch(e) {
			obj = def;
		} else obj = def;
		if (obj == null) obj = defaults[key];
		return obj;
	}

	function setOption(key, value) {
		if (key in defaults)
			widget.preferences.setItem(key, JSON.stringify(value));
	}

	function getAllOptions() {
		var options = {};
		for (var i in defaults) options[i] = getOption(i);
		return options;
	}

	return {
		get: getOption,
		set: setOption,
		getAll: getAllOptions,
	};
}();

_.getUniqId = function () {
	return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
};

_.getLocaleString = function (meta, key) {
	var languages = [navigator.language];
	var i = languages[0].indexOf('-');
	if (i > 0) {
		var lang = languages[0]
		languages[0] = lang.slice(0, i) + lang.slice(i).toUpperCase();
		languages.push(lang.slice(0, i));
	}
	var lang = _.find(languages, function (lang) {
		return (key + ':' + lang) in meta;
	});
	if (lang) key += ':' + lang;
	return meta[key] || '';
};

_.sendMessage = function (req) {
	var func = _.bg.commands[req.cmd];
	return Promise.resolve(func && func(req.data));
};
