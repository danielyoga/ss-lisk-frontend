"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VaultTabs } from "./vault-tabs";
import { useWallet } from "@/lib/wallet-context";

export function VaultInterface() {
  const { 
    address, 
    isConnected, 
    reksadanaBalance, 
    usdcBalance, 
    contractsDeployed,
    connect, 
    disconnect 
  } = useWallet();

  const handleWalletAction = () => {
    console.log('Wallet button clicked, isConnected:', isConnected);
    if (isConnected) {
      console.log('Calling disconnect');
      disconnect();
    } else {
      console.log('Calling connect');
      connect();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Card className="w-full max-w-md py-0 gap-0 px-0">
        <CardHeader className="bg-orange-700 rounded-t-xl py-6">
          <CardTitle className="text-white">Vault Balance</CardTitle>
          <CardDescription className="text-2xl font-bold text-white">
            {isConnected ? reksadanaBalance : '0.00'} <span className="text-sm font-normal">RKS</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 border-none">
          <VaultTabs />
        </CardContent>
      </Card>
      
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="space-y-4">
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
                  <span className="text-sm">{usdcBalance} MUSDC</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Address:</span>
                  <span className="text-xs text-gray-500 font-mono">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </div>
                
                {/* Contract Deployment Status */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Reksadana Contract:</span>
                    <span className={`text-sm ${contractsDeployed.reksadana ? 'text-green-600' : 'text-red-600'}`}>
                      {contractsDeployed.reksadana ? 'Deployed' : 'Not Deployed'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">USDC Contract:</span>
                    <span className={`text-sm ${contractsDeployed.usdc ? 'text-green-600' : 'text-red-600'}`}>
                      {contractsDeployed.usdc ? 'Deployed' : 'Not Deployed'}
                    </span>
                  </div>
                </div>
                
                {(!contractsDeployed.reksadana || !contractsDeployed.usdc) && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-xs text-yellow-800">
                      ⚠️ Some contracts are not deployed. Please check the contract addresses or deploy them first.
                    </p>
                  </div>
                )}
              </>
            )}
            
            <Button
              onClick={handleWalletAction}
              className="w-full"
              variant={isConnected ? "outline" : "default"}
            >
              {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
