#!/usr/bin/env python3
"""
Setup script for the NFT Ticketing backend
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Run a shell command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e.stderr}")
        sys.exit(1)

def main():
    """Main setup function"""
    print("🚀 Setting up NFT Ticketing Backend")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists("backend"):
        print("❌ Backend directory not found. Please run this script from the project root.")
        sys.exit(1)
    
    # Change to backend directory
    os.chdir("backend")
    
    # Create virtual environment
    run_command("python -m venv venv", "Creating virtual environment")
    
    # Activate virtual environment and install dependencies
    if os.name == 'nt':  # Windows
        activate_cmd = "venv\\Scripts\\activate"
        pip_cmd = "venv\\Scripts\\pip"
    else:  # Unix/Linux/macOS
        activate_cmd = "source venv/bin/activate"
        pip_cmd = "venv/bin/pip"
    
    run_command(f"{pip_cmd} install --upgrade pip", "Upgrading pip")
    run_command(f"{pip_cmd} install -r requirements.txt", "Installing Python dependencies")
    
    # Create .env file if it doesn't exist
    if not os.path.exists(".env"):
        env_content = """# NFT Ticketing Backend Environment Variables
JWT_SECRET=your-super-secret-jwt-key-change-in-production
DATABASE_URL=sqlite:///nft_tickets.db
IPFS_API_KEY=your-ipfs-api-key
PINATA_API_KEY=your-pinata-api-key
PINATA_SECRET_KEY=your-pinata-secret-key
"""
        with open(".env", "w") as f:
            f.write(env_content)
        print("✅ Created .env file with default values")
    
    print("\n🎉 Backend setup completed successfully!")
    print("\nTo start the backend server:")
    print("1. cd backend")
    if os.name == 'nt':
        print("2. venv\\Scripts\\activate")
    else:
        print("2. source venv/bin/activate")
    print("3. python main.py")
    print("\nThe API will be available at http://localhost:8000")
    print("API documentation will be available at http://localhost:8000/docs")

if __name__ == "__main__":
    main()
