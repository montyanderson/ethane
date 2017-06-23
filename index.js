const stdrpc = require("stdrpc");
const abi = require("ethereumjs-abi");

module.exports = class Ethane {
	constructor() {
		this.rpc = stdrpc(...arguments);
	}

	contract(contractAbi) {
		const Contract = function(address) {
			this.address = address;
		};

		Contract.prototype.rpc = this.rpc;

		contractAbi.forEach(method => {
			const inputTypes = method.inputs.map(i => i.type);
			const outputTypes = (method.outputs || []).map(i => i.type);
			const id = abi.methodID(method.name, inputTypes).toString("hex");

			Contract.prototype[method.name] = function() {
				return this.rpc.eth_coinbase().then(coinbase => {
					const args = [ {
						from: coinbase,
						to: this.address,
						data: "0x" + id + abi.rawEncode(inputTypes, arguments).toString("hex")
					}, "latest" ];

					if(method.constant == true) {
						return this.rpc.eth_call(...args);
					} else {
						return this.rpc.eth_sendTransaction(...args);
					}
				}).then(res => {
					const output = abi.rawDecode(outputTypes, Buffer.from(res.slice(2), "hex"));
					
					return output.length <= 1 ? output[0] : output;
				});
			};
		});

		return Contract;
	}
};
