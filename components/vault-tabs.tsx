"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AmountType = {
  deposit: string;
  withdraw: string;
  mint: string;
};

type enumAmountType = "deposit" | "withdraw" | "mint";

export function VaultTabs() {
  const [amount, setAmount] = useState<AmountType>({
    deposit: "",
    withdraw: "",
    mint: "",
  });

  const handleAmountChange =
    (type: enumAmountType) => (e: React.ChangeEvent<HTMLInputElement>) => {
      let { value } = e.target;
      value = value.replace(/[^0-9]/g, "");
      setAmount((prev) => ({
        ...prev,
        [type]: value,
      }));
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
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="amount-deposit">Deposit Amount</Label>
                <span className="text-xs">0.0 MUSDC</span>
              </div>
              <Input
                id="amount-deposit"
                type="number"
                placeholder="Enter your amount..."
                value={amount.deposit}
                onChange={handleAmountChange("deposit")}
              />
            </div>
          </CardContent>
          <CardFooter className="mt-3">
            <Button
              size={"lg"}
              className="w-full bg-orange-700 hover:bg-orange-600"
            >
              Deposit
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="withdraw">
        <Card className="rounded-t-none gap-0 border-none shadow-none">
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="amount-withdraw">Withdraw Amount</Label>
                <span className="text-xs">0.0 MUSDC</span>
              </div>
              <Input
                id="amount-withdraw"
                type="number"
                placeholder="Enter your amount..."
                value={amount.withdraw}
                onChange={handleAmountChange("withdraw")}
              />
            </div>
          </CardContent>
          <CardFooter className="mt-3">
            <Button
              size={"lg"}
              className="w-full bg-orange-700 hover:bg-orange-600"
            >
              Withdraw
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="mint">
        <Card className="rounded-t-none gap-0 border-none shadow-none">
          <CardContent>
            <div className="space-y-3">
              <Label htmlFor="amount-mint">Mint Amount</Label>
              <Input
                id="amount-mint"
                placeholder="Enter your amount..."
                value={amount.mint}
                onChange={handleAmountChange("mint")}
              />
            </div>
          </CardContent>
          <CardFooter className="mt-3">
            <Button
              size={"lg"}
              className="w-full bg-orange-700 hover:bg-orange-600"
            >
              Mint
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
