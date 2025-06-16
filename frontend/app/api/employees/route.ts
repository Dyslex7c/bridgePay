import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { CreateEmployeeRequest } from "@/types/employee"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("bridgepay")
    const employees = await db.collection("employees").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ employees })
  } catch (error) {
    console.error("Error fetching employees:", error)
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateEmployeeRequest = await request.json()

    if (!body.name || !body.walletAddress || !body.preferredChain || !body.monthlySalary) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(body.walletAddress)) {
      return NextResponse.json({ error: "Invalid wallet address format" }, { status: 400 })
    }

    if (body.monthlySalary <= 0) {
      return NextResponse.json({ error: "Monthly salary must be greater than 0" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("bridgepay")

    const existingEmployee = await db.collection("employees").findOne({ walletAddress: body.walletAddress })
    if (existingEmployee) {
      return NextResponse.json({ error: "Employee with this wallet address already exists" }, { status: 409 })
    }

    const employee = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("employees").insertOne(employee)

    return NextResponse.json(
      {
        employee: { ...employee, _id: result.insertedId },
        message: "Employee created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating employee:", error)
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 })
  }
}
