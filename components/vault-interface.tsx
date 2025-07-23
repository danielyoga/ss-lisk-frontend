import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VaultTabs } from "./vault-tabs";

export function VaultInterface() {
  return (
    <Card className="w-full max-w-md py-0 gap-0 px-0">
      <CardHeader className="bg-orange-700 rounded-t-xl py-6">
        <CardTitle className="text-white">Vault Balance</CardTitle>
        <CardDescription className="text-2xl font-bold text-white">
          9.90 <span className="text-sm font-normal">vMUSDC</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 border-none">
        <VaultTabs />
      </CardContent>
    </Card>
  );
}
