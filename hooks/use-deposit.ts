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

export function useDeposit({
  spender,
  tokenAddress,
}: UseDepositParams) {
  const { address: userAddress } = useAccount();

  const {
    data: txHashDeposit,
    writeContractAsync: writeDeposit,
    isPending: isPendingDeposit,
    error: errorDeposit,
  } = useWriteContract();

  const {
    data: txHashApprove,
    writeContractAsync: writeApprove,
    isPending: isPendingApprove,
    error: errorApprove,
  } = useWriteContract();

  const {
    isLoading: isLoadingDeposit,
    isSuccess: isSuccessDeposit,
    error: receiptErrorDeposit,
  } = useWaitForTransactionReceipt({
    hash: txHashDeposit,
  });

  const {
    isLoading: isLoadingApprove,
    isSuccess: isSuccessApprove,
    error: receiptErrorApprove,
  } = useWaitForTransactionReceipt({
    hash: txHashApprove,
  });

  useEffect(() => {
    if (isSuccessDeposit && txHashDeposit) {
      toast.success("Deposit successful!", {
        description: "Your tokens have been deposited to the vault.",
        action: {
          label: "View on Explorer",
          onClick: () =>
            window.open(`https://sepolia-blockscout.lisk.com/tx/${txHashDeposit}`, "_blank"),
        },
      });
    }
  }, [isSuccessDeposit, txHashDeposit]);

  useEffect(() => {
    const approvalError = errorApprove || receiptErrorApprove;
    const depositError = errorDeposit || receiptErrorDeposit;

    if (approvalError) {
      const errorMessage = approvalError.message || "Approval failed";
      toast.error("Approval Failed", {
        description: errorMessage,
      });
    }

    if (depositError) {
      const errorMessage = depositError.message || "Deposit failed";
      toast.error("Deposit Failed", {
        description: errorMessage,
      });
    }
  }, [
    errorApprove,
    receiptErrorApprove,
    errorDeposit,
    receiptErrorDeposit,
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

  const deposit = async ({amount}: {amount: bigint}) => {
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
      toast.loading("Processing deposit...", {
        id: "deposit-loading",
      });

      await writeDeposit({
        address: contractAddress.SimpleVault as Address,
        abi: VaultAbi,
        functionName: "deposit",
        args: [amount, userAddress],
      });

      toast.dismiss("deposit-loading");
    } catch (error) {
      toast.dismiss("deposit-loading");
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error("Deposit request failed", {
        description: errorMessage,
      });
      throw error;
    }
  };

  const isLoading =
    isPendingApprove ||
    isLoadingApprove ||
    isPendingDeposit ||
    isLoadingDeposit;
  const hasError = !!(
    errorApprove ||
    receiptErrorApprove ||
    errorDeposit ||
    receiptErrorDeposit
  );

  return {
    approve,
    deposit,
    isLoading,
    hasError,
    txHashApprove,
    txHashDeposit,
  };
}
