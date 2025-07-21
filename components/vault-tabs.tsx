import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function VaultTabs() {
  return (
    <Tabs defaultValue="deposit">
      <TabsList className="w-full rounded-none h-12 p-0 shadow-none border-none">
        <TabsTrigger
          value="deposit"
          className="rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-fuchsia-600"
        >
          Deposit
        </TabsTrigger>
        <TabsTrigger
          value="withdraw"
          className="rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-fuchsia-600"
        >
          Withdraw
        </TabsTrigger>
      </TabsList>
      <TabsContent value="deposit">
        <Card className="rounded-t-none gap-0 border-none shadow-none">
          <CardContent>
            <div className="space-y-3">
              <Label htmlFor="amount-deposit">Deposit Amount</Label>
              <Input
                id="amount-deposit"
                type="number"
                placeholder="Enter your amount..."
              />
            </div>
          </CardContent>
          <CardFooter className="mt-3">
            <Button
              size={"lg"}
              className="w-full bg-fuchsia-700 hover:bg-fuchsia-600"
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
              <Label htmlFor="amount-withdraw">Withdraw Amount</Label>
              <Input
                id="amount-withdraw"
                type="number"
                placeholder="Enter your amount..."
              />
            </div>
          </CardContent>
          <CardFooter className="mt-3">
            <Button
              size={"lg"}
              className="w-full bg-fuchsia-700 hover:bg-fuchsia-600"
            >
              Withdraw
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
