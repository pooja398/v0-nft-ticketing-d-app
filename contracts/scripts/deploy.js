const { ethers } = require("hardhat")
const fs = require("fs")
const path = require("path")
const hre = require("hardhat") // Declare hre variable

async function main() {
  console.log("🚀 Deploying NFT Ticketing Contracts...")
  console.log("=" * 50)

  // Get the deployer account
  const [deployer] = await ethers.getSigners()
  console.log("Deploying contracts with account:", deployer.address)
  console.log("Account balance:", (await deployer.getBalance()).toString())

  // Deploy EventTicket contract
  console.log("\n📝 Deploying EventTicket contract...")
  const EventTicket = await ethers.getContractFactory("EventTicket")
  const eventTicket = await EventTicket.deploy()
  await eventTicket.deployed()

  console.log("✅ EventTicket deployed to:", eventTicket.address)

  // Create sample events
  console.log("\n🎪 Creating sample events...")

  const events = [
    {
      id: 1,
      name: "Neon Dreams Festival",
      date: Math.floor(new Date("2024-03-15").getTime() / 1000),
      venue: "Cyber Arena",
      price: ethers.utils.parseEther("0.05"),
      maxSupply: 5000,
    },
    {
      id: 2,
      name: "Digital Art Expo",
      date: Math.floor(new Date("2024-03-22").getTime() / 1000),
      venue: "Meta Gallery",
      price: ethers.utils.parseEther("0.03"),
      maxSupply: 2000,
    },
    {
      id: 3,
      name: "Blockchain Summit",
      date: Math.floor(new Date("2024-04-01").getTime() / 1000),
      venue: "Tech Hub",
      price: ethers.utils.parseEther("0.08"),
      maxSupply: 3000,
    },
  ]

  for (const event of events) {
    const tx = await eventTicket.createEvent(
      event.id,
      event.name,
      event.date,
      event.venue,
      event.price,
      event.maxSupply,
    )
    await tx.wait()
    console.log(`✅ Created event: ${event.name}`)
  }

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    contracts: {
      EventTicket: {
        address: eventTicket.address,
        abi: EventTicket.interface.format("json"),
      },
    },
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
  }

  // Save to file
  const deploymentsDir = path.join(__dirname, "../deployments")
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true })
  }

  const deploymentFile = path.join(deploymentsDir, `${hre.network.name}.json`)
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2))

  // Save ABI for frontend
  const frontendDir = path.join(__dirname, "../../lib/contracts")
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true })
  }

  const abiFile = path.join(frontendDir, "EventTicket.json")
  fs.writeFileSync(
    abiFile,
    JSON.stringify(
      {
        address: eventTicket.address,
        abi: JSON.parse(EventTicket.interface.format("json")),
      },
      null,
      2,
    ),
  )

  console.log("\n📄 Deployment info saved to:", deploymentFile)
  console.log("📄 ABI saved to:", abiFile)

  console.log("\n🎉 Deployment completed successfully!")
  console.log("\nContract addresses:")
  console.log("EventTicket:", eventTicket.address)

  console.log("\nNext steps:")
  console.log("1. Update frontend with contract address")
  console.log("2. Add backend as authorized minter")
  console.log("3. Fund contract for gas if needed")

  // If on testnet, provide verification command
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\nTo verify on Etherscan:")
    console.log(`npx hardhat verify --network ${hre.network.name} ${eventTicket.address}`)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
