const { FlashbotsBundleProvider } = require('@flashbots/ethers-provider-bundle')
const { BigNumber } = require('ethers')
const { ethers } = require('hardhat')
require("dotenv").config({ path: ".env" });

async function main(){

    const _fakeNft = await ethers.getContractFactory("FakeNFT")
    const fakeNft = await _fakeNft.deploy()
    await fakeNft.deployed()

    console.log("FakeNFT address: ",fakeNft.address)

    const provider = new ethers.providers.WebSocketProvider(
        process.env.QUICKNODE_WS_URL,
        'goerli'
    )

    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

    // Creating a Flashbots Provider which will forward the request to the relayer
    // Which will further send it to the flashbot miner
    const flashbotsProvider = await FlashbotsBundleProvider.create(
        provider,
        signer,
        "https://relay-goerli.flashbots.net",
        "goerli"
    )

    provider.on("block", async(blockNumber)=>{
        console.log("Block Number: ", blockNumber)

        const bundleResponse = await flashbotsProvider.sendBundle(
            [
                {
                    transaction: {
                        chainId: 5,
                        type: 2,
                        value: ethers.utils.parseEther('0.01'),
                        to: fakeNft.address,
                        data: fakeNft.interface.getSighash("mint()"),
                        maxFeePerGas: BigNumber.from(10).pow(8).mul(3),
                        maxPriorityFeePerGas: BigNumber.from(10).pow(8).mul(2),
                    },
                    signer: signer
                },
            ],
            blockNumber + 1
        )

        if ("error" in bundleResponse) {
            console.log(bundleResponse.error.message);
          }
        });
    } 
main()