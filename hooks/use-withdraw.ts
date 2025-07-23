import { VaultAbi } from "@/lib/abis/vault.abi";
import { contractAddress } from "@/lib/token-address";
import { toast } from "sonner";
import { Address, erc20Abi } from "viem";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useEffect } from "react";

interface UseDepositParams {
  spender: Address;
  tokenAddress: Address;
}

export function useWithdraw({
  spender,
  tokenAddress,
}: UseDepositParams) {
  const { address: userAddress } = useAccount();

  const {
    data: txHashWithdraw,
    writeContractAsync: writeWithdraw,
    isPending: isPendingWithdraw,
    error: errorwithdraw,
  } = useWriteContract();

  const {
    data: txHashApprove,
    writeContractAsync: writeApprove,
    isPending: isPendingApprove,
    error: errorApprove,
  } = useWriteContract();

  const {
    isLoading: isLoadingWithdraw,
    isSuccess: isSuccessWithdraw,
    error: receiptErrorWithdraw,
  } = useWaitForTransactionReceipt({
    hash: txHashWithdraw,
  });

  const {
    isLoading: isLoadingApprove,
    isSuccess: isSuccessApprove,
    error: receiptErrorApprove,
  } = useWaitForTransactionReceipt({
    hash: txHashApprove,
  });

  useEffect(() => {
    if (isSuccessWithdraw && txHashWithdraw) {
      toast.success("Withdraw successful!", {
        description: "Your tokens have been withdrawed to the vault.",
        action: {
          label: "View on Explorer",
          onClick: () =>
            window.open(`https://sepolia-blockscout.lisk.com/tx/${txHashWithdraw}`, "_blank"),
        },
      });
    }
  }, [isSuccessWithdraw, txHashWithdraw]);

  useEffect(() => {
    const approvalError = errorApprove || receiptErrorApprove;
    const withdrawError = errorwithdraw || receiptErrorWithdraw;

    if (approvalError) {
      const errorMessage = approvalError.message || "Approval failed";
      toast.error("Approval Failed", {
        description: errorMessage,
      });
    }

    if (withdrawError) {
      const errorMessage = withdrawError.message || "withdraw failed";
      toast.error("withdraw Failed", {
        description: errorMessage,
      });
    }
  }, [
    errorApprove,
    receiptErrorApprove,
    errorwithdraw,
    receiptErrorWithdraw,
  ]);

  const approve = async ({amount}: {amount: bigint}) => {
    const toastId = "approve-toast";
    if (!userAddress) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to continue.",
      });
      return;
    }

    if (amount <= BigInt(0)) {
      toast.error("Invalid amount", {
        description: "Please enter a valid amount greater than 0.",
      });
      return;
    }

    try {
      toast.loading("Request Approve", {
        id: toastId
      })
      await writeApprove({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "approve",
        args: [spender, amount],
      });
      toast.dismiss(toastId);
    } catch (error) {
      toast.dismiss(toastId);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error("Approval request failed", {
        description: errorMessage,
      });
      throw error;
    } finally {
      toast.dismiss(toastId)
    }
  };

  const withdraw = async ({amount}: {amount: bigint}) => {
    if (!userAddress) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to continue.",
      });
      return;
    }

    if (amount <= BigInt(0)) {
      toast.error("Invalid amount", {
        description: "Please enter a valid amount greater than 0.",
      });
      return;
    }

    if (!contractAddress.SimpleVault) {
      toast.error("Contract not found", {
        description: "Vault contract address is not configured.",
      });
      return;
    }

    try {
      toast.loading("Processing withdraw...", {
        id: "withdraw-loading",
      });

      await writeWithdraw({
        address: contractAddress.SimpleVault as Address,
        abi: VaultAbi,
        functionName: "withdraw",
        args: [amount, userAddress, userAddress],
      });

      toast.dismiss("withdraw-loading");
    } catch (error) {
      toast.dismiss("withdraw-loading");
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error("withdraw request failed", {
        description: errorMessage,
      });
      throw error;
    }
  };

  const isLoading =
    isPendingApprove ||
    isLoadingApprove ||
    isPendingWithdraw ||
    isLoadingWithdraw;
  const hasError = !!(
    errorApprove ||
    receiptErrorApprove ||
    errorwithdraw ||
    receiptErrorWithdraw
  );

  return {
    approve,
    withdraw,
    isLoading,
    isSuccessApprove,
    isSuccessWithdraw,
    hasError,
    txHashApprove,
    txHashWithdraw,
  };
}
