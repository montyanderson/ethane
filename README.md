# ethane

:scroll: Convenient Ethereum smart contract library for Javascript.
## Usage

Include the library.

``` javascript
const ethane = require("ethane");
```

Set the `web3` provider

``` javascript
ethane.provider = web3.currentProvider;
```

Add your contract

``` javascript
const Account = ethane.contract(
	abi: /* contract abi */,
	bin: /* contract binary */
);
```

Create an instance to interface with a live contract

``` javascript
const account = Account.at("0x4780e332579dd6c885fbd66ae8166b103b016ef7");
```

**or**

Create a instance of your contract altogether

``` javascript
const account = await Account.new();
```

Run a method!

Ethane automatically uses `call` for `constant` functions and `sendTransaction` otherwise.

``` javascript
console.log(await account.getName());
```

```
Monty
```
