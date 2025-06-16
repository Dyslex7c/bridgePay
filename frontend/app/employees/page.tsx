"use client"

import { useState, useEffect, useRef } from "react"
import { useAccount, useChainId, useSwitchChain } from "wagmi"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Users, AlertCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Header from "@/components/header"
import Footer from "@/components/footer"
import EmployeeList from "./(components)/EmployeeList"
import EmployeeForm from "./(components)/EmployeeForm"
import DeleteConfirmDialog from "./(components)/DeleteConfirmDialog"
import type { Employee, CreateEmployeeRequest } from "@/types/employee"

export default function EmployeesPage() {
  const { isDark } = useTheme()
  const { chains, switchChain } = useSwitchChain()
  const chainId = useChainId()
  const { isConnected } = useAccount()

  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const hasFetchedRef = useRef(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      // Only show loading on initial fetch
      if (!hasFetchedRef.current) {
        setLoading(true)
      }
      const response = await fetch("/api/employees")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch employees")
      }

      setEmployees(data.employees)
      setError(null)
      hasFetchedRef.current = true
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Filter employees based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredEmployees(employees)
    } else {
      const filtered = employees.filter(
        (employee) =>
          employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredEmployees(filtered)
    }
  }, [employees, searchTerm])

  useEffect(() => {
    if (!hasFetchedRef.current) {
      fetchEmployees()
    }
  }, [])

  const handleChainSwitch = async (targetChainId: number) => {
    try {
      await switchChain({ chainId: targetChainId })
    } catch (err) {
      console.error("Failed to switch chain:", err)
    }
  }

  const handleCreateEmployee = async (employeeData: CreateEmployeeRequest) => {
    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create employee")
      }

      await fetchEmployees()
      setError(null)
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  const handleUpdateEmployee = async (employeeData: CreateEmployeeRequest) => {
    if (!editingEmployee?._id) return

    try {
      const response = await fetch(`/api/employees/${editingEmployee._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update employee")
      }

      await fetchEmployees()
      setError(null)
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  const handleDeleteEmployee = async () => {
    if (!deletingEmployee?._id) return

    try {
      const response = await fetch(`/api/employees/${deletingEmployee._id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete employee")
      }

      await fetchEmployees()
      setError(null)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const openCreateForm = () => {
    setEditingEmployee(null)
    setIsFormOpen(true)
  }

  const openEditForm = (employee: Employee) => {
    setEditingEmployee(employee)
    setIsFormOpen(true)
  }

  const openDeleteDialog = (employee: Employee) => {
    setDeletingEmployee(employee)
    setIsDeleteDialogOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingEmployee(null)
  }

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
    setDeletingEmployee(null)
  }

  return (
    <div className={`min-h-screen pt-20 pb-12 transition-colors duration-300 ${isDark ? "bg-black" : "bg-white"}`}>
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-48">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-6">
            <div
              className={`inline-block px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                isDark
                  ? "text-white/90 bg-gradient-to-r from-blue-800/50 to-teal-800/50 border border-white/20"
                  : "text-black/90 bg-gradient-to-r from-blue-200/50 to-purple-200/50 border border-black/20"
              } backdrop-blur-sm hover:scale-105`}
            >
              <Users className="inline w-4 h-4 mr-2" />
              Employee Management
            </div>

            <h1 className={`text-4xl lg:text-5xl font-bold leading-tight ${isDark ? "text-white" : "text-black"}`}>
              <span className="font-[Montserrat]">Manage Your</span>
              <br />
              <span
                className={`font-[Poppins] bg-gradient-to-r ${
                  isDark ? "from-blue-500 to-indigo-500" : "from-blue-600 to-indigo-600"
                } bg-clip-text text-transparent`}
              >
                Team Members
              </span>
            </h1>

            <p
              className={`text-lg max-w-3xl mx-auto leading-relaxed font-[Inter] ${
                isDark ? "text-white/70" : "text-black/70"
              }`}
            >
              Add, edit, and manage your employees for seamless cross-chain payroll operations.
            </p>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? "text-white/50" : "text-black/50"}`}
              />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`h-12 pl-12 font-[Inter] transition-all duration-300 ${
                  isDark
                    ? "bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                    : "bg-white border-black/10 text-black placeholder:text-black/50 focus:border-black/30"
                }`}
              />
            </div>

            <Button
              onClick={openCreateForm}
              className={`h-12 px-6 font-[Poppins] transition-all duration-300 hover:scale-105 ${
                isDark
                  ? "bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-white"
                  : "bg-gradient-to-r from-black to-gray-900 text-white hover:from-gray-900 hover:to-black"
              } shadow-xl`}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Employee
            </Button>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className={`${isDark ? "border-red-500/20 bg-red-500/10" : "border-red-600/20 bg-red-600/10"}`}>
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className={`font-[Inter] font-medium ${isDark ? "text-red-500" : "text-red-600"}`}>
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Employee Stats */}
          {!loading && employees.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className={`p-6 border transition-all duration-300 ${
                  isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className={`w-8 h-8 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                  <div>
                    <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-black"}`}>{employees.length}</p>
                    <p className={`text-sm ${isDark ? "text-white/60" : "text-black/60"}`}>Total Employees</p>
                  </div>
                </div>
              </div>

              <div
                className={`p-6 border transition-all duration-300 ${
                  isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">$</span>
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-black"}`}>
                      {new Intl.NumberFormat("en-US").format(
                        employees.reduce((sum, emp) => sum + emp.monthlySalary, 0),
                      )}
                    </p>
                    <p className={`text-sm ${isDark ? "text-white/60" : "text-black/60"}`}>Monthly Payroll (USDC)</p>
                  </div>
                </div>
              </div>

              <div
                className={`p-6 border transition-all duration-300 ${
                  isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">⛓️</span>
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-black"}`}>
                      {new Set(employees.map((emp) => emp.preferredChain)).size}
                    </p>
                    <p className={`text-sm ${isDark ? "text-white/60" : "text-black/60"}`}>Unique Chains</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Employee List */}
          <EmployeeList
            employees={filteredEmployees}
            onEdit={openEditForm}
            onDelete={openDeleteDialog}
            loading={loading}
          />
        </div>
      </div>

      {/* Employee Form Modal */}
      <EmployeeForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingEmployee ? handleUpdateEmployee : handleCreateEmployee}
        employee={editingEmployee}
        chains={chains}
        chainId={chainId}
        onChainSwitch={handleChainSwitch}
        isConnected={isConnected}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteEmployee}
        employee={deletingEmployee}
        loading={false}
      />

      <Footer />
    </div>
  )
}
