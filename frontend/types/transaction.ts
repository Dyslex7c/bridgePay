export interface Transaction {
    _id?: string
    transactionId: string
    type: "one-to-one" | "one-to-many"
    senderAddress: string
    senderName?: string
    recipients: {
      name?: string
      address: string
      amount: number
      chain: string
      chainName: string
    }[]
    sourceChain: string
    sourceChainName: string
    totalAmount: number
    status: "pending" | "completed" | "failed"
    transactionHash?: string
    gasUsed?: number
    gasFee?: number
    createdAt: Date
    updatedAt: Date
    completedAt?: Date
  }
  
  export interface TransactionStats {
    totalTransactions: number
    totalVolume: number
    successfulTransactions: number
    pendingTransactions: number
    failedTransactions: number
    totalGasFees: number
    averageTransactionSize: number
    mostUsedChain: string
  }
  