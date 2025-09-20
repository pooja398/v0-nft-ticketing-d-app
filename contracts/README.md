# NFT Ticketing Smart Contracts

Solidity smart contracts for the NFT Ticketing dApp built with Hardhat and OpenZeppelin.

## Features

- **ERC-721 NFT Tickets**: Each ticket is a unique NFT with metadata
- **Event Management**: Create and manage events with pricing and capacity
- **Voucher-based Minting**: Server-signed vouchers for secure minting
- **Ticket Verification**: On-chain verification of ticket validity
- **Access Control**: Authorized minters and owner-only functions
- **Gas Optimized**: Efficient contract design with minimal gas usage

## Quick Start

### Installation

\`\`\`bash
cd contracts
npm install
\`\`\`

### Environment Setup

\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

### Local Development

\`\`\`bash
# Start local Hardhat node
npm run node

# Deploy to local network (in another terminal)
npm run deploy:localhost
\`\`\`

### Testnet Deployment

\`\`\`bash
# Deploy to Sepolia testnet
npm run deploy:sepolia

# Verify contract on Etherscan
npm run verify:sepolia <CONTRACT_ADDRESS>
\`\`\`

## Contract Architecture

### EventTicket.sol

Main contract implementing:
- ERC-721 standard for NFT tickets
- Event creation and management
- Voucher-based minting system
- Ticket verification and usage tracking
- Access control for minters

### Key Functions

#### Event Management
- `createEvent()` - Create new events
- `setEventActive()` - Enable/disable events
- `getEventInfo()` - Get event details

#### Ticket Operations
- `mintTicket()` - Direct minting (authorized only)
- `mintWithVoucher()` - Voucher-based minting
- `isValid()` - Check ticket validity
- `verifyTicket()` - Verify ticket for entry
- `useTicket()` - Mark ticket as used

#### Access Control
- `addAuthorizedMinter()` - Add backend as minter
- `removeAuthorizedMinter()` - Remove minter access

## Deployment

The deployment script automatically:
1. Deploys the EventTicket contract
2. Creates sample events
3. Saves deployment info and ABI
4. Provides verification commands

### Post-Deployment Setup

1. **Add Backend as Minter**:
   \`\`\`bash
   CONTRACT_ADDRESS=<deployed_address> MINTER_ADDRESS=<backend_address> node scripts/setup-minter.js
   \`\`\`

2. **Update Frontend Configuration**:
   - Contract address is automatically saved to `lib/contracts/EventTicket.json`
   - Update `CONTRACT_CONFIG.addresses` in `contract-utils.ts`

## Testing

\`\`\`bash
# Run contract tests
npm test

# Run with gas reporting
REPORT_GAS=true npm test
\`\`\`

## Security Features

- **Reentrancy Protection**: ReentrancyGuard on payable functions
- **Access Control**: Owner and authorized minter restrictions
- **Signature Verification**: ECDSA signature validation for vouchers
- **Input Validation**: Comprehensive error handling
- **Overflow Protection**: SafeMath through Solidity 0.8+

## Gas Optimization

- Efficient storage layout
- Batch operations where possible
- Minimal external calls
- Optimized loops and conditionals

## Integration

### Frontend Integration
- Use `useContract()` hook for contract interactions
- Contract utilities in `lib/contracts/contract-utils.ts`
- Automatic ABI and address management

### Backend Integration
- Add backend address as authorized minter
- Use voucher system for secure minting
- Implement signature generation for vouchers

## Network Support

- **Local**: Hardhat network (chainId: 1337)
- **Testnet**: Sepolia (chainId: 11155111), Goerli (chainId: 5)
- **Mainnet**: Ethereum (chainId: 1)

## Troubleshooting

### Common Issues

1. **"Contract not deployed"**: Check network and contract address
2. **"Insufficient funds"**: Ensure wallet has enough ETH
3. **"Not authorized"**: Add address as authorized minter
4. **"Event sold out"**: Check event capacity and current supply

### Debug Commands

\`\`\`bash
# Check contract deployment
npx hardhat console --network <network>

# Verify contract on Etherscan
npx hardhat verify --network <network> <address>
\`\`\`
