import { expect } from "chai";
import { ethers } from "hardhat";
import { LuckyTable } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

/**
 * LuckyTable Unit Tests
 * 
 * Note: Full FHE operations require Zama's coprocessor.
 * These tests verify contract structure and non-FHE logic.
 * For complete FHE testing, deploy to Sepolia testnet.
 */
describe("LuckyTable", function () {
  let luckyTable: LuckyTable;
  let owner: SignerWithAddress;
  let player: SignerWithAddress;

  beforeEach(async function () {
    [owner, player] = await ethers.getSigners();
    
    const LuckyTableFactory = await ethers.getContractFactory("LuckyTable");
    luckyTable = await LuckyTableFactory.deploy();
    await luckyTable.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should deploy successfully", async function () {
      const address = await luckyTable.getAddress();
      expect(address).to.be.properAddress;
    });

    it("should initialize totalDraws to 0", async function () {
      const totalDraws = await luckyTable.totalDraws();
      expect(totalDraws).to.equal(0n);
    });
  });

  describe("State Management", function () {
    it("should report no result for new player", async function () {
      const hasResult = await luckyTable.hasResult(player.address);
      expect(hasResult).to.be.false;
    });

    it("should revert getResult for player without result", async function () {
      await expect(
        luckyTable.connect(player).getResult()
      ).to.be.revertedWith("No result found");
    });

    it("should revert getResultHandle for player without result", async function () {
      await expect(
        luckyTable.connect(player).getResultHandle()
      ).to.be.revertedWith("No result found");
    });

    it("should return 0 timestamp for player without draw", async function () {
      const timestamp = await luckyTable.getDrawTimestamp(player.address);
      expect(timestamp).to.equal(0n);
    });
  });

  describe("Result Clearing", function () {
    it("should allow clearing non-existent result without error", async function () {
      // clearResult should work even if no result exists
      await luckyTable.connect(player).clearResult();
      const hasResult = await luckyTable.hasResult(player.address);
      expect(hasResult).to.be.false;
    });
  });

  describe("Contract Interface", function () {
    it("should have draw function with correct signature", async function () {
      // Verify the function exists and accepts correct parameter types
      const fragment = luckyTable.interface.getFunction("draw");
      expect(fragment).to.not.be.null;
      expect(fragment?.inputs.length).to.equal(2);
      expect(fragment?.inputs[0].type).to.equal("bytes32"); // externalEuint8
      expect(fragment?.inputs[1].type).to.equal("bytes");   // inputProof
    });

    it("should have getResultHandle function", async function () {
      const fragment = luckyTable.interface.getFunction("getResultHandle");
      expect(fragment).to.not.be.null;
      expect(fragment?.outputs?.[0].type).to.equal("bytes32");
    });

    it("should have hasResult function", async function () {
      const fragment = luckyTable.interface.getFunction("hasResult");
      expect(fragment).to.not.be.null;
      expect(fragment?.inputs[0].type).to.equal("address");
      expect(fragment?.outputs?.[0].type).to.equal("bool");
    });

    it("should have clearResult function", async function () {
      const fragment = luckyTable.interface.getFunction("clearResult");
      expect(fragment).to.not.be.null;
    });

    it("should have totalDraws function", async function () {
      const fragment = luckyTable.interface.getFunction("totalDraws");
      expect(fragment).to.not.be.null;
      expect(fragment?.outputs?.[0].type).to.equal("uint256");
    });
  });

  describe("Events", function () {
    it("should define DrawStarted event", async function () {
      const event = luckyTable.interface.getEvent("DrawStarted");
      expect(event).to.not.be.null;
      expect(event?.inputs.length).to.equal(2);
    });

    it("should define DrawCompleted event", async function () {
      const event = luckyTable.interface.getEvent("DrawCompleted");
      expect(event).to.not.be.null;
      expect(event?.inputs.length).to.equal(2);
    });
  });
});

