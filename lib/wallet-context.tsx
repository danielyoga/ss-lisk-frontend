"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getReksadanaBalance, getUSDCBalance, isContractDeployed } from "./web3";
import { switchToAnvil } from "./network-config";

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  reksadanaBalance: bigint;
  usdcBalance: bigint;
  contractsDeployed: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshConnectionStatus: () => Promise<void>;
  refreshBalances: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [reksadanaBalance, setReksadanaBalance] = useState<bigint>(BigInt(0));
  const [usdcBalance, setUsdcBalance] = useState<bigint>(BigInt(0));
  const [contractsDeployed, setContractsDeployed] = useState(false);

  const connectWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        // Switch to Anvil network
        await switchToAnvil();
        
        // Request accounts
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          await refreshBalances();
        }
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("MetaMask not found! Please install MetaMask.");
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setIsConnected(false);
    setReksadanaBalance(BigInt(0));
    setUsdcBalance(BigInt(0));
  };

  const refreshConnectionStatus = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          await refreshBalances();
        } else {
          setAddress(null);
          setIsConnected(false);
          setReksadanaBalance(BigInt(0));
          setUsdcBalance(BigInt(0));
        }
      } catch (error) {
        console.error("Error refreshing connection status:", error);
      }
    }
  };

  const refreshBalances = async () => {
    if (address) {
      try {
        const reksadanaBal = await getReksadanaBalance(address);
        const usdcBal = await getUSDCBalance(address);
        
        setReksadanaBalance(reksadanaBal);
        setUsdcBalance(usdcBal);
      } catch (error) {
        console.error("Error refreshing balances:", error);
      }
    }
  };

  const checkContractDeployment = async () => {
    try {
      const reksadanaDeployed = await isContractDeployed("0x8A791620dd6260079BF849Dc5567aDC3F2FdC318");
      const usdcDeployed = await isContractDeployed("0x5FbDB2315678afecb367f032d93F642f64180aa3");
      setContractsDeployed(reksadanaDeployed && usdcDeployed);
    } catch (error) {
      console.error("Error checking contract deployment:", error);
      setContractsDeployed(false);
    }
  };

  useEffect(() => {
    checkContractDeployment();
    
    if (typeof window !== "undefined" && window.ethereum) {
      // Check if already connected
      const checkConnection = async () => {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
            await refreshBalances();
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      };
      
      checkConnection();

      // Listen for account changes
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setAddress(null);
          setIsConnected(false);
          setReksadanaBalance(BigInt(0));
          setUsdcBalance(BigInt(0));
        } else {
          setAddress(accounts[0]);
          setIsConnected(true);
          refreshBalances();
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      refreshBalances();
    }
  }, [isConnected, address]);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        reksadanaBalance,
        usdcBalance,
        contractsDeployed,
        connectWallet,
        disconnectWallet,
        refreshConnectionStatus,
        refreshBalances,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
} 