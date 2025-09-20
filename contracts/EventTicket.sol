// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title EventTicket
 * @dev NFT contract for event tickets with minting vouchers and verification
 */
contract EventTicket is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using ECDSA for bytes32;

    Counters.Counter private _tokenIdCounter;

    // Ticket information
    struct TicketInfo {
        uint256 eventId;
        string seat;
        uint256 mintedAt;
        bool isValid;
        bool isUsed;
    }

    // Event information
    struct EventInfo {
        string name;
        uint256 date;
        string venue;
        uint256 price;
        uint256 maxSupply;
        uint256 currentSupply;
        bool isActive;
    }

    // Mappings
    mapping(uint256 => TicketInfo) public tickets;
    mapping(uint256 => EventInfo) public events;
    mapping(bytes32 => bool) public usedVouchers;
    mapping(address => bool) public authorizedMinters;

    // Events
    event TicketMinted(
        uint256 indexed tokenId,
        address indexed to,
        uint256 indexed eventId,
        string seat
    );
    event EventCreated(
        uint256 indexed eventId,
        string name,
        uint256 date,
        uint256 price
    );
    event TicketVerified(uint256 indexed tokenId, address indexed verifier);
    event TicketUsed(uint256 indexed tokenId, address indexed user);

    // Custom errors
    error EventNotFound();
    error EventNotActive();
    error EventSoldOut();
    error InsufficientPayment();
    error TicketNotFound();
    error TicketAlreadyUsed();
    error TicketNotValid();
    error VoucherAlreadyUsed();
    error InvalidSignature();
    error NotAuthorized();

    constructor() ERC721("EventTicket", "ETKT") {}

    /**
     * @dev Create a new event
     */
    function createEvent(
        uint256 eventId,
        string memory name,
        uint256 date,
        string memory venue,
        uint256 price,
        uint256 maxSupply
    ) external onlyOwner {
        events[eventId] = EventInfo({
            name: name,
            date: date,
            venue: venue,
            price: price,
            maxSupply: maxSupply,
            currentSupply: 0,
            isActive: true
        });

        emit EventCreated(eventId, name, date, price);
    }

    /**
     * @dev Set event active status
     */
    function setEventActive(uint256 eventId, bool isActive) external onlyOwner {
        if (events[eventId].maxSupply == 0) revert EventNotFound();
        events[eventId].isActive = isActive;
    }

    /**
     * @dev Add authorized minter (backend server)
     */
    function addAuthorizedMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
    }

    /**
     * @dev Remove authorized minter
     */
    function removeAuthorizedMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
    }

    /**
     * @dev Mint ticket with voucher (server-signed)
     */
    function mintWithVoucher(
        address to,
        uint256 eventId,
        string memory seat,
        string memory metadataURI,
        bytes32 voucherHash,
        bytes memory signature
    ) external payable nonReentrant {
        // Check if voucher was already used
        if (usedVouchers[voucherHash]) revert VoucherAlreadyUsed();

        // Verify signature
        bytes32 messageHash = keccak256(
            abi.encodePacked(to, eventId, seat, metadataURI, voucherHash)
        );
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        address signer = ethSignedMessageHash.recover(signature);
        
        if (!authorizedMinters[signer]) revert InvalidSignature();

        // Check event exists and is active
        EventInfo storage eventInfo = events[eventId];
        if (eventInfo.maxSupply == 0) revert EventNotFound();
        if (!eventInfo.isActive) revert EventNotActive();
        if (eventInfo.currentSupply >= eventInfo.maxSupply) revert EventSoldOut();

        // Check payment
        if (msg.value < eventInfo.price) revert InsufficientPayment();

        // Mark voucher as used
        usedVouchers[voucherHash] = true;

        // Mint ticket
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);

        // Store ticket info
        tickets[tokenId] = TicketInfo({
            eventId: eventId,
            seat: seat,
            mintedAt: block.timestamp,
            isValid: true,
            isUsed: false
        });

        // Update event supply
        eventInfo.currentSupply++;

        // Refund excess payment
        if (msg.value > eventInfo.price) {
            payable(msg.sender).transfer(msg.value - eventInfo.price);
        }

        emit TicketMinted(tokenId, to, eventId, seat);
    }

    /**
     * @dev Direct mint by authorized minter (for backend integration)
     */
    function mintTicket(
        address to,
        uint256 eventId,
        string memory seat,
        string memory metadataURI
    ) external returns (uint256) {
        if (!authorizedMinters[msg.sender] && msg.sender != owner()) {
            revert NotAuthorized();
        }

        // Check event exists and is active
        EventInfo storage eventInfo = events[eventId];
        if (eventInfo.maxSupply == 0) revert EventNotFound();
        if (!eventInfo.isActive) revert EventNotActive();
        if (eventInfo.currentSupply >= eventInfo.maxSupply) revert EventSoldOut();

        // Mint ticket
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);

        // Store ticket info
        tickets[tokenId] = TicketInfo({
            eventId: eventId,
            seat: seat,
            mintedAt: block.timestamp,
            isValid: true,
            isUsed: false
        });

        // Update event supply
        eventInfo.currentSupply++;

        emit TicketMinted(tokenId, to, eventId, seat);
        return tokenId;
    }

    /**
     * @dev Verify ticket validity
     */
    function isValid(uint256 tokenId) external view returns (bool) {
        if (!_exists(tokenId)) return false;
        TicketInfo memory ticket = tickets[tokenId];
        return ticket.isValid && !ticket.isUsed;
    }

    /**
     * @dev Mark ticket as used (for event entry)
     */
    function useTicket(uint256 tokenId) external {
        if (!_exists(tokenId)) revert TicketNotFound();
        
        TicketInfo storage ticket = tickets[tokenId];
        if (!ticket.isValid) revert TicketNotValid();
        if (ticket.isUsed) revert TicketAlreadyUsed();

        // Only owner or authorized minters can mark as used
        if (ownerOf(tokenId) != msg.sender && !authorizedMinters[msg.sender] && msg.sender != owner()) {
            revert NotAuthorized();
        }

        ticket.isUsed = true;
        emit TicketUsed(tokenId, msg.sender);
    }

    /**
     * @dev Verify ticket (for entry scanning)
     */
    function verifyTicket(uint256 tokenId) external {
        if (!_exists(tokenId)) revert TicketNotFound();
        
        TicketInfo memory ticket = tickets[tokenId];
        if (!ticket.isValid) revert TicketNotValid();
        if (ticket.isUsed) revert TicketAlreadyUsed();

        emit TicketVerified(tokenId, msg.sender);
    }

    /**
     * @dev Get ticket information
     */
    function getTicketInfo(uint256 tokenId) external view returns (TicketInfo memory) {
        if (!_exists(tokenId)) revert TicketNotFound();
        return tickets[tokenId];
    }

    /**
     * @dev Get event information
     */
    function getEventInfo(uint256 eventId) external view returns (EventInfo memory) {
        if (events[eventId].maxSupply == 0) revert EventNotFound();
        return events[eventId];
    }

    /**
     * @dev Get total supply of tickets
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter.current();
    }

    /**
     * @dev Withdraw contract balance (only owner)
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    /**
     * @dev Emergency pause/unpause ticket validity
     */
    function setTicketValidity(uint256 tokenId, bool isValid) external onlyOwner {
        if (!_exists(tokenId)) revert TicketNotFound();
        tickets[tokenId].isValid = isValid;
    }

    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
