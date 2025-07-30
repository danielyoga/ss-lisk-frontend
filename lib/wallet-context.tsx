"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { connectWallet, getReksadanaBalance, getUSDCBalance, formatBalance, isContractDeployed } from './web3';
import { CONTRACT_ADDRESSES, NETWORK_CONFIG } from './contracts';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  reksadanaBalance: string;
  usdcBalance: string;
  contractsDeployed: {
    reksadana: boolean;
    usdc: boolean;
  };
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshBalances: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [reksadanaBalance, setReksadanaBalance] = useState<string>('0');
  const [usdcBalance, setUsdcBalance] = useState<string>('0');
  const [contractsDeployed, setContractsDeployed] = useState({
    reksadana: false,
    usdc: false,
  });

  const connect = async () => {
    console.log('Connect function called');
    try {
      console.log('Attempting to connect wallet...');
      const connectedAddress = await connectWallet();
      console.log('Wallet connected:', connectedAddress);
      setAddress(connectedAddress);
      
      // Check contract deployment status
      await checkContractDeployment();
      
      await refreshBalances();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert(`Failed to connect wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const disconnect = () => {
    console.log('Disconnect function called');
    setAddress(null);
    setReksadanaBalance('0');
    setUsdcBalance('0');
  };

  const checkContractDeployment = async () => {
    try {
      console.log('🔍 Checking contract deployment status...');
      console.log('Reksadana address:', CONTRACT_ADDRESSES.REKSADANA);
      console.log('USDC address:', CONTRACT_ADDRESSES.MOCK_USDC);
      
      // Check current network only if wallet is connected
      if (typeof window !== 'undefined' && window.ethereum && address) {
        try {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          console.log('Current chainId:', chainId);
          console.log('Expected chainId:', `0x${NETWORK_CONFIG.chainId.toString(16)}`);
          
          if (chainId !== `0x${NETWORK_CONFIG.chainId.toString(16)}`) {
            console.warn('⚠️ User is not on Lisk Sepolia network. Please switch to Lisk Sepolia.');
          }
        } catch (error) {
          console.error('Error checking chainId:', error);
        }
      }
      
      console.log('🔍 Checking Reksadana deployment...');
      const reksadanaDeployed = await isContractDeployed(CONTRACT_ADDRESSES.REKSADANA);
      console.log('🔍 Checking USDC deployment...');
      const usdcDeployed = await isContractDeployed(CONTRACT_ADDRESSES.MOCK_USDC);
      
      console.log('✅ Reksadana deployed:', reksadanaDeployed);
      console.log('✅ USDC deployed:', usdcDeployed);
      
      setContractsDeployed({
        reksadana: reksadanaDeployed,
        usdc: usdcDeployed,
      });

      if (!reksadanaDeployed || !usdcDeployed) {
        console.warn('⚠️ Some contracts are not deployed:', {
          reksadana: reksadanaDeployed,
          usdc: usdcDeployed,
        });
      } else {
        console.log('🎉 All contracts are deployed!');
      }
    } catch (error) {
      console.error('❌ Error checking contract deployment:', error);
    }
  };

  const refreshBalances = async () => {
    if (!address) return;
    
    try {
      console.log('Refreshing balances for address:', address);
      const reksadanaBal = await getReksadanaBalance(address);
      const usdcBal = await getUSDCBalance(address);
      
      console.log('Reksadana balance:', reksadanaBal.toString());
      console.log('USDC balance:', usdcBal.toString());
      
      setReksadanaBalance(formatBalance(reksadanaBal));
      setUsdcBalance(formatBalance(usdcBal));
    } catch (error) {
      console.error('Error refreshing balances:', error);
    }
  };

  useEffect(() => {
    // Check contract deployment on mount
    checkContractDeployment();
    
    // Check if wallet is already connected
    if (typeof window !== 'undefined' && window.ethereum) {
      console.log('Setting up wallet event listeners');
      
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        console.log('Accounts changed:', accounts);
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          refreshBalances();
        } else {
          disconnect();
        }
      });

      window.ethereum.on('chainChanged', () => {
        console.log('Chain changed, reloading page');
        window.location.reload();
      });
    }
  }, []);

  useEffect(() => {
    // Check contract deployment on mount, regardless of wallet connection
    checkContractDeployment();
    
    if (address) {
      refreshBalances();
    }
  }, [address]);

  const value: WalletContextType = {
    address,
    isConnected: !!address,
    reksadanaBalance,
    usdcBalance,
    contractsDeployed,
    connect,
    disconnect,
    refreshBalances,
  };

  console.log('Wallet context state:', { 
    address, 
    isConnected: !!address, 
    reksadanaBalance, 
    usdcBalance,
    contractsDeployed 
  });

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}; 