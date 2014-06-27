function locale (obj) {
	var lang = 'ru';
	var gender = 0;
	function replace (text, num) {
		text = text.replace(/\[(.*)\]/gi, function(m,value){
			var arr = value.split('|');
			return arr[gender] || '';
		});
		text = text.replace(/\((.*)\)/gi, function(m,value){
			var arr = value.split('|');
			return arr[num] || '';
		});
		return text;
	}
	function getNumber (num) {
		if(lang === 'en' && num > 1) return 1;
		var val = num % 100;
		if (val > 10 && val < 20) return 2;
		else {
			val = num % 10;
			if (val === 1) return 0;
			else if (val > 1 && val < 5) return 1;
			else return 2;
		}
	}
	function out (val, num) {
		return replace(obj[lang][val], getNumber(num));
	}
	out.lang = function (val) {
		lang = val;
	}
	out.gender = function (val) {
		gender = val;
	}
	return out;
};
var __ = locale(locale);
