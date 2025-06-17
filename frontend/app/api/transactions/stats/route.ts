import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Transaction, TransactionStats } from "@/types/transaction"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("bridgepay")
    const collection = db.collection<Transaction>("transactions")

    const [totalTransactions, totalVolumeResult, statusCounts, totalGasFeesResult, chainUsage] = await Promise.all([
      collection.countDocuments(),
      collection.aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }]).toArray(),
      collection.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]).toArray(),
      collection.aggregate([{ $group: { _id: null, total: { $sum: "$gasFee" } } }]).toArray(),
      collection
        .aggregate([
          { $unwind: "$recipients" },
          { $group: { _id: "$recipients.chainName", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 1 },
        ])
        .toArray(),
    ])

    const totalVolume = totalVolumeResult[0]?.total || 0
    const totalGasFees = totalGasFeesResult[0]?.total || 0

    const statusMap = statusCounts.reduce(
      (acc, item) => {
        acc[item._id] = item.count
        return acc
      },
      {} as Record<string, number>,
    )

    const stats: TransactionStats = {
      totalTransactions,
      totalVolume,
      successfulTransactions: statusMap.completed || 0,
      pendingTransactions: statusMap.pending || 0,
      failedTransactions: statusMap.failed || 0,
      totalGasFees,
      averageTransactionSize: totalTransactions > 0 ? totalVolume / totalTransactions : 0,
      mostUsedChain: chainUsage[0]?._id || "N/A",
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching transaction stats:", error)
    return NextResponse.json({ error: "Failed to fetch transaction stats" }, { status: 500 })
  }
}
