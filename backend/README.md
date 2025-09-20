# NFT Ticketing Backend API

A FastAPI-based backend for the NFT Ticketing dApp providing authentication, event management, purchase processing, and ticket verification.

## Features

- **Nonce-based Authentication**: Secure wallet signature verification
- **Event Management**: CRUD operations for events
- **Purchase Processing**: Order creation and tracking
- **Ticket Verification**: Blockchain-based ticket validation
- **SQLite Database**: Lightweight database for development
- **CORS Support**: Cross-origin requests for frontend integration
- **API Documentation**: Auto-generated OpenAPI/Swagger docs

## Quick Start

### Using the Setup Script

\`\`\`bash
# From project root
python scripts/setup_backend.py
\`\`\`

### Manual Setup

\`\`\`bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Unix/Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
\`\`\`

The API will be available at:
- **API**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs
- **Alternative docs**: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `GET /auth/nonce?address={wallet_address}` - Get nonce for signature
- `POST /auth/verify` - Verify signature and get JWT token

### Events
- `GET /events` - List all events
- `GET /events/{event_id}` - Get specific event

### Purchases
- `POST /purchase` - Create purchase order (requires auth)
- `GET /orders` - Get user's orders (requires auth)

### Tickets
- `GET /tickets` - Get user's tickets (requires auth)
- `GET /verify/{token_id}` - Verify ticket (JSON response)
- `GET /verify/{token_id}/page` - Verify ticket (HTML page)

### Utility
- `GET /` - API info
- `GET /health` - Health check

## Environment Variables

Create a `.env` file in the backend directory:

\`\`\`env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
DATABASE_URL=sqlite:///nft_tickets.db
IPFS_API_KEY=your-ipfs-api-key
PINATA_API_KEY=your-pinata-api-key
PINATA_SECRET_KEY=your-pinata-secret-key
\`\`\`

## Database Schema

The API uses SQLite with the following tables:
- `users` - User authentication data
- `events` - Event information
- `orders` - Purchase orders
- `tickets` - Minted tickets
- `verification_logs` - Verification history

## Docker Deployment

\`\`\`bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t nft-ticketing-api .
docker run -p 8000:8000 nft-ticketing-api
\`\`\`

## Development

The API includes:
- Automatic database initialization
- Sample data seeding
- CORS configuration for frontend development
- Comprehensive error handling
- Request/response validation with Pydantic

## Security Features

- JWT-based authentication
- Nonce-based signature verification
- Input validation and sanitization
- CORS protection
- Rate limiting ready (can be added with slowapi)

## Testing

\`\`\`bash
# Install test dependencies
pip install pytest httpx

# Run tests (when test files are added)
pytest
\`\`\`

## Production Considerations

1. **Database**: Switch to PostgreSQL for production
2. **Security**: Use strong JWT secrets and HTTPS
3. **Monitoring**: Add logging and monitoring
4. **Caching**: Implement Redis for session management
5. **Rate Limiting**: Add rate limiting for API endpoints
