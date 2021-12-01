import Web3 from "web3";
import { BlockHeader } from "web3-eth";

async function main() {
  const web3 = new Web3(new Web3.providers.WebsocketProvider("wss://mainnet.infura.io/ws/v3/<project-id>", {}));

  let prevBlock: BlockHeader;
  web3.eth.subscribe("newBlockHeaders", (err, block) => {
    console.log(block.number, block.hash, block.parentHash);

    if (prevBlock && prevBlock.hash != block.parentHash)
      console.log(`!!!! Inconsistency`);

    prevBlock = block;
  });
}

main();
