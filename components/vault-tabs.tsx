"use client";

import { useState } from "react";
import { depositToReksadana, withdrawFromReksadana, mintUSDC } from "../lib/web3";
import { ethers } from "ethers";

export default function VaultTabs() {
  const [activeTab, setActiveTab] = useState("deposit");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const amount = ethers.parseUnits(depositAmount, 6); // USDC has 6 decimals
      await depositToReksadana(amount);
      setSuccess("Deposit successful!");
      setDepositAmount("");
    } catch (err: any) {
      setError(err.message || "Deposit failed");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const shares = ethers.parseUnits(withdrawAmount, 18); // RKS has 18 decimals
      await withdrawFromReksadana(shares);
      setSuccess("Withdrawal successful!");
      setWithdrawAmount("");
    } catch (err: any) {
      setError(err.message || "Withdrawal failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMint = async () => {
    if (!mintAmount || parseFloat(mintAmount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const amount = ethers.parseUnits(mintAmount, 6); // USDC has 6 decimals
      await mintUSDC(amount);
      setSuccess("USDC minted successfully!");
      setMintAmount("");
    } catch (err: any) {
      setError(err.message || "Minting failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("deposit")}
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === "deposit"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Deposit
        </button>
        <button
          onClick={() => setActiveTab("withdraw")}
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === "withdraw"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Withdraw
        </button>
        <button
          onClick={() => setActiveTab("mint")}
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === "mint"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Mint USDC
        </button>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Tab Content */}
      {activeTab === "deposit" && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Deposit USDC</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (USDC)
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
            <button
              onClick={handleDeposit}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Deposit"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "withdraw" && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Withdraw RKS</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (RKS)
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
            <button
              onClick={handleWithdraw}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Withdraw"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "mint" && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Mint USDC (Testnet)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (USDC)
              </label>
              <input
                type="number"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
            <button
              onClick={handleMint}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Mint USDC"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
