const abi = require("ethereumjs-abi");
const rpc = require("./lib/rpc");

module.exports = class Ethane {
	constructor(provider) {
		this.rpc = rpc(provider);
	}

	contract(contractAbi) {
		const Contract = function(address) {
			this.address = address;
		};

		Contract.prototype.ethane = this;

		for(let method of contractAbi) {
			const inputTypes = method.inputs.map(i => i.type);
			const outputTypes = (method.outputs || []).map(i => i.type);
			const id = abi.methodID(method.name, inputTypes).toString("hex");

			Contract.prototype[method.name] = function() {
				return this.ethane.rpc.eth_coinbase().then(coinbase => {
					const args = {
						from: coinbase,
						to: this.address,
						data: "0x" + id + abi.rawEncode(inputTypes, arguments).toString("hex")
					};

					if(method.constant == true) {
						return this.ethane.rpc.eth_call(args, "latest");
					} else {
						return this.ethane.rpc.eth_sendTransaction(args);
					}
				}).then(res => {
					const output = abi.rawDecode(outputTypes, Buffer.from(res.slice(2), "hex"));

					return output.length <= 1 ? output[0] : output;
				});
			};
		}

		return Contract;
	}
};
