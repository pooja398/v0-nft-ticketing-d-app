const { ethers } = require("hardhat")

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS
  const minterAddress = process.env.MINTER_ADDRESS

  if (!contractAddress || !minterAddress) {
    console.error("Please set CONTRACT_ADDRESS and MINTER_ADDRESS environment variables")
    process.exit(1)
  }

  console.log("🔧 Setting up authorized minter...")
  console.log("Contract:", contractAddress)
  console.log("Minter:", minterAddress)

  const EventTicket = await ethers.getContractFactory("EventTicket")
  const eventTicket = EventTicket.attach(contractAddress)

  const tx = await eventTicket.addAuthorizedMinter(minterAddress)
  await tx.wait()

  console.log("✅ Authorized minter added successfully!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
