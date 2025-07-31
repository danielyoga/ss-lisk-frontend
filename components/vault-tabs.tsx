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
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab("deposit")}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === "deposit"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Deposit
        </button>
        <button
          onClick={() => setActiveTab("withdraw")}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === "withdraw"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Withdraw
        </button>
        <button
          onClick={() => setActiveTab("mint")}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === "mint"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <div className="flex flex-col">
            <span>Mint</span>
            <span>USDC</span>
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="px-6 pb-6">
        {activeTab === "deposit" && (
          <div className="space-y-6">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleDeposit}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Processing..." : "Deposit"}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "withdraw" && (
          <div className="space-y-6">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleWithdraw}
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Processing..." : "Withdraw"}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "mint" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Mint USDC</h3>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleMint}
                  disabled={loading}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Processing..." : "Mint USDC"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error and Success Messages */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 font-medium">Transaction Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            {error.includes("rejected") && (
              <p className="text-xs text-red-600 mt-2">
                💡 Tip: Make sure to approve the transaction in your MetaMask wallet when prompted.
              </p>
            )}
          </div>
        )}
        {success && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium">Success!</p>
            <p className="text-sm text-green-700 mt-1">{success}</p>
          </div>
        )}
      </div>
    </div>
  );
}
