"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VaultTabs } from "./vault-tabs";
import { Address, formatUnits } from "viem";
import { contractAddress } from "@/lib/token-address";
import useBalance from "@/hooks/use-balance";

export function VaultInterface() {
  const { balanceUser } = useBalance({
    tokenAddress: contractAddress.SimpleVault as Address,
  });
  return (
    <Card className="w-full max-w-md py-0 gap-0 px-0">
      <CardHeader className="bg-orange-700 rounded-t-xl py-6">
        <CardTitle className="text-white">Vault Balance</CardTitle>
        <CardDescription className="text-2xl font-bold text-white">
          {parseFloat(formatUnits(BigInt(balanceUser ?? 0), 6)).toFixed(2)} <span className="text-xs font-normal">vUSDC</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 border-none">
        <VaultTabs />
      </CardContent>
    </Card>
  );
}
