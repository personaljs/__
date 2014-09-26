(function () {
	// Invoke strict mode
	"use strict";
	var defaults = {
		lang : 'root',
		gender : {
			men   : 1,
			women : 0
		}
	};
	var nlsRegExp = /(^.*(^|\/)nls(\/|$))([^\/]*)\/?([^\/]*)/;

	// Mapping from pluralization group plural logic.
	var pluralTypes = {
		chinese		: function(n) { return 0; },
		german		: function(n) { return n !== 1 ? 1 : 0; },
		french		: function(n) { return n > 1 ? 1 : 0; },
		russian		: function(n) { return n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2; },
		czech		: function(n) { return (n === 1) ? 0 : (n >= 2 && n <= 4) ? 1 : 2; },
		polish		: function(n) { return (n === 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2); },
		icelandic	: function(n) { return (n % 10 !== 1 || n % 100 === 11) ? 1 : 0; }
	};

	// Mapping from pluralization group to individual locales.
	var mapping = {
		chinese		: ['fa', 'id', 'ja', 'ko', 'lo', 'ms', 'th', 'tr', 'zh'],
		german		: ['da', 'de', 'en', 'es', 'fi', 'el', 'he', 'hu', 'it', 'nl', 'no', 'pt', 'sv'],
		french		: ['fr', 'tl', 'pt-br'],
		russian		: ['hr', 'ru'],
		czech		: ['cs'],
		polish		: ['pl'],
		icelandic	: ['is']
	};

	var __ = function (objs) {
		this.req = objs.req;
		this.name = objs.name;
		this.dictionary = {};
		/*
		* Set defaults values for gender 
		*/
		this.setDefaults = function (config) {
			this.gender = {
				man   : config.gender.men,
				woman : config.gender.women
			};
			this.lang = config.lang || 'root';
		}
		/*
		 * записываем в словарь набор слов
		 * locale - обьект со словами, lang - язык словаря
		 * если не передан язык то думаем что это подгрузочный файл с root и флагами языков
		*/
		this.setDictionary = function (locale, lang) {
			if(lang) this.dictionary[lang] = locale;
			else this.dictionary = locale;
		}

		this.setCounter = function (lang) {
			var type, l, langs, family;
			for (type in mapping) {
				if (mapping.hasOwnProperty(type)) {
					if (mapping[type].indexOf(lang) !== -1) {
						family = type;
					} 
				}
			}
			this.counter = pluralTypes[family || 'russian'];
		}
		this.replaceCount = function (word, count) {
			return word.replace(/\({2}([^\)]+)\){2}/gi, function(m,value){
				var arr = value.split('|');
				return arr[count] || '';
			});
		}
		this.checkGender = function (gender) {
			return this.gender.man === gender ? 0 : 1;
		}
		this.replaceGender = function (word, gender) {
			return word.replace(/\[{2}([^\]]+)\]{2}/gi, function(m,value){
				var arr = value.split('|');
				return arr[gender] || '';
			});
		}
		this.replaceActions = function (word, actions) {
			return word.replace(/\{{2}([^\}]+)\}{2}/gi, function(m,value){
				return actions[value] || '';
			});
		} 

		this.setPhrases = function (lang) {
			this.out.get = this.dictionary[ this.dictionary.hasOwnProperty(lang) ? lang : 'root' ];
			this.setCounter(lang);
		}
		this.setLang = function (code) {
			var code = code;

			var match = nlsRegExp.exec(this.name),
					prefix = match[1],
					locale = match[4],
					suffix = match[5];
			var lang = code ? code + match[3] : '';

			var path = match[1] + lang + match[4] + match[5];

			if(!code || this.dictionary.hasOwnProperty(code)) {
				this.req([path], (function (code, locale) {
					this.setDictionary( locale, code );
					this.setPhrases(code);
				}).bind(this, code));
			} else {
				this.setPhrases(code);
			}
		}
		this.out = (function (word, count, gender, actions) {
			var word = this.dictionary[this.lang][word];
				word = this.replaceCount(word, this.counter(count))
				word = this.replaceGender(word, this.checkGender(gender))
				word = this.replaceActions(word, actions);
			return word;
		}).bind(this);
		this.out.get = {};
		this.out.setLang = this.setLang.bind(this);
	}

	define(['module'], function (module) {
		return {
			/**
			 * Called when a dependency needs to be loaded.
			*/
			load: function (name, req, onLoad, config) {

				var Locale = new __({
					name : name,
					req  : req
				});

				config = config && config.__ || defaults;
				Locale.setDefaults(config);

				Locale.out.setLang();
				onLoad(Locale.out);
			}
		}
	});
})();