import { ethers } from "ethers";
import { REKSADANA_ABI, MOCK_USDC_ABI, CONTRACT_ADDRESSES, NETWORK_CONFIG } from "./contracts";

// Get provider
export function getProvider() {
  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return new ethers.JsonRpcProvider(NETWORK_CONFIG.rpcUrl);
}

// Get signer
export async function getSigner() {
  const provider = getProvider();
  if (provider instanceof ethers.BrowserProvider) {
    return await provider.getSigner();
  }
  throw new Error("No wallet connected");
}

// Get Reksadana contract
export function getReksadanaContract() {
  const provider = getProvider();
  return new ethers.Contract(CONTRACT_ADDRESSES.REKSADANA, REKSADANA_ABI, provider);
}

// Get MockUSDC contract
export function getMockUSDCContract() {
  const provider = getProvider();
  return new ethers.Contract(CONTRACT_ADDRESSES.MOCK_USDC, MOCK_USDC_ABI, provider);
}

// Get Reksadana balance
export async function getReksadanaBalance(address: string): Promise<bigint> {
  try {
    const contract = getReksadanaContract();
    const balance = await contract.balanceOf(address);
    return balance;
  } catch (error) {
    console.error("Error getting Reksadana balance:", error);
    return BigInt(0);
  }
}

// Get USDC balance
export async function getUSDCBalance(address: string): Promise<bigint> {
  try {
    const contract = getMockUSDCContract();
    const balance = await contract.balanceOf(address);
    return balance;
  } catch (error) {
    console.error("Error getting USDC balance:", error);
    return BigInt(0);
  }
}

// Check if contract is deployed
export async function isContractDeployed(address: string): Promise<boolean> {
  try {
    const provider = new ethers.JsonRpcProvider(NETWORK_CONFIG.rpcUrl);
    const code = await provider.getCode(address);
    return code !== "0x";
  } catch (error) {
    console.error("Error checking contract deployment:", error);
    return false;
  }
}

// Deposit to Reksadana
export async function depositToReksadana(amount: bigint): Promise<boolean> {
  try {
    const signer = await getSigner();
    const reksadanaContract = new ethers.Contract(CONTRACT_ADDRESSES.REKSADANA, REKSADANA_ABI, signer);
    const usdcContract = new ethers.Contract(CONTRACT_ADDRESSES.MOCK_USDC, MOCK_USDC_ABI, signer);
    
    console.log("Approving USDC spending...");
    
    // First approve USDC spending
    const approveTx = await usdcContract.approve(CONTRACT_ADDRESSES.REKSADANA, amount);
    console.log("Approval transaction hash:", approveTx.hash);
    
    // Wait for approval to be mined
    await approveTx.wait();
    console.log("USDC approval confirmed");
    
    // Then deposit
    console.log("Depositing to Reksadana...");
    const depositTx = await reksadanaContract.deposit(amount);
    console.log("Deposit transaction hash:", depositTx.hash);
    
    await depositTx.wait();
    console.log("Deposit confirmed");
    
    return true;
  } catch (error: any) {
    console.error("Error depositing to Reksadana:", error);
    
    // Provide user-friendly error messages
    if (error.code === 4001) {
      throw new Error("Transaction was rejected. Please approve the transaction in MetaMask to continue.");
    } else if (error.message?.includes("insufficient funds")) {
      throw new Error("Insufficient funds for transaction. Please check your balance.");
    } else if (error.message?.includes("execution reverted")) {
      throw new Error("Transaction failed. Please check your input and try again.");
    } else {
      throw new Error(`Transaction failed: ${error.message || "Unknown error"}`);
    }
  }
}

// Withdraw from Reksadana
export async function withdrawFromReksadana(shares: bigint): Promise<boolean> {
  try {
    const signer = await getSigner();
    const reksadanaContract = new ethers.Contract(CONTRACT_ADDRESSES.REKSADANA, REKSADANA_ABI, signer);
    
    console.log("Withdrawing from Reksadana...");
    const withdrawTx = await reksadanaContract.withdraw(shares);
    console.log("Withdraw transaction hash:", withdrawTx.hash);
    
    await withdrawTx.wait();
    console.log("Withdrawal confirmed");
    
    return true;
  } catch (error: any) {
    console.error("Error withdrawing from Reksadana:", error);
    
    // Provide user-friendly error messages
    if (error.code === 4001) {
      throw new Error("Transaction was rejected. Please approve the transaction in MetaMask to continue.");
    } else if (error.message?.includes("insufficient funds")) {
      throw new Error("Insufficient funds for transaction. Please check your balance.");
    } else if (error.message?.includes("execution reverted")) {
      throw new Error("Transaction failed. Please check your input and try again.");
    } else {
      throw new Error(`Transaction failed: ${error.message || "Unknown error"}`);
    }
  }
}

// Mint USDC
export async function mintUSDC(amount: bigint): Promise<boolean> {
  try {
    const signer = await getSigner();
    const usdcContract = new ethers.Contract(CONTRACT_ADDRESSES.MOCK_USDC, MOCK_USDC_ABI, signer);
    
    console.log("Minting USDC...");
    const mintTx = await usdcContract.mint(await signer.getAddress(), amount);
    console.log("Mint transaction hash:", mintTx.hash);
    
    await mintTx.wait();
    console.log("USDC minted successfully");
    
    return true;
  } catch (error: any) {
    console.error("Error minting USDC:", error);
    
    // Provide user-friendly error messages
    if (error.code === 4001) {
      throw new Error("Transaction was rejected. Please approve the transaction in MetaMask to continue.");
    } else if (error.message?.includes("insufficient funds")) {
      throw new Error("Insufficient funds for transaction. Please check your balance.");
    } else if (error.message?.includes("execution reverted")) {
      throw new Error("Transaction failed. Please check your input and try again.");
    } else {
      throw new Error(`Transaction failed: ${error.message || "Unknown error"}`);
    }
  }
} 