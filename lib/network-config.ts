// Network configuration for MetaMask integration
export const ANVIL_NETWORK = {
  chainId: "0x7A69", // 31337 in hex
  chainName: "Local Anvil",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["http://localhost:8545"],
  blockExplorerUrls: [],
} as const;

// Function to add Anvil network to MetaMask
export async function addAnvilToMetaMask() {
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [ANVIL_NETWORK],
      });
      console.log("Anvil network added to MetaMask");
    } catch (error) {
      console.error("Error adding Anvil network:", error);
    }
  }
}

// Function to switch to Anvil network
export async function switchToAnvil() {
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ANVIL_NETWORK.chainId }],
      });
      console.log("Switched to Anvil network");
    } catch (error) {
      console.error("Error switching to Anvil network:", error);
      // If network doesn't exist, add it
      if ((error as any).code === 4902) {
        await addAnvilToMetaMask();
      }
    }
  }
} 