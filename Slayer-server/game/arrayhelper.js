
global.len = function(obj) {
    if(typeof obj === 'object') return Object.keys(obj).length;
    else return obj.length;
};

module.exports = {
	/**
	 * Generate inverted frequency array from array of objects
	 */
	frequencies: function(cont, attr) {
		var type_ifreqs = cont.reduce((type, item) => {
			type[item[attr]] = !type[item[attr]] ? 1 : type[item[attr]]+1;

			return type;
		}, {});
		
		var type_freqs = {};
		for(var type in type_ifreqs) {
			var freq = type_ifreqs[type];

			if(!type_freqs[freq]) type_freqs[freq] = [];
			type_freqs[freq].push( type );
		}

		// there is no such thing as a 1 element series
		delete type_freqs[1];

		return type_freqs;
	},

	/**
	 * Get longest series in list of ranks
	 * @todo: this is partly poker logic
	 */
	max_series: function(cont) {
		var arr = cont.reduce((rank, item) => {
			rank.push(parseInt(item.rank))
			return rank;
		}, []);

		arr.sort((a, b) => {  return a - b;  });

		var res = [0];
		for(var i=1;i<arr.length;i++)
			res[i] = (arr[i] == arr[i-1] + 1) ? (res[i-1] + 1) : 0;

		var maxLength = Math.max.apply({},res) + 0;
		var arr_i = res.indexOf(maxLength);

		//special case for suckers' straight, where Ace acts as a low
		var suckers = [2,3,4,5,14];
		if(arr.every((v,i)=> v === suckers[i]))
			return [5, 5];

		return [maxLength+1, arr[arr_i]];
	},

	shuffle: function(arr) {
		var collection = arr.splice(); 
		var len = arr.length, random, temp;
		
		while (len) {
			random = Math.floor(Math.random() * len);
			len -= 1;
			temp = collection[len];
			collection[len] = collection[random];
			collection[random] = temp;
		}

		return collection;
	}
};