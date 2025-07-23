import React, { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Address, formatUnits, parseUnits } from "viem";
import useBalance from "@/hooks/use-balance";
import { contractAddress } from "@/lib/token-address";
import { useDeposit } from "@/hooks/use-deposit";
import { useWithdraw } from "@/hooks/use-withdraw";
import { useMint } from "@/hooks/use-mint";

export function VaultTabs() {
  const [amountDeposit, setAmountDeposit] = useState<string>("");
  const [amountWithdraw, setAmountWithdraw] = useState<string>("");
  const [amountMint, setAmountMint] = useState<string>("");

  const { balanceUser } = useBalance({
    tokenAddress: contractAddress.MockUSDC as Address,
  });

  const {
    deposit,
    approve: approveDeposit,
    isLoading: isLoadingDeposit,
  } = useDeposit({
    spender: contractAddress.SimpleVault as Address,
    tokenAddress: contractAddress.MockUSDC as Address,
  });

  const {
    mint,
    isLoading: isLoadingMint
  } = useMint({
    tokenAddress: contractAddress.MockUSDC as Address,
  });

  const {
    withdraw,
    approve: approveWithdraw,
    isLoading: isLoadingWithdraw,
  } = useWithdraw({
    spender: contractAddress.SimpleVault as Address,
    tokenAddress: contractAddress.MockUSDC as Address,
  });

  const handleDeposit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      await approveDeposit({
        amount: parseUnits(amountDeposit, 6),
      });
      await deposit({
        amount: parseUnits(amountDeposit, 6),
      });
      setAmountDeposit("");
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleWithdraw = async (e: FormEvent) => {
    try {
      e.preventDefault();
      await approveWithdraw({
        amount: parseUnits(amountWithdraw, 6),
      });
      await withdraw({
        amount: parseUnits(amountWithdraw, 6),
      });
      setAmountWithdraw("");
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleMint = async (e: FormEvent) => {
    try {
      e.preventDefault();
      await mint({
        amount: parseUnits(amountMint, 6),
      });
      setAmountMint("");
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Tabs defaultValue="deposit">
      <TabsList className="w-full rounded-none h-12 p-0 shadow-none border-none">
        <TabsTrigger
          value="deposit"
          className="rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-orange-600"
        >
          Deposit
        </TabsTrigger>
        <TabsTrigger
          value="withdraw"
          className="rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-orange-600"
        >
          Withdraw
        </TabsTrigger>
        <TabsTrigger
          value="mint"
          className="rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-orange-600"
        >
          Mint
        </TabsTrigger>
      </TabsList>
      <TabsContent value="deposit">
        <Card className="rounded-t-none gap-0 border-none shadow-none">
          <form>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="amount-deposit">Deposit Amount</Label>
                  <span className="text-xs">
                    {parseFloat(
                      formatUnits(BigInt(balanceUser ?? 0), 6)
                    ).toFixed(2)}{" "}
                    MUSDC
                  </span>
                </div>
                <Input
                  id="amount-deposit"
                  type="text"
                  pattern="[0-9\s]"
                  value={Number(amountDeposit)}
                  placeholder="Enter your amount..."
                  onChange={(e) => setAmountDeposit(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="mt-3">
              <Button
                size={"lg"}
                className="w-full bg-orange-700 hover:bg-orange-600"
                onClick={handleDeposit}
                disabled={Number(amountDeposit) == 0}
              >
                {isLoadingDeposit ? "Loading" : "Deposit"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
      <TabsContent value="withdraw">
        <Card className="rounded-t-none gap-0 border-none shadow-none">
          <form>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="amount-withdraw">Withdraw Amount</Label>
                  <span className="text-xs">
                    {parseFloat(
                      formatUnits(BigInt(balanceUser ?? 0), 6)
                    ).toFixed(2)}{" "}
                    MUSDC
                  </span>
                </div>
                <Input
                  id="amount-withdraw"
                  type="text"
                  pattern="[0-9\s]"
                  value={Number(amountWithdraw)}
                  placeholder="Enter your amount..."
                  onChange={(e) => setAmountWithdraw(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="mt-3">
              <Button
                size={"lg"}
                className="w-full bg-orange-700 hover:bg-orange-600"
                onClick={handleWithdraw}
                disabled={Number(amountWithdraw) === 0 || isLoadingWithdraw}
              >
                {isLoadingWithdraw ? "Loading" : "Withdraw"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
      <TabsContent value="mint">
        <Card className="rounded-t-none gap-0 border-none shadow-none">
          <form>
            <CardContent>
              <div className="space-y-3">
                <Label htmlFor="amount-mint">Mint Amount</Label>
                <Input
                  id="amount-mint"
                  type="text"
                  pattern="[0-9\s]"
                  value={Number(amountMint)}
                  placeholder="Enter your amount..."
                  onChange={(e) => setAmountMint(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="mt-3">
              <Button
                size={"lg"}
                className="w-full bg-orange-700 hover:bg-orange-600"
                onClick={handleMint}
                disabled={Number(amountMint) == 0}
              >
                {isLoadingMint ? "Loading" : "Mint"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
