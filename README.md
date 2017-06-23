# ethane

Clear, modern, ES6-compatible module for interacting with Ethereum smart contracts.

## Usage

``` javascript
const Ethane = require("../ethane");

const ethane = new Ethane("http://localhost:8545");

const Account = ethane.contract(
	/* Contract ABI */
);

const account = new Account("0x4780e332579dd6c885fbd66ae8166b103b016ef7");

account.getName().then(name => {
	console.log(name);
}).catch(error => {
	console.log(error);
});
```
