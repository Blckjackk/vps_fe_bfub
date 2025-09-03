"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar, Clock } from "lucide-react"

// API URL dari environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface SetTanggalRilisModalProps {
  isOpen: boolean
  onClose: () => void
  lombaId: number
  namaLomba: string
  onSuccess?: () => void
}

export default function SetTanggalRilisModal({ 
  isOpen, 
  onClose, 
  lombaId, 
  namaLomba,
  onSuccess 
}: SetTanggalRilisModalProps) {
  const [tanggal, setTanggal] = useState('')
  const [waktu, setWaktu] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!tanggal || !waktu) {
      setError('Mohon isi tanggal dan waktu rilis')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Gabungkan tanggal dan waktu
      const tanggalRilis = `${tanggal} ${waktu}:00`
      
      const response = await fetch(`${API_URL}/api/admin/lomba/${lombaId}/set-tanggal-rilis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          tanggal_rilis_nilai: tanggalRilis
        })
      })

      const data = await response.json()

      if (data.success) {
        // Reset form
        setTanggal('')
        setWaktu('')
        onClose()
        onSuccess?.()
        
        alert(`Tanggal rilis nilai berhasil ditetapkan!\nNilai akan dirilis pada: ${data.data.tanggal_rilis_formatted}`)
      } else {
        setError(data.message || 'Gagal menetapkan tanggal rilis')
      }
    } catch (err) {
      console.error('Error setting tanggal rilis:', err)
      setError('Terjadi kesalahan sistem')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setTanggal('')
    setWaktu('')
    setError('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  // Set minimum date ke hari ini
  const today = new Date().toISOString().split('T')[0]
  
  // Set minimum time jika tanggal yang dipilih adalah hari ini
  const isToday = tanggal === today
  const currentTime = new Date().toTimeString().slice(0, 5)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Set Tanggal Rilis Nilai
          </DialogTitle>
          <DialogDescription>
            Tentukan kapan nilai akan dirilis untuk semua peserta lomba{' '}
            <span className="font-semibold">{namaLomba}</span>
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tanggal" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Tanggal Rilis
            </Label>
            <Input
              id="tanggal"
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              min={today}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="waktu" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Waktu Rilis
            </Label>
            <Input
              id="waktu"
              type="time"
              value={waktu}
              onChange={(e) => setWaktu(e.target.value)}
              min={isToday ? currentTime : undefined}
              required
              className="w-full"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Catatan:</strong> Setelah tanggal dan waktu ini tiba, 
              semua peserta akan dapat melihat nilai mereka secara bersamaan.
            </p>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={loading}
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Menyimpan...' : 'Set Tanggal Rilis'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
