import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Transaction } from "@/types/transaction"

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("bridgepay")
    const collection = db.collection<Transaction>("transactions")

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const type = searchParams.get("type")
    const search = searchParams.get("search")

    // Build filter query
    const filter: any = {}
    if (status && status !== "all") filter.status = status
    if (type && type !== "all") filter.type = type
    if (search) {
      filter.$or = [
        { transactionId: { $regex: search, $options: "i" } },
        { senderAddress: { $regex: search, $options: "i" } },
        { senderName: { $regex: search, $options: "i" } },
        { "recipients.name": { $regex: search, $options: "i" } },
        { "recipients.address": { $regex: search, $options: "i" } },
      ]
    }

    const skip = (page - 1) * limit

    const [transactions, total] = await Promise.all([
      collection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(filter),
    ])

    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("bridgepay")
    const collection = db.collection<Transaction>("transactions")

    const transactionData = await request.json()

    const transaction: Transaction = {
      ...transactionData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(transaction)

    return NextResponse.json({
      success: true,
      transactionId: result.insertedId,
    })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}
