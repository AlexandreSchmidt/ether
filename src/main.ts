import { Web3, utils } from "web3";
import { getEthCurrencies, getLatestPrice } from "./coinMarket";
import {
  createReadStream,
  createWriteStream,
  existsSync,
  readFileSync,
} from "fs";

import "dotenv/config";
import { config } from "dotenv";

async function main() {
  const environments = config();
  if (environments.error) {
    throw environments.error;
  }

  const web3 = new Web3(process.env.ENDPOINT_ETHER);

  const private_key_path = "./src/private_keys/test_private_key";

  let wallet;
  if (existsSync(private_key_path)) {
    console.log("private key founded, loading wallet ...\n");
    let private_key = readFileSync(private_key_path, "utf8");
    wallet = web3.eth.accounts.privateKeyToAccount(private_key);
  } else {
    console.log("Private key not found, creating new wallet ...");
    wallet = web3.eth.accounts.create();

    const writeStream = createWriteStream(private_key_path);
    writeStream.write(wallet.privateKey);
    writeStream.end();
  }

  // Dummy Account create inside hardhat network for testing
  const dummyAccount = web3.eth.accounts.privateKeyToAccount(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
  );

  const receipt = await web3.eth.sendTransaction({
    from: dummyAccount.address,
    to: wallet.address,
    value: web3.utils.toWei("1", "ether"),
  });

  console.log(
    `Transaction made from address -> ${dummyAccount.address} to ${wallet.address} \n
    Transaction Hash -> ${receipt.transactionHash}\n
    Block Hash -> ${receipt.blockHash}\n
    Gas Used -> ${receipt.gasUsed}\n
    Value -> 1 ether`
  );
}

main();
