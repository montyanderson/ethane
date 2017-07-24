# ethane

ES8-compatible Ethereum smart contracts library for Javascript.

## Usage

``` javascript
const Ethane = require("ethane");
ethane.provider = web3.currentProvider;

const Account = ethane.contract(
	abi: /* contract abi */,
	bin: /* contract binary */
);

const account = Account.at("0x4780e332579dd6c885fbd66ae8166b103b016ef7");

account.getName().then(name => {
	console.log(name);
});
```
