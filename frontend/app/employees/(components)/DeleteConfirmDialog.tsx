"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Loader2 } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import type { Employee } from "@/types/employee"

interface DeleteConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  employee: Employee | null
  loading: boolean
}

export default function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  employee,
  loading,
}: DeleteConfirmDialogProps) {
  const { isDark } = useTheme()

  const handleConfirm = async () => {
    await onConfirm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-md modal-content-animate ${
          isDark ? "bg-black/95 border-white/20" : "bg-white/95 border-black/20"
        } backdrop-blur-xl`}
      >
        <DialogHeader className="modal-header-animate">
          <DialogTitle
            className={`text-xl font-[Poppins] flex items-center gap-3 ${isDark ? "text-white" : "text-black"}`}
          >
            <div className="p-2 rounded-xl bg-red-500/20">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            Delete Employee
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          <Alert className="border-red-500/20 bg-red-500/10">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <AlertDescription className={`font-[Inter] font-bold ${isDark ? "text-red-400" : "text-red-600"}`}>
              This action cannot be undone. This will permanently delete the employee record.
            </AlertDescription>
          </Alert>

          {employee && (
            <div
              className={`p-4 rounded-lg border ${isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-black/5"}`}
            >
              <p className={`text-sm ${isDark ? "text-white/60" : "text-black/60"}`}>Employee to be deleted:</p>
              <p className={`font-semibold text-lg ${isDark ? "text-white" : "text-black"}`}>{employee.name}</p>
              <p className={`text-sm font-mono ${isDark ? "text-white/80" : "text-black/80"}`}>
                {`${employee.walletAddress.slice(0, 10)}...${employee.walletAddress.slice(-8)}`}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className={`flex-1 h-12 font-[Poppins] ${
                isDark ? "border-white/20 text-white hover:bg-white/10" : "border-black/20 text-black hover:bg-black/10"
              }`}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 h-12 font-[Poppins] bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Employee"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
