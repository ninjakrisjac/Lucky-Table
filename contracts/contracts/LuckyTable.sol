// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import "encrypted-types/EncryptedTypes.sol";

/**
 * @title LuckyTable
 * @notice A privacy-preserving lottery game using FHE
 * @dev User picks 1 of 3 boxes, prize is hidden in one box with random tier
 *      The randomness comes from block.prevrandao which is determined AFTER user submits
 *      their encrypted choice, ensuring fairness.
 */
contract LuckyTable {
    
    struct DrawResult {
        euint8 result;      // 0 = no win, 1 = common, 2 = rare, 3 = legendary
        uint256 timestamp;
        bool exists;
    }
    
    mapping(address => DrawResult) private playerResults;
    
    uint256 public totalDraws;
    
    event DrawStarted(address indexed player, uint256 timestamp);
    event DrawCompleted(address indexed player, uint256 drawId);
    
    constructor() {
        // Initialize FHE coprocessor with Zama config
        FHE.setCoprocessor(ZamaConfig.getEthereumCoprocessorConfig());
    }
    
    /**
     * @notice Execute a draw with encrypted user choice
     * @param encChoice Encrypted choice (1, 2, or 3)
     * @param inputProof Proof for the encrypted input
     */
    function draw(externalEuint8 encChoice, bytes calldata inputProof) external {
        // Convert external encrypted input
        euint8 userChoice = FHE.fromExternal(encChoice, inputProof);
        
        // Generate random prize position (1, 2, or 3) using block.prevrandao
        // This is determined AFTER user submits, so it's fair
        uint8 prizePosition = uint8((block.prevrandao % 3) + 1);
        euint8 prizePos = FHE.asEuint8(prizePosition);
        
        // Generate random prize tier (1, 2, or 3)
        uint8 prizeTierValue = uint8(((block.prevrandao >> 8) % 3) + 1);
        euint8 prizeTier = FHE.asEuint8(prizeTierValue);
        
        // Compare user choice with prize position (encrypted comparison)
        // User's choice is encrypted, so no one knows if they won until decryption
        ebool won = FHE.eq(userChoice, prizePos);
        
        // Result: if won, return tier (1-3); if lost, return 0
        euint8 zero = FHE.asEuint8(0);
        euint8 result = FHE.select(won, prizeTier, zero);
        
        // Store result and grant permissions
        playerResults[msg.sender] = DrawResult({
            result: result,
            timestamp: block.timestamp,
            exists: true
        });
        
        // Allow contract to access the result
        FHE.allowThis(result);
        
        // Allow player to decrypt their result (user must sign to decrypt)
        FHE.allow(result, msg.sender);
        
        totalDraws++;
        
        emit DrawStarted(msg.sender, block.timestamp);
        emit DrawCompleted(msg.sender, totalDraws);
    }
    
    /**
     * @notice Get the encrypted result handle for decryption
     * @return The encrypted result (0 = no win, 1-3 = tier)
     */
    function getResult() external view returns (euint8) {
        require(playerResults[msg.sender].exists, "No result found");
        return playerResults[msg.sender].result;
    }
    
    /**
     * @notice Get result as bytes32 handle for frontend decryption
     * @return handle The bytes32 handle of encrypted result
     */
    function getResultHandle() external view returns (bytes32) {
        require(playerResults[msg.sender].exists, "No result found");
        return euint8.unwrap(playerResults[msg.sender].result);
    }
    
    /**
     * @notice Check if player has a pending result
     * @param player Address to check
     * @return Whether player has a result
     */
    function hasResult(address player) external view returns (bool) {
        return playerResults[player].exists;
    }
    
    /**
     * @notice Get draw timestamp for a player
     * @param player Address to check
     * @return Timestamp of the draw
     */
    function getDrawTimestamp(address player) external view returns (uint256) {
        return playerResults[player].timestamp;
    }
    
    /**
     * @notice Clear player's result (for playing again)
     */
    function clearResult() external {
        delete playerResults[msg.sender];
    }
}
