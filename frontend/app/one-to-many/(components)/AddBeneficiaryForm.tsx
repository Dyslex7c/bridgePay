"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, AlertCircle, Users, UserPlus } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import ChainSelector from "../../(components)/ChainSelector"
import type { Chain } from "wagmi/chains"
import type { Employee } from "@/types/employee"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddBeneficiaryFormProps {
  nickname: string
  setNickname: (nickname: string) => void
  beneficiaryAddress: string
  setBeneficiaryAddress: (address: string) => void
  usdcAmount: string
  setUsdcAmount: (amount: string) => void
  destinationChainSelector: string
  setDestinationChainSelector: (selector: string) => void
  onAddBeneficiary: () => void
  isConnected: boolean
  chains: readonly [Chain, ...Chain[]]
  chainId: number
  onChainSwitch: (chainId: number) => void
  errorMessage: string | null
  successMessage: string | null
  employees: Employee[]
  selectedEmployee: Employee | null
  setSelectedEmployee: (employee: Employee | null) => void
  onSelectEmployee: (employee: Employee) => void
  loadingEmployees: boolean
  onAddAllEmployees: () => void
  addingAllEmployees: boolean
}

export default function AddBeneficiaryForm({
  nickname,
  setNickname,
  beneficiaryAddress,
  setBeneficiaryAddress,
  usdcAmount,
  setUsdcAmount,
  destinationChainSelector,
  setDestinationChainSelector,
  onAddBeneficiary,
  isConnected,
  chains,
  chainId,
  onChainSwitch,
  errorMessage,
  successMessage,
  employees,
  selectedEmployee,
  setSelectedEmployee,
  onSelectEmployee,
  loadingEmployees,
  onAddAllEmployees,
  addingAllEmployees,
}: AddBeneficiaryFormProps) {
  const { isDark } = useTheme()
  const isFormValid = beneficiaryAddress && destinationChainSelector && usdcAmount && isConnected

  const totalEmployeeSalary = employees.reduce((sum, emp) => sum + emp.monthlySalary, 0)

  return (
    <>
      <Card
        className={`transition-all duration-500 ${isDark ? "bg-gradient-to-br from-black to-blue-700/20 border-black backdrop-blur-xl shadow-2xl" : "bg-gradient-to-br from-white to-blue-500/10 border-white backdrop-blur-xl shadow-2xl"}`}
      >
        <CardHeader className="pb-6">
          <CardTitle
            className={`flex items-center gap-3 text-2xl font-[Poppins] ${isDark ? "text-white" : "text-black"}`}
          >
            <div className={`p-2 rounded-xl ${isDark ? "bg-blue-500/40" : "bg-blue-300/60"}`}>
              <Plus className="w-6 h-6" />
            </div>
            Add Beneficiary
          </CardTitle>
          <CardDescription className={`text-sm font-[Inter] ${isDark ? "text-white/60" : "text-black/60"}`}>
            Configure recipient details for your batch payment
          </CardDescription>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 mt-4">
              <div className={`w-1 h-6 rounded-full ${isDark ? "bg-blue-400" : "bg-blue-600"}`} />
              <h3 className={`text-lg font-[Poppins] font-semibold ${isDark ? "text-white" : "text-black"}`}>
                Quick Select Employee
              </h3>
            </div>

            {loadingEmployees ? (
              <div className={`h-14 rounded-xl animate-pulse ${isDark ? "bg-white/5" : "bg-black/5"}`} />
            ) : employees.length > 0 ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Select
                      onValueChange={(value) => {
                        if (value === "none") {
                          setSelectedEmployee(null)
                        } else {
                          const employee = employees.find((emp) => emp._id === value)
                          if (employee) {
                            setSelectedEmployee(employee)
                            onSelectEmployee(employee)
                          }
                        }
                      }}
                    >
                      <SelectTrigger
                        className={`h-14 text-lg font-[Inter] transition-all duration-300 ${isDark ? "bg-white/5 border-white/20 text-white focus:border-white/40" : "bg-white border-black/10 text-black focus:border-black/30"}`}
                      >
                        <SelectValue placeholder="Select an employee to auto-fill details..." />
                      </SelectTrigger>
                      <SelectContent className={`${isDark ? "bg-black border-white/20" : "bg-white border-black/10"}`}>
                        <SelectItem
                          value="none"
                          className={`${isDark ? "text-white hover:bg-white/10" : "text-black hover:bg-black/5"}`}
                        >
                          Manual Entry
                        </SelectItem>
                        {employees.map((employee) => (
                          <SelectItem
                            key={employee._id}
                            value={employee._id!}
                            className={`${isDark ? "text-white hover:bg-white/10" : "text-black hover:bg-black/5"}`}
                          >
                            <div className="flex items-center gap-3 py-1">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isDark ? "bg-blue-500/20 text-blue-300" : "bg-blue-500/20 text-blue-700"}`}
                              >
                                {employee.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium">{employee.name}</span>
                                <span className={`text-xs ${isDark ? "text-white/60" : "text-black/60"}`}>
                                  ${employee.monthlySalary} USDC/month
                                </span>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={onAddAllEmployees}
                    disabled={!isConnected || addingAllEmployees || employees.length === 0}
                    className={`h-14 px-6 font-[Poppins] font-semibold transition-all duration-300 hover:scale-[1.02] ${isDark ? "bg-gradient-to-r from-blue-800 to-indigo-800 text-white disabled:from-green-600/30 disabled:to-emerald-600/30" : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white disabled:from-green-600/30 disabled:to-emerald-600/30"} shadow-xl`}
                  >
                    {addingAllEmployees ? (
                      <>
                        <div className="w-5 h-5 mr-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Users className="w-5 h-5 mr-3" />
                        Add All ({employees.length})
                      </>
                    )}
                  </Button>
                </div>

                <div
                  className={`p-4 rounded-xl border ${isDark ? "bg-indigo-500/10 border-indigo-500/20" : "bg-sky-500/10 border-sky-500/20"}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${isDark ? "bg-blue-500/20" : "bg-sky-500/20"}`}>
                      <UserPlus className={`w-5 h-5 ${isDark ? "text-blue-300" : "text-sky-700"}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold font-[Inter] mb-1 ${isDark ? "text-blue-200" : "text-sky-800"}`}>
                        Bulk Add All Employees
                      </h4>
                      <p className={`text-sm mb-2 ${isDark ? "text-blue-400" : "text-sky-700/80"}`}>
                        Add all {employees.length} employees to the batch with their monthly salaries
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className={`${isDark ? "text-blue-400" : "text-sky-700"}`}>
                          <strong>Total Amount:</strong> ${totalEmployeeSalary.toLocaleString()} USDC
                        </span>
                        <span className={`${isDark ? "text-blue-400" : "text-sky-700"}`}>
                          <strong>Employees:</strong> {employees.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedEmployee && (
                  <div
                    className={`p-4 rounded-xl border ${isDark ? "bg-blue-500/10 border-blue-500/20" : "bg-blue-500/10 border-blue-500/20"}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${isDark ? "bg-blue-500/30 text-blue-200" : "bg-blue-500/30 text-blue-800"}`}
                      >
                        {selectedEmployee.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className={`font-semibold font-[Inter] ${isDark ? "text-blue-200" : "text-blue-800"}`}>
                          {selectedEmployee.name}
                        </p>
                        <p className={`text-sm ${isDark ? "text-blue-300/80" : "text-blue-700/80"}`}>
                          Auto-filled from employee database
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`p-4 rounded-xl border ${isDark ? "bg-yellow-500/10 border-yellow-500/20" : "bg-yellow-500/10 border-yellow-500/20"}`}
              >
                <p className={`text-sm font-[Inter] ${isDark ? "text-yellow-200" : "text-yellow-800"}`}>
                  No employees found. Add employees first to use quick select.
                </p>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={`text-sm font-[Inter] ${isDark ? "text-white" : "text-black"}`}>
                Nickname (Optional)
              </label>
              <Input
                placeholder="e.g., John Doe (optional)"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className={`h-14 text-lg font-[Inter] transition-all duration-300 focus:scale-[1.02] ${isDark ? "bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-white/40" : "bg-white border-black/10 text-black placeholder:text-black/50 focus:border-black/30"}`}
              />
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-[Inter] ${isDark ? "text-white" : "text-black"}`}>Amount (USDC)</label>
              <div className="relative">
                <Input
                  placeholder="0.00"
                  type="number"
                  value={usdcAmount}
                  onChange={(e) => setUsdcAmount(e.target.value)}
                  className={`h-14 text-lg font-[Inter] pr-20 transition-all duration-300 focus:scale-[1.02] ${isDark ? "bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-white/40" : "bg-white border-black/10 text-black placeholder:text-black/50 focus:border-black/30"}`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                  <img
                    src="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png"
                    alt="USDC"
                    className="w-6 h-6"
                  />
                  <span className={`text-lg font-semibold font-[Inter] ${isDark ? "text-white/70" : "text-black/70"}`}>
                    USDC
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-[Inter] ${isDark ? "text-white" : "text-black"}`}>Recipient Address</label>
            <Input
              placeholder="0x..."
              value={beneficiaryAddress}
              onChange={(e) => setBeneficiaryAddress(e.target.value)}
              className={`h-14 text-lg font-[Inter] transition-all duration-300 focus:scale-[1.02] ${isDark ? "bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-white/40" : "bg-white border-black/10 text-black placeholder:text-black/50 focus:border-black/30"}`}
            />
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-[Inter] ${isDark ? "text-white" : "text-black"}`}>Destination Chain</label>
            <ChainSelector
              chains={chains}
              chainId={chainId}
              destinationChainSelector={destinationChainSelector}
              setDestinationChainSelector={setDestinationChainSelector}
              isConnected={isConnected}
              onChainSwitch={onChainSwitch}
            />
          </div>

          <Button
            onClick={onAddBeneficiary}
            disabled={!isFormValid}
            className={`w-full h-16 text-lg font-[Poppins] transition-all duration-300 hover:scale-[1.02] ${isDark ? "bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-white disabled:from-white/20 disabled:to-white/20 disabled:text-white/50" : "bg-gradient-to-r from-black to-gray-900 text-white hover:from-gray-900 hover:to-black disabled:from-black/20 disabled:to-black/20 disabled:text-black/50"} shadow-xl`}
          >
            <Plus className="w-5 h-5 mr-3" />
            Add to Batch
          </Button>

          {!isConnected && (
            <Alert
              className={`${isDark ? "border-yellow-500/20 bg-yellow-500/10" : "border-yellow-600/20 bg-yellow-600/10"}`}
            >
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <AlertDescription className={`font-[Inter] ${isDark ? "text-yellow-200" : "text-yellow-800"}`}>
                Please connect your wallet to add beneficiaries
              </AlertDescription>
            </Alert>
          )}

          {errorMessage && (
            <Alert className={`${isDark ? "border-red-500/20 bg-red-500/10" : "border-red-600/20 bg-red-600/10"}`}>
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className={`font-[Inter] font-medium pt-1 ${isDark ? "text-red-500" : "text-red-600"}`}>
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}
          {successMessage && (
            <Alert className={`${isDark ? "border-green-500/20 bg-green-500/10" : "border-green-600/20 bg-green-600/10"}`}>
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className={`font-[Inter] font-medium pt-1 ${isDark ? "text-green-500" : "text-green-600"}`}>
                {successMessage}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </>
  )
}
