module.exports = function rpc(provider) {
	return new Proxy({}, {

		function get(target, property) {
			return function() {
				return new Promise((resolve, reject) => {
					provider.sendAsync({
						method: property,
						params: [...arguments]
					}, (error, data) => {
						if(error) {
							reject(error);
						} else {
							if(data.error) {
								reject(data.error);
							} else {
								resolve(data.result);
							}
						}
					});
				});
			}
		}

	});
}
