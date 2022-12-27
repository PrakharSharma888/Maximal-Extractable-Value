const { FlashbotsBundleProvider } = require('@flashbots/ethers-provider-bundle')
const { BigNumber } = require('ethers')
const { ethers } = require('hardhat')
require("dotenv").config({ path: ".env" });

async function main(){

    const _fakeNft = await ethers.getContractFactory("FakeNFT")
    const fakeNft = await _fakeNft.deploy()
    await _fakeNft.deployed()

    console.log("FakeNFT address: ",_fakeNft.address)

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

    

}