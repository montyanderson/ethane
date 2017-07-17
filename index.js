const Abi = require("ethereumjs-abi");
const rpc = require("./lib/rpc");

async function wait(ms) {
	return new Promise(r => setTimeout(r, ms));
}

module.exports = class Ethane {
	constructor(provider) {
		this.rpc = rpc(provider);
	}

	contract(data) {
		const { abi, binary } = data;

		const Contract = class Contract {
			constructor(contract) {
				Object.assign(this, contract);
			}

			static at(address) {
				return new Contract({
					address
				});
			}

			static async new() {
				const coinbase = await Contract.ethane.rpc.eth_coinbase();

				const tx = await Contract.ethane.rpc.eth_sendTransaction({
					from: coinbase,
					data: "0x" + binary
				});

				while(true) {
					const res = await Contract.ethane.rpc.eth_getTransactionReceipt(tx);

					if(res != null) {
						res.contract = Contract.at(res.contractAddress);
						return res;
					}

					await wait(500);
				}
			}
		}

		Contract.ethane = this;
		Contract.prototype.ethane = this;

		for(let method of abi) {
			const inputTypes = method.inputs.map(i => i.type);
			const outputTypes = (method.outputs || []).map(i => i.type);
			const id = Abi.methodID(method.name, inputTypes).toString("hex");

			Contract.prototype[method.name] = async function() {
				const coinbase = await this.ethane.rpc.eth_coinbase();

				const args = {
					from: coinbase,
					to: this.address,
					data: "0x" + id + Abi.rawEncode(inputTypes, arguments).toString("hex")
				};

				let res;

				if(method.constant == true) {
					res = await this.ethane.rpc.eth_call(args, "pending");
				} else {
					res = await this.ethane.rpc.eth_sendTransaction(args);
				}

				const output = Abi.rawDecode(outputTypes, Buffer.from(res.slice(2), "hex"));

				return output.length <= 1 ? output[0] : output;
			};
		}

		return Contract;
	}
};
