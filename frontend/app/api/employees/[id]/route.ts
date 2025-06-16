import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { UpdateEmployeeRequest } from "@/types/employee"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body: UpdateEmployeeRequest = await request.json()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid employee ID" }, { status: 400 })
    }

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

    const existingEmployee = await db.collection("employees").findOne({
      walletAddress: body.walletAddress,
      _id: { $ne: new ObjectId(id) },
    })
    if (existingEmployee) {
      return NextResponse.json({ error: "Another employee with this wallet address already exists" }, { status: 409 })
    }

    const updateData = {
      name: body.name,
      walletAddress: body.walletAddress,
      preferredChain: body.preferredChain,
      monthlySalary: body.monthlySalary,
      updatedAt: new Date(),
    }

    const result = await db.collection("employees").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Employee updated successfully",
      employee: { ...updateData, _id: id },
    })
  } catch (error) {
    console.error("Error updating employee:", error)
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid employee ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("bridgepay")

    const result = await db.collection("employees").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Employee deleted successfully" })
  } catch (error) {
    console.error("Error deleting employee:", error)
    return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 })
  }
}
