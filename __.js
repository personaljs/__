var __ = function (val, count) {
	__.locale = 'en';
	__.gender = 1;
	return __.fn.get(val, count);
};
__.fn = __.prototype = {
	locale : function(val) {
		__.locale = val;
	},
	gender : function(val) { //0 - all, men , 1 - women
		__.gender = val;
	},
	get : function(val, count) {
		var word = locale[__.locale][val];
		if (word) word = __.fn.replaceGender(word);
		if (word && count) word = __.fn.replaceTime(word, count);
		return word || val;
	},
	replaceGender: function(word) {
		var w = word.match(/\[(.*?)\]/);//[0] - то что надо заменить [1] - чем заменить
		if(!w) return word;
		var res = w[1].split('|');
		return word.replace(w[0], res[__.gender]);
	},
	replaceTime: function(word, count) {
		var w = word.match(/\(([^\(\)]+)\)/);//[0] - то что надо заменить [1] - чем заменить
		if(!w) return word;
		var res = w[1].split('|');
		return word.replace( w[0] ,res[  __.fn['count' + __.locale](count) ] );
	},
	countru: function(count) {
		if (count > 10 && Math.floor((count % 100) / 10) == 1) {
            return 2;
        } else {
        	switch (count % 10) {
				case 1: return 0;
				case 2:
				case 3:
				case 4: return 1;
				default: return 2;
			}
		}
	},
	counten: function(count) {
		return count === 1 ? 0 : 1; 
	}
};
