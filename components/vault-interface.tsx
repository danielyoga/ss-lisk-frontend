"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VaultTabs from "./vault-tabs";
import { useWallet } from "@/lib/wallet-context";

export default function VaultInterface() {
  const { 
    address, 
    isConnected, 
    reksadanaBalance, 
    usdcBalance, 
    contractsDeployed,
    connectWallet,
    disconnectWallet,
    refreshConnectionStatus
  } = useWallet();

  const formatBalance = (balance: bigint, decimals: number = 6) => {
    return (Number(balance) / Math.pow(10, decimals)).toFixed(2);
  };

  const handleWalletAction = async () => {
    console.log('Wallet button clicked, isConnected:', isConnected);
    if (isConnected) {
      console.log('Disconnecting wallet');
      disconnectWallet();
    } else {
      console.log('Calling connect');
      await connectWallet();
    }
  };

  const handleRefreshConnection = async () => {
    console.log('Refreshing connection status');
    await refreshConnectionStatus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-96 max-w-md space-y-6">
        <Card className="w-full py-0 gap-0 px-0">
          <CardHeader className="bg-orange-700 rounded-t-xl py-8">
            <CardTitle className="text-white text-xl">Vault Balance</CardTitle>
            <CardDescription className="text-3xl font-bold text-white mt-2">
              {isConnected ? formatBalance(reksadanaBalance, 18) : '0.00'} <span className="text-sm font-normal">RKS</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 border-none">
            <VaultTabs />
          </CardContent>
        </Card>
        
        <Card className="w-full">
          <CardContent className="pt-8 pb-6 px-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Wallet Status:</span>
                <span className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              
              {isConnected && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">USDC Balance:</span>
                    <span className="text-sm">{formatBalance(usdcBalance, 6)} USDC</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Address:</span>
                    <span className="text-xs text-gray-500 font-mono">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                  </div>
                  
                  {/* Contract Deployment Status */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Contracts Status:</span>
                      <span className={`text-sm ${contractsDeployed ? 'text-green-600' : 'text-red-600'}`}>
                        {contractsDeployed ? 'Deployed' : 'Not Deployed'}
                      </span>
                    </div>
                  </div>
                  
                  {!contractsDeployed && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-800">
                        ⚠️ Contracts are not deployed. Please check the contract addresses or deploy them first.
                      </p>
                    </div>
                  )}
                </>
              )}
              
              <Button
                onClick={handleWalletAction}
                className="w-full mt-6"
                variant={isConnected ? "outline" : "default"}
              >
                {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
              </Button>
              
              {isConnected && (
                <Button
                  onClick={handleRefreshConnection}
                  className="w-full mt-2"
                  variant="outline"
                  size="sm"
                >
                  Refresh Connection
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
