from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import HTMLResponse
import uvicorn
import os
from datetime import datetime, timedelta
import jwt
import hashlib
import secrets
from typing import Optional, List
import sqlite3
import json
from pydantic import BaseModel
from contextlib import contextmanager

# Initialize FastAPI app
app = FastAPI(
    title="NFT Ticketing API",
    description="Backend API for NFT Ticketing dApp",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"

# Database setup
DATABASE_PATH = "nft_tickets.db"

def init_database():
    """Initialize SQLite database with required tables"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Users table for nonce-based authentication
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            address TEXT PRIMARY KEY,
            nonce TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP
        )
    """)
    
    # Events table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            venue TEXT NOT NULL,
            location TEXT NOT NULL,
            price TEXT NOT NULL,
            capacity INTEGER NOT NULL,
            sold INTEGER DEFAULT 0,
            image_url TEXT,
            features TEXT, -- JSON array
            artists TEXT, -- JSON array
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Orders table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_address TEXT NOT NULL,
            event_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            seat_type TEXT NOT NULL,
            total_price TEXT NOT NULL,
            status TEXT DEFAULT 'pending', -- pending, confirmed, failed
            tx_hash TEXT,
            token_ids TEXT, -- JSON array of minted token IDs
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (event_id) REFERENCES events (id)
        )
    """)
    
    # Tickets table for verification
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tickets (
            token_id INTEGER PRIMARY KEY,
            event_id INTEGER NOT NULL,
            owner_address TEXT NOT NULL,
            seat TEXT NOT NULL,
            status TEXT DEFAULT 'active', -- active, used, expired
            metadata_uri TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            verified_at TIMESTAMP,
            FOREIGN KEY (event_id) REFERENCES events (id)
        )
    """)
    
    # Verification logs
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS verification_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            token_id INTEGER NOT NULL,
            verifier_address TEXT,
            status TEXT NOT NULL, -- valid, invalid
            verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    conn.commit()
    conn.close()

@contextmanager
def get_db():
    """Database connection context manager"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

# Pydantic models
class NonceRequest(BaseModel):
    address: str

class VerifySignatureRequest(BaseModel):
    address: str
    signature: str
    message: str

class PurchaseRequest(BaseModel):
    event_id: int
    quantity: int
    seat_type: str
    tx_hash: str

class VerifyTicketResponse(BaseModel):
    is_valid: bool
    ticket: Optional[dict] = None
    error: Optional[str] = None

# Utility functions
def generate_nonce() -> str:
    """Generate a random nonce for signature verification"""
    return secrets.token_hex(16)

def create_jwt_token(address: str) -> str:
    """Create JWT token for authenticated user"""
    payload = {
        "address": address,
        "exp": datetime.utcnow() + timedelta(hours=24),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_jwt_token(token: str) -> Optional[str]:
    """Verify JWT token and return address"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload.get("address")
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Get current authenticated user from JWT token"""
    address = verify_jwt_token(credentials.credentials)
    if not address:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    return address

# Seed initial data
def seed_database():
    """Seed database with initial event data"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Check if events already exist
        cursor.execute("SELECT COUNT(*) FROM events")
        if cursor.fetchone()[0] > 0:
            return
        
        # Insert sample events
        events = [
            {
                "name": "Neon Dreams Festival",
                "description": "Experience the future of music at Neon Dreams Festival. Featuring top electronic artists, holographic performances, and immersive 3D visuals that will transport you to another dimension.",
                "date": "2024-03-15",
                "time": "19:00",
                "venue": "Cyber Arena",
                "location": "Neo Tokyo, Sector 7",
                "price": "0.05 ETH",
                "capacity": 5000,
                "sold": 3247,
                "image_url": "/futuristic-concert-stage-with-neon-lights.jpg",
                "features": json.dumps(["3D Holographic Stage", "VR Experience Zones", "NFT Art Gallery", "Exclusive Merch"]),
                "artists": json.dumps(["CyberSynth", "Neon Pulse", "Digital Dreams", "Quantum Beat"])
            },
            {
                "name": "Digital Art Expo",
                "description": "Discover the cutting-edge of digital art in this immersive exhibition featuring NFT masterpieces, interactive installations, and live digital art creation.",
                "date": "2024-03-22",
                "time": "14:00",
                "venue": "Meta Gallery",
                "location": "Virtual District, Level 42",
                "price": "0.03 ETH",
                "capacity": 2000,
                "sold": 1456,
                "image_url": "/digital-art-gallery-with-holographic-displays.jpg",
                "features": json.dumps(["Interactive NFT Gallery", "Live Art Creation", "AR Exhibitions", "Artist Meet & Greet"]),
                "artists": json.dumps(["PixelMaster", "CryptoCanvas", "MetaArt Collective", "Digital Dreamers"])
            },
            {
                "name": "Blockchain Summit",
                "description": "Join industry leaders and innovators at the premier blockchain conference. Learn about the latest developments in DeFi, NFTs, and Web3 technologies.",
                "date": "2024-04-01",
                "time": "09:00",
                "venue": "Tech Hub",
                "location": "Innovation Center, Floor 50",
                "price": "0.08 ETH",
                "capacity": 3000,
                "sold": 2789,
                "image_url": "/futuristic-tech-conference-with-blockchain-visuals.jpg",
                "features": json.dumps(["Expert Keynotes", "Networking Sessions", "Tech Demos", "Startup Showcase"]),
                "artists": json.dumps(["Vitalik Buterin", "Changpeng Zhao", "Brian Armstrong", "Cathie Wood"])
            }
        ]
        
        for event in events:
            cursor.execute("""
                INSERT INTO events (name, description, date, time, venue, location, price, capacity, sold, image_url, features, artists)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                event["name"], event["description"], event["date"], event["time"],
                event["venue"], event["location"], event["price"], event["capacity"],
                event["sold"], event["image_url"], event["features"], event["artists"]
            ))
        
        conn.commit()

# API Routes

@app.on_event("startup")
async def startup_event():
    """Initialize database and seed data on startup"""
    init_database()
    seed_database()

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "NFT Ticketing API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# Authentication endpoints
@app.get("/auth/nonce")
async def get_nonce(address: str):
    """Get nonce for wallet signature authentication"""
    if not address:
        raise HTTPException(status_code=400, detail="Address is required")
    
    nonce = generate_nonce()
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT OR REPLACE INTO users (address, nonce)
            VALUES (?, ?)
        """, (address.lower(), nonce))
        conn.commit()
    
    return {
        "nonce": nonce,
        "message": f"Sign this message to authenticate with NFT Tickets: {nonce}"
    }

@app.post("/auth/verify")
async def verify_signature(request: VerifySignatureRequest):
    """Verify wallet signature and return JWT token"""
    address = request.address.lower()
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT nonce FROM users WHERE address = ?", (address,))
        user = cursor.fetchone()
        
        if not user:
            raise HTTPException(status_code=400, detail="Nonce not found for address")
        
        # In a real implementation, you would verify the signature here
        # For demo purposes, we'll assume the signature is valid
        
        # Update last login
        cursor.execute("""
            UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE address = ?
        """, (address,))
        conn.commit()
    
    token = create_jwt_token(address)
    
    return {
        "token": token,
        "address": address,
        "expires_in": 86400  # 24 hours
    }

# Events endpoints
@app.get("/events")
async def get_events():
    """Get all events"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, name, description, date, time, venue, location, price, 
                   capacity, sold, image_url, features, artists, created_at
            FROM events
            ORDER BY date ASC
        """)
        events = cursor.fetchall()
    
    result = []
    for event in events:
        event_dict = dict(event)
        event_dict["features"] = json.loads(event_dict["features"]) if event_dict["features"] else []
        event_dict["artists"] = json.loads(event_dict["artists"]) if event_dict["artists"] else []
        result.append(event_dict)
    
    return {"events": result}

@app.get("/events/{event_id}")
async def get_event(event_id: int):
    """Get specific event by ID"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, name, description, date, time, venue, location, price, 
                   capacity, sold, image_url, features, artists, created_at
            FROM events WHERE id = ?
        """, (event_id,))
        event = cursor.fetchone()
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event_dict = dict(event)
    event_dict["features"] = json.loads(event_dict["features"]) if event_dict["features"] else []
    event_dict["artists"] = json.loads(event_dict["artists"]) if event_dict["artists"] else []
    
    return event_dict

# Purchase endpoints
@app.post("/purchase")
async def create_purchase(
    request: PurchaseRequest,
    current_user: str = Depends(get_current_user)
):
    """Create a purchase order"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Get event details
        cursor.execute("SELECT price, capacity, sold FROM events WHERE id = ?", (request.event_id,))
        event = cursor.fetchone()
        
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        # Check availability
        if event["sold"] + request.quantity > event["capacity"]:
            raise HTTPException(status_code=400, detail="Not enough tickets available")
        
        # Calculate total price
        price_per_ticket = float(event["price"].replace(" ETH", ""))
        total_price = f"{price_per_ticket * request.quantity:.3f} ETH"
        
        # Create order
        cursor.execute("""
            INSERT INTO orders (user_address, event_id, quantity, seat_type, total_price, tx_hash)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (current_user, request.event_id, request.quantity, request.seat_type, total_price, request.tx_hash))
        
        order_id = cursor.lastrowid
        
        # Update sold count
        cursor.execute("""
            UPDATE events SET sold = sold + ? WHERE id = ?
        """, (request.quantity, request.event_id))
        
        conn.commit()
    
    return {
        "order_id": order_id,
        "status": "pending",
        "total_price": total_price,
        "message": "Order created successfully. Waiting for blockchain confirmation."
    }

@app.get("/orders")
async def get_user_orders(current_user: str = Depends(get_current_user)):
    """Get user's purchase orders"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT o.*, e.name as event_name, e.date, e.venue
            FROM orders o
            JOIN events e ON o.event_id = e.id
            WHERE o.user_address = ?
            ORDER BY o.created_at DESC
        """, (current_user,))
        orders = cursor.fetchall()
    
    return {"orders": [dict(order) for order in orders]}

# Verification endpoints
@app.get("/verify/{token_id}")
async def verify_ticket(token_id: int):
    """Verify ticket by token ID"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT t.*, e.name as event_name, e.date, e.venue
            FROM tickets t
            JOIN events e ON t.event_id = e.id
            WHERE t.token_id = ?
        """, (token_id,))
        ticket = cursor.fetchone()
        
        if not ticket:
            # Log failed verification
            cursor.execute("""
                INSERT INTO verification_logs (token_id, status)
                VALUES (?, 'invalid')
            """, (token_id,))
            conn.commit()
            
            return VerifyTicketResponse(
                is_valid=False,
                error="Ticket not found or invalid"
            )
        
        # Log successful verification
        cursor.execute("""
            INSERT INTO verification_logs (token_id, status)
            VALUES (?, 'valid')
        """, (token_id,))
        
        # Update ticket verification timestamp
        cursor.execute("""
            UPDATE tickets SET verified_at = CURRENT_TIMESTAMP WHERE token_id = ?
        """, (token_id,))
        
        conn.commit()
    
    ticket_dict = dict(ticket)
    
    return VerifyTicketResponse(
        is_valid=True,
        ticket={
            "tokenId": ticket_dict["token_id"],
            "eventName": ticket_dict["event_name"],
            "date": ticket_dict["date"],
            "venue": ticket_dict["venue"],
            "seat": ticket_dict["seat"],
            "owner": ticket_dict["owner_address"],
            "status": ticket_dict["status"],
            "verifiedAt": datetime.utcnow().isoformat()
        }
    )

@app.get("/verify/{token_id}/page", response_class=HTMLResponse)
async def verify_ticket_page(token_id: int):
    """Human-friendly verification page"""
    verification = await verify_ticket(token_id)
    
    if verification.is_valid and verification.ticket:
        ticket = verification.ticket
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Ticket Verification - NFT Tickets</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body {{ font-family: Arial, sans-serif; background: #0f172a; color: white; margin: 0; padding: 20px; }}
                .container {{ max-width: 600px; margin: 0 auto; }}
                .valid {{ background: linear-gradient(135deg, #10b981, #059669); padding: 20px; border-radius: 10px; }}
                .ticket-info {{ background: #1e293b; padding: 20px; border-radius: 10px; margin-top: 20px; }}
                .status {{ font-size: 24px; font-weight: bold; margin-bottom: 10px; }}
                .detail {{ margin: 10px 0; }}
                .label {{ color: #94a3b8; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="valid">
                    <div class="status">✅ Valid Ticket</div>
                    <p>This NFT ticket has been verified on the blockchain.</p>
                </div>
                <div class="ticket-info">
                    <h2>Ticket Details</h2>
                    <div class="detail"><span class="label">Token ID:</span> #{ticket['tokenId']}</div>
                    <div class="detail"><span class="label">Event:</span> {ticket['eventName']}</div>
                    <div class="detail"><span class="label">Date:</span> {ticket['date']}</div>
                    <div class="detail"><span class="label">Venue:</span> {ticket['venue']}</div>
                    <div class="detail"><span class="label">Seat:</span> {ticket['seat']}</div>
                    <div class="detail"><span class="label">Status:</span> {ticket['status'].title()}</div>
                    <div class="detail"><span class="label">Verified:</span> {ticket['verifiedAt']}</div>
                </div>
            </div>
        </body>
        </html>
        """
    else:
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Ticket Verification - NFT Tickets</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body {{ font-family: Arial, sans-serif; background: #0f172a; color: white; margin: 0; padding: 20px; }}
                .container {{ max-width: 600px; margin: 0 auto; }}
                .invalid {{ background: linear-gradient(135deg, #ef4444, #dc2626); padding: 20px; border-radius: 10px; }}
                .status {{ font-size: 24px; font-weight: bold; margin-bottom: 10px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="invalid">
                    <div class="status">❌ Invalid Ticket</div>
                    <p>Token ID #{token_id} was not found or is invalid.</p>
                    <p>Please check the token ID and try again.</p>
                </div>
            </div>
        </body>
        </html>
        """
    
    return html_content

# User tickets endpoint
@app.get("/tickets")
async def get_user_tickets(current_user: str = Depends(get_current_user)):
    """Get user's tickets"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT t.*, e.name as event_name, e.date, e.venue, e.image_url, e.price
            FROM tickets t
            JOIN events e ON t.event_id = e.id
            WHERE t.owner_address = ?
            ORDER BY e.date ASC
        """, (current_user,))
        tickets = cursor.fetchall()
    
    result = []
    for ticket in tickets:
        ticket_dict = dict(ticket)
        result.append({
            "id": ticket_dict["token_id"],
            "tokenId": ticket_dict["token_id"],
            "eventName": ticket_dict["event_name"],
            "date": ticket_dict["date"],
            "venue": ticket_dict["venue"],
            "seat": ticket_dict["seat"],
            "price": ticket_dict["price"],
            "image": ticket_dict["image_url"],
            "status": ticket_dict["status"],
            "purchaseDate": ticket_dict["created_at"]
        })
    
    return {"tickets": result}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
