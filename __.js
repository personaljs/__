/**
 * @__.js
 *
 * @author Ivan Dolgov
 * @link http://github.com/onmoon/__
 *
 * @copyright Ivan Dolgov, 2014
 * @license MIT: You are free to use and modify this code for any use, on the condition that this copyright notice remains.
 */
s

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

	var Locale = function (objs) {
		this.req = objs.req;
		this.name = objs.name;

		this.setDefaults = function (config) {
			this.gender = {
				man   : config.gender.men,
				woman : config.gender.women
			};
			this.lang = config.lang || 'root';
		};
		
		this.setDictionary = function (locale, lang) {
			if(lang) this.dictionary[lang] = locale;
			else this.dictionary = locale;
		};

		this.setCounter = function () {
			var type, l, langs, family;
			for (type in mapping) {
				if (mapping.hasOwnProperty(type)) {
					if (mapping[type].indexOf(this.lang) !== -1) {
						family = type;
					} 
				}
			}
			this.counter = pluralTypes[family || 'russian'];
		};
		
		this.replaceCount = function (word, count) {
			return word.replace(/\({2}([^\)]+)\){2}/gi, function(m,value){
				var arr = value.split('|');
				return arr[count] || '';
			});
		};
		
		this.checkGender = function (gender) {
			return this.gender.man === gender ? 0 : 1;
		};
		
		this.replaceGender = function (word, gender) {
			return word.replace(/\[{2}([^\]]+)\]{2}/gi, function(m,value){
				var arr = value.split('|');
				return arr[gender] || '';
			});
		};
		
		this.replaceActions = function (word, actions) {
			return word.replace(/\{{2}([^\}]+)\}{2}/gi, function(m,value){
				return actions[value] || '';
			});
		};

		this.setPhrases = function (lang) {
			this.dictionary = this.dictionary || {};
			this.lang = this.dictionary.hasOwnProperty(lang) ? lang : 'root';
			this.out.get = this.dictionary[this.lang];
			this.setCounter();
		};
		
		this.setLang = function (code, callback) {

			var match = nlsRegExp.exec(this.name),
					prefix = match[1],
					locale = match[4],
					suffix = match[5];
			var lang = code ? code + match[3] : '';

			var path = match[1] + lang + match[4] + match[5];

			if(!code || this.dictionary.hasOwnProperty(code)) {
				this.req([path], (function (code, callback, locale) {
					this.setDictionary( locale, code );
					this.setPhrases(code);
					if(callback) callback.apply(this);
				}).bind(this, code, callback));
			} else {
				this.setPhrases(code);
				if(callback) callback.apply(this);
			}
		};
		
		this.out = (function (word, count, gender, actions) {
			word = this.dictionary[this.lang][word];
			word = this.replaceCount(word, this.counter(count));
			word = this.replaceGender(word, this.checkGender(gender));
			word = this.replaceActions(word, actions);
			return word;
		}).bind(this);
		
		this.out.get = {};
		
		this.out.setLang = this.setLang.bind(this);
	};

	define(['module'], function (module) {
		return {
			/**
			 * Called when a dependency needs to be loaded.
			*/
			load: function (name, req, onLoad, config) {

				var locale = new Locale({
					name : name,
					req  : req
				});

				config = config && config.__ || defaults;
				locale.setDefaults(config);

				locale.out.setLang(null , function(){
					onLoad(locale.out);
				});
			}
		};
	});
})();
