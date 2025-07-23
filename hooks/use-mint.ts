import { MusdcAbi } from "@/lib/abis/musdc.abi";
import { useEffect } from "react";
import { toast } from "sonner";
import { Address } from "viem";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

interface UserMintParams {
  tokenAddress: Address;
}

export function useMint({ tokenAddress }: UserMintParams) {
  const { address: userAddress } = useAccount();

  const {
    data: txHashMint,
    writeContractAsync: writeMint,
    isPending: isPendingMint,
    error: errorMint,
  } = useWriteContract();

  const {
    isLoading: isLoadingMint,
    isSuccess: isSuccessMint,
    error: receiptErrorMint,
  } = useWaitForTransactionReceipt({
    hash: txHashMint,
  });

  useEffect(() => {
    if (isSuccessMint && txHashMint) {
      toast.success("Mint successful!", {
        description: "You minted tokens",
        action: {
          label: "View on Explorer",
          onClick: () =>
            window.open(
              `https://sepolia-blockscout.lisk.com/tx/${txHashMint}`,
              "_blank"
            ),
        },
      });
    }
  }, [isSuccessMint, txHashMint]);

  const mint = async ({ amount }: { amount: bigint }) => {
    const toastId = "mint-toast";
    if (!userAddress) {
      toast.error("Wallet not connected");
    }
    if(amount < 0) {
        toast.error("Amount must be greater than zero!")
    }

    try {
      toast.loading("Minting Token", {
        id: toastId,
      });
      await writeMint({
        address: tokenAddress,
        abi: MusdcAbi,
        functionName: "mint",
        args: [userAddress as Address, amount],
      });
      toast.dismiss(toastId);
    } catch (error) {
      toast.dismiss(toastId);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occured";
      toast.error("Approval request failed", {
        description: errorMessage,
      });
    }
  };

  const isLoading = isPendingMint || isLoadingMint;
  const hasError = errorMint || receiptErrorMint;

  return {
    mint,
    isLoading,
    hasError,
  };
}
