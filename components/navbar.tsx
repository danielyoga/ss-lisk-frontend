import { ConnectButton } from "@xellar/kit";
import React from "react";

export function Navbar() {
  return (
    <nav className="bg-orange-700 p-4 flex items-center justify-between absolute top-0 w-full">
      <h1 className="text-2xl font-semibold text-white">Lisk SS 6</h1>
      <ConnectButton />
    </nav>
  );
}
