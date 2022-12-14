const hre = require("hardhat");

// Returns the Ether balance of a given address.
async function getBalance(address) {
	const balanceBigInt = await hre.ethers.provider.getBalance(address);
	return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ether Balances for a list of addresses.
async function printBalances(addresses) {
	let idx = 0;
	for (const address of addresses) {
		console.log(`Address ${idx} balance:`, await getBalance(address));
		idx++;
	}
}

// Logs the memos stored on-chain from coffee purchases.
async function printMemos(memos) {
	for (const memo of memos) {
		const timestamp = memo.timestamp;
		const tipper = memo.name;
		const tipperAddress = memo.from;
		const message = memo.message;
		console.log(
			`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`
		);
	}
}

async function main() {
	// Get the example accounts we'll be working with.
	const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

	// We get the contract to deploy.
	const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
	const buyMeACoffee = await BuyMeACoffee.deploy();

	// Deploy the contract.
	await buyMeACoffee.deployed();
	console.log("BuyMeACoffee deployed to:", buyMeACoffee.address);

	// Check balances before the coffee purchase.
	const addresses = [
		owner.address,
		tipper.address,
		tipper2.address,
		tipper3.address,
		buyMeACoffee.address,
	];
	console.log("== start ==");
	await printBalances(addresses);

	// Buy the owner a few coffees.
	const tip1 = { value: hre.ethers.utils.parseEther("1") };
	const tip2 = { value: hre.ethers.utils.parseEther("2") };
	const tip3 = { value: hre.ethers.utils.parseEther("3") };
	await buyMeACoffee
		.connect(tipper)
		.buyCoffee("Kiyo1", "I am not Bach!", tip1);
	await buyMeACoffee
		.connect(tipper2)
		.buyCoffee("Kiyo2", "Absolutely, I am not Bach!", tip2);
	await buyMeACoffee
		.connect(tipper3)
		.buyCoffee("Kiyo3", "Unconditionally, I am not Bach!", tip3);

	// Check balances after the coffee purchase.
	console.log("== bought coffee ==");
	await printBalances(addresses);

	// Withdraw.
	await buyMeACoffee.connect(owner).withdrawTips();

	// Check balances after withdrawal.
	console.log("== withdrawTips ==");
	await printBalances(addresses);

	// Check out the memos.
	console.log("== memos ==");
	const memos = await buyMeACoffee.getMemos();
	printMemos(memos);
}

// error handling
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
