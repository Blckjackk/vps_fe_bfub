"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import { FaUser, FaClipboardList} from "react-icons/fa";
import { HiNewspaper } from "react-icons/hi2";
import { toast, Toaster } from 'sonner';
import { useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface CabangLomba {
  id: number;
  nama_lomba: string;
  deskripsi?: string;
}

interface PesertaData {
  id: number;
  nama_lengkap: string;    // Database menggunakan 'nama_lengkap' bukan 'nama'
  nama?: string;           // Fallback untuk compatibility  
  email?: string;          // Optional karena tidak ada di database
  nomor_pendaftaran: string;
  asal_sekolah: string;
  cabang_lomba_id: number;
  status: string;
  status_ujian?: string;   // Alternative field name
  created_at: string;
  cabang_lomba?: {
    nama_lomba: string;
    nama_cabang?: string;  // Alternative field name
  };
}

interface SoalData {
  id: number;
  pertanyaan?: string;        // Untuk PG
  pertanyaan_essay?: string;  // Untuk Essay - sesuai database
  pertanyaan_isian?: string;  // Untuk Isian Singkat - sesuai database
  soal?: string;              // Fallback untuk compatibility
  nomor_soal: number;
  cabang_lomba_id: number;
  tipe_soal: string;
  opsi_a?: string;
  opsi_b?: string;
  opsi_c?: string;
  opsi_d?: string;
  opsi_e?: string;
  jawaban_benar?: string;
  // bobot?: number;
  score?: number;
}

interface HasilLombaData {
  id: number;
  peserta_id: number;
  nama_peserta?: string;
  asal_sekolah?: string;
  cabang_lomba?: string;
  total_score: number;
  ranking?: number;
  status_ujian: string;
  waktu_selesai?: string;
  peserta?: {
    nama: string;
    asal_sekolah: string;
    nomor_pendaftaran?: string;
    cabang_lomba?: {
      nama_lomba: string;
    };
  };
  // Fields from hasil lomba page format
  noPendaftaran?: string;
  nama?: string;
  cabor?: string;
  nilai?: number;
  waktu_pengerjaan?: string;
  // Added fields for detailed scoring
  calculated_score?: number;
  detail_data?: any;
}

export default function ExportPage() {
  const [fileFormat, setFileFormat] = useState("csv");
  const [selected, setSelected] = useState({
    peserta: false,
    soal: false,
    hasil_lomba: false,
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [cabangLombaList, setCabangLombaList] = useState<CabangLomba[]>([]);
  const [selectedCabangLomba, setSelectedCabangLomba] = useState("");
  const toastShownRef = useRef(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Fetch cabang lomba data
  useEffect(() => {
    const fetchCabangLomba = async () => {
      try {
        // Try different possible endpoints for cabang lomba
        const possibleEndpoints = [
          '/api/lomba',           // Primary endpoint from backend routes
          '/api/admin/cabang-lomba',
          '/api/cabang-lomba'
        ];

        let success = false;
        
        for (const endpoint of possibleEndpoints) {
          try {
            const response = await fetch(`${baseUrl}${endpoint}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              credentials: 'include'
            });

            if (response.ok) {
              const data = await response.json();
              console.log(`Response from ${endpoint}:`, data); // Debug log
              
              // Handle different response structures
              let cabangLombaData = [];
              if (data.data && Array.isArray(data.data)) {
                // Map from lomba response structure to cabang lomba format
                cabangLombaData = data.data.map((lomba: any) => ({
                  id: lomba.id,
                  nama_lomba: lomba.nama_cabang,
                  deskripsi: lomba.deskripsi_lomba
                }));
              } else if (Array.isArray(data.data)) {
                cabangLombaData = data.data;
              } else if (Array.isArray(data)) {
                cabangLombaData = data;
              }
              
              setCabangLombaList(cabangLombaData);
              success = true;
              console.log('Cabang lomba loaded:', cabangLombaData);
              break;
            }
          } catch (error) {
            console.warn(`Failed to fetch from ${endpoint}:`, error);
            continue;
          }
        }

        if (!success) {
          console.warn('Could not fetch cabang lomba data from any endpoint');
          toast.warning('Gagal memuat data cabang lomba');
        }
      } catch (error) {
        console.error('Error fetching cabang lomba:', error);
        toast.error('Error saat memuat cabang lomba');
      }
    };

    fetchCabangLomba();
  }, [baseUrl]);

  // Fetch peserta data dynamically
  const fetchPesertaData = async (): Promise<PesertaData[]> => {
    try {
      let url = `${baseUrl}/api/admin/peserta`;
      
      const params = new URLSearchParams();
      
      // Add parameters to get ALL records (no pagination limit)
      params.append('all', 'true');
      params.append('per_page', '9999');
      
      if (selectedCabangLomba) {
        params.append('cabang_lomba_id', selectedCabangLomba);
      }
      if (startDate) {
        params.append('start_date', startDate);
      }
      if (endDate) {
        params.append('end_date', endDate);
      }
      
      url += `?${params.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Peserta API Response:', result); // Debug log
      console.log('Total peserta received for export:', result.data?.length || 0); // Debug log
      
      const pesertaData = result.data || result.peserta || result || [];
      console.log('Final peserta data count:', pesertaData.length); // Debug log
      
      return pesertaData;
    } catch (error) {
      console.error('Error fetching peserta data:', error);
      throw error;
    }
  };

  // Fetch soal data dynamically
  const fetchSoalData = async (): Promise<SoalData[]> => {
    try {
      if (!selectedCabangLomba) {
        throw new Error('Silakan pilih cabang lomba untuk export soal');
      }

      const allSoal: SoalData[] = [];

      // Fetch PG questions
      try {
        const pgResponse = await fetch(`${baseUrl}/api/soal/pg?cabang_lomba_id=${selectedCabangLomba}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include'
        });

        if (pgResponse.ok) {
          const pgData = await pgResponse.json();
          console.log('PG Soal API Response:', pgData); // Debug log
          const pgSoal = (pgData.data || pgData.soal || pgData || []).map((soal: any) => ({
            ...soal,
            tipe_soal: 'Pilihan Ganda'
          }));
          allSoal.push(...pgSoal);
        }
      } catch (error) {
        console.warn('No PG questions found');
      }

      // Fetch Isian Singkat questions
      try {
        const isianResponse = await fetch(`${baseUrl}/api/soal/isian-singkat?cabang_lomba_id=${selectedCabangLomba}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include'
        });

        if (isianResponse.ok) {
          const isianData = await isianResponse.json();
          console.log('Isian Singkat API Response:', isianData); // Debug log
          const isianSoal = (isianData.data || isianData.soal || isianData || []).map((soal: any) => ({
            ...soal,
            tipe_soal: 'Isian Singkat'
          }));
          allSoal.push(...isianSoal);
        }
      } catch (error) {
        console.warn('No Isian Singkat questions found');
      }

      // Fetch Essay questions
      try {
        const essayResponse = await fetch(`${baseUrl}/api/soal/essay?cabang_lomba_id=${selectedCabangLomba}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include'
        });

        if (essayResponse.ok) {
          const essayData = await essayResponse.json();
          console.log('Essay API Response:', essayData); // Debug log
          const essaySoal = (essayData.data || essayData.soal || essayData || []).map((soal: any) => ({
            ...soal,
            tipe_soal: 'Essay'
          }));
          allSoal.push(...essaySoal);
        }
      } catch (error) {
        console.warn('No Essay questions found');
      }

      if (allSoal.length === 0) {
        throw new Error('Tidak ada soal yang ditemukan untuk cabang lomba ini');
      }

      return allSoal;
    } catch (error) {
      console.error('Error fetching soal data:', error);
      throw error;
    }
  };

  // Fetch hasil lomba data dynamically with detailed scoring
  const fetchHasilLombaData = async (): Promise<HasilLombaData[]> => {
    try {
      let url = `${baseUrl}/api/admin/hasil/lomba`;
      
      const params = new URLSearchParams();
      if (selectedCabangLomba) {
        params.append('lomba_id', selectedCabangLomba);
      }
      if (startDate) {
        params.append('start_date', startDate);
      }
      if (endDate) {
        params.append('end_date', endDate);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        return [];
      }

      const result = await response.json();
      console.log('Hasil Lomba API Response:', result);
      const hasilLombaList = result.data || result.hasil || result || [];
      
      // Fetch detailed data for each peserta to calculate accurate score
      const detailedHasilData = await Promise.all(
        hasilLombaList.map(async (hasil: any) => {
          try {
            // Get detailed peserta data using same endpoint as dashboard peserta
            const detailResponse = await fetch(`${baseUrl}/api/admin/hasil/peserta/${hasil.peserta_id || hasil.id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              credentials: 'include'
            });

            if (detailResponse.ok) {
              const detailResult = await detailResponse.json();
              if (detailResult.success && detailResult.data) {
                const detailData = detailResult.data;
                
                // Calculate total score using same logic as dashboard peserta
                const jawabanPG = detailData.jawaban_pg || [];
                const jawabanEsai = detailData.jawaban_essay || [];
                const jawabanSingkat = detailData.jawaban_isian_singkat || [];
                const statistik = detailData.statistik || {};

                // PG Score: count correct answers
                const pgBenar = statistik.jawaban_pg_benar || 0;
                
                // Essay Score: sum of actual scores
                const totalNilaiEsai = jawabanEsai.reduce((acc: number, j: any) => acc + (j.score || 0), 0);
                
                // Isian Singkat Score: sum of actual scores  
                const totalNilaiSingkat = jawabanSingkat.reduce((acc: number, j: any) => acc + (j.score || 0), 0);
                
                // Total score = PG + Essay + Isian (same as dashboard peserta)
                const calculatedTotalScore = pgBenar + totalNilaiEsai + totalNilaiSingkat;
                
                console.log('Score calculation for', detailData.peserta?.nama_lengkap, ':', {
                  pgBenar,
                  totalNilaiEsai,
                  totalNilaiSingkat,
                  calculatedTotalScore
                });

                // Merge with original hasil data and add calculated score
                return {
                  ...hasil,
                  calculated_score: calculatedTotalScore,
                  detail_data: detailData
                };
              }
            }
          } catch (error) {
            console.warn('Failed to fetch detail for peserta', hasil.peserta_id || hasil.id, ':', error);
          }
          
          // Return original data if detail fetch failed
          return hasil;
        })
      );
      
      return detailedHasilData;
    } catch (error) {
      console.error('Error fetching hasil lomba data:', error);
      return [];
    }
  };

  const handleSelectAll = () => {
    setSelected({
      peserta: true,
      soal: true,
      hasil_lomba: true,
    });
  };

  useEffect(() => {
    if (!toastShownRef.current) {
      toast.success('Halaman berhasil dimuat!');
      toastShownRef.current = true;
    }
    
    // Check API status
    const checkApiStatus = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/ping`);
        if (response.ok) {
          setApiStatus('online');
          toast.success('Terhubung ke database', { duration: 2000 });
        } else {
          setApiStatus('offline');
        }
      } catch (error) {
        setApiStatus('offline');
        toast.warning('Database offline', { duration: 3000 });
      }
    };
    
    checkApiStatus();
  }, [baseUrl]);

  // Export data to CSV with better formatting
  const exportToCSV = (data: any[], filename: string, headers: string[]) => {
    // Create CSV with better formatting and metadata
    const csvRows = [
      // Header information
      `"BFUB - Data Export Report"`,
      `"Generated on: ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}"`,
      `"Total Records: ${data.length}"`,
      ''
    ];

    // Add cabang lomba info if available
    if (selectedCabangLomba) {
      const cabangLomba = cabangLombaList.find((cl: CabangLomba) => cl.id.toString() === selectedCabangLomba);
      if (cabangLomba) {
        csvRows.push(`"Cabang Lomba: ${cabangLomba.nama_lomba}"`);
        csvRows.push('');
      }
    }
    
    // Add table headers
    csvRows.push(headers.join(','));
    
    // Add separator row (visual separator in Excel)
    csvRows.push(headers.map(() => '""').join(','));
    
    // Add data rows with better formatting
    data.forEach(row => {
      const rowData = headers.map(header => {
        const key = header.toLowerCase().replace(/ /g, '_');
        const value = row[key] || '';
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      csvRows.push(rowData.join(','));
    });

    // Add footer information
    csvRows.push('');
    csvRows.push(`"End of Report - BFUB System"`);

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export data to PDF with custom styling
  const exportToPDF = (data: any[], filename: string, headers: string[], title: string) => {
    const doc = new jsPDF();
    
    // Add title with custom color
    doc.setFontSize(18);
    doc.setTextColor(193, 63, 63); // #C13F3F color
    doc.text(title, 14, 22);
    
    // Add subtitle
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100); // Gray color
    doc.text(`Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`, 14, 32);
    
    // Add cabang lomba info if available
    let startY = 40;
    if (selectedCabangLomba) {
      const cabangLomba = cabangLombaList.find((cl: CabangLomba) => cl.id.toString() === selectedCabangLomba);
      if (cabangLomba) {
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text(`Cabang Lomba: ${cabangLomba.nama_lomba}`, 14, 40);
        startY = 48;
      }
    }

    // Add separator line
    doc.setDrawColor(193, 63, 63); // #C13F3F color
    doc.setLineWidth(0.5);
    doc.line(14, startY, 200, startY);

    // Create table data
    const tableData = data.map(row => 
      headers.map(header => {
        const key = header.toLowerCase().replace(/ /g, '_');
        const value = row[key] || '';
        return String(value);
      })
    );

    // Add table with custom styling
    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: startY + 5,
      styles: { 
        fontSize: 9,
        cellPadding: 3,
        textColor: [50, 50, 50],
        lineColor: [200, 200, 200],
        lineWidth: 0.1
      },
      headStyles: { 
        fillColor: [193, 63, 63], // #C13F3F color
        textColor: [255, 255, 255], // White text
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250] // Light gray for alternate rows
      },
      margin: { top: 30, left: 14, right: 14 },
      tableLineColor: [193, 63, 63],
      tableLineWidth: 0.1,
    });

    // Add footer
    const pageCount = (doc as any).getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Halaman ${i} dari ${pageCount}`, 14, (doc as any).internal.pageSize.height - 10);
      doc.text(`Generated by BFUB System - ${new Date().toLocaleString('id-ID')}`, 14, (doc as any).internal.pageSize.height - 5);
    }

    doc.save(`${filename}.pdf`);
  };

  const handleExport = async () => {
    if (!selected.peserta && !selected.soal && !selected.hasil_lomba) {
      toast.error('Silakan pilih minimal satu jenis data untuk diekspor');
      return;
    }

    if (selected.soal && !selectedCabangLomba) {
      toast.error('Silakan pilih cabang lomba untuk export soal');
      return;
    }

    if (selected.hasil_lomba && !selectedCabangLomba) {
      toast.error('Silakan pilih cabang lomba untuk export hasil lomba');
      return;
    }

    setIsExporting(true);
    let exportCount = 0;
    let totalExports = (selected.peserta ? 1 : 0) + (selected.soal ? 1 : 0) + (selected.hasil_lomba ? 1 : 0);

    try {
      // Export peserta data
      if (selected.peserta) {
        toast.info('Mengekspor data peserta...');
        try {
          const pesertaData = await fetchPesertaData();
          console.log('Fetched peserta data for export:', pesertaData.length, 'records'); // Debug log
          
          const headers = ['No', 'Nama Lengkap', 'Nomor Pendaftaran', 'Asal Sekolah'];
          const processedData = pesertaData.map((peserta: PesertaData, index: number) => ({
            no: index + 1,
            nama_lengkap: peserta.nama_lengkap || peserta.nama || '',
            nomor_pendaftaran: peserta.nomor_pendaftaran || '',
            asal_sekolah: peserta.asal_sekolah || ''
          }));

          console.log('Processed data for export:', processedData.length, 'records'); // Debug log

          if (processedData.length === 0) {
            toast.warning('Tidak ada data peserta yang ditemukan');
          } else {
            const timestamp = new Date().toISOString().slice(0, 10);
            const filename = `data_peserta_${timestamp}`;

            if (fileFormat === 'csv') {
              exportToCSV(processedData, filename, headers);
            } else if (fileFormat === 'pdf') {
              exportToPDF(processedData, filename, headers, 'Data Peserta');
            }
            exportCount++;
            toast.success(`Data peserta berhasil diekspor (${processedData.length} dari total ${pesertaData.length} record)`);
          }
        } catch (error) {
          console.error('Error exporting peserta:', error);
          toast.error(`Gagal mengekspor data peserta: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Export soal data
      if (selected.soal) {
        toast.info('Mengekspor data soal...');
        try {
          const soalData = await fetchSoalData();
          const headers = ['No', 'Tipe Soal', 'Nomor Soal', 'Soal', 'Opsi A', 'Opsi B', 'Opsi C', 'Opsi D', 'Opsi E', 'Jawaban Benar' // 'Bobot'
          ];
          const processedData = soalData.map((soal: SoalData, index: number) => ({
            no: index + 1,
            tipe_soal: soal.tipe_soal || '',
            nomor_soal: soal.nomor_soal || '',
            soal: soal.pertanyaan || soal.pertanyaan_essay || soal.pertanyaan_isian || soal.soal || '',  // Field yang sesuai database
            opsi_a: soal.opsi_a || '-',
            opsi_b: soal.opsi_b || '-',
            opsi_c: soal.opsi_c || '-',
            opsi_d: soal.opsi_d || '-',
            opsi_e: soal.opsi_e || '-',
            jawaban_benar: soal.jawaban_benar || '-',
            // bobot: soal.bobot || soal.score || ''
          }));

          const cabangLomba = cabangLombaList.find((cl: CabangLomba) => cl.id.toString() === selectedCabangLomba);
          const timestamp = new Date().toISOString().slice(0, 10);
          const filename = `soal_${cabangLomba?.nama_lomba?.replace(/\s+/g, '_').toLowerCase() || 'unknown'}_${timestamp}`;

          if (processedData.length === 0) {
            toast.warning('Tidak ada data soal yang ditemukan untuk cabang lomba yang dipilih');
          } else {
            if (fileFormat === 'csv') {
              exportToCSV(processedData, filename, headers);
            } else if (fileFormat === 'pdf') {
              exportToPDF(processedData, filename, headers, `Soal - ${cabangLomba?.nama_lomba || 'Unknown'}`);
            }exportCount++;
            toast.success(`Data soal berhasil diekspor (${processedData.length} soal)`);
          }
        } catch (error) {
          console.error('Error exporting soal:', error);
          toast.error(`Gagal mengekspor data soal: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Export hasil lomba data
      if (selected.hasil_lomba) {
        toast.info('Mengekspor data hasil lomba...');
        try {
          const hasilData = await fetchHasilLombaData();
          
          if (hasilData.length === 0) {
            toast.warning('Tidak ada hasil lomba yang ditemukan');
          } else {
            const headers = ['No', 'Nama Peserta', 'Cabang Lomba', 'Nomor Pendaftaran', 'Asal Sekolah/Institusi', 'Skor Akhir'];
            const processedData = hasilData.map((hasil: HasilLombaData, index: number) => {
              // Use calculated_score if available (from detailed API), otherwise fallback to existing fields
              const finalScore = hasil.calculated_score !== undefined ? 
                hasil.calculated_score : 
                (hasil.nilai || hasil.total_score || 0);
              
              console.log(`Score for ${hasil.nama || hasil.nama_peserta}:`, {
                calculated_score: hasil.calculated_score,
                fallback_nilai: hasil.nilai,
                fallback_total_score: hasil.total_score,
                final_score: finalScore
              });

              return {
                no: index + 1,
                nama_peserta: hasil.nama || hasil.nama_peserta || hasil.peserta?.nama || '',
                cabang_lomba: hasil.cabor || hasil.cabang_lomba || hasil.peserta?.cabang_lomba?.nama_lomba || '',
                nomor_pendaftaran: hasil.noPendaftaran || hasil.peserta?.nomor_pendaftaran || '',
                'asal_sekolah/institusi': hasil.asal_sekolah || hasil.peserta?.asal_sekolah || '',
                skor_akhir: finalScore
              };
            });

            const cabangLomba = cabangLombaList.find((cl: CabangLomba) => cl.id.toString() === selectedCabangLomba);
            const timestamp = new Date().toISOString().slice(0, 10);
            const filename = `hasil_lomba_${cabangLomba?.nama_lomba?.replace(/\s+/g, '_').toLowerCase() || 'unknown'}_${timestamp}`;

            if (fileFormat === 'csv') {
              exportToCSV(processedData, filename, headers);
            } else if (fileFormat === 'pdf') {
              exportToPDF(processedData, filename, headers, `Hasil Lomba - ${cabangLomba?.nama_lomba || 'Unknown'}`);
            }
            exportCount++;
            toast.success(`Data hasil lomba berhasil diekspor (${processedData.length} record)`);
          }
        } catch (error) {
          console.error('Error exporting hasil lomba:', error);
          toast.error(`Gagal mengekspor data hasil lomba: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Final success message
      if (exportCount > 0) {
        toast.success(`Export selesai! ${exportCount} dari ${totalExports} file berhasil diekspor.`);
      } else {
        toast.error('Tidak ada file yang berhasil diekspor.');
      }

    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Terjadi kesalahan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
      <div className="space-y-6">
        {/* Header with back button and title */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-800">Ekspor File</h1>
            </div>
            
            {/* API Status Indicator */}
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${
                apiStatus === 'online' ? 'bg-green-500' : 
                apiStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'
              }`}></div>
              <span className="text-gray-600">
                {apiStatus === 'online' ? 'Database Terhubung' : 
                 apiStatus === 'offline' ? 'Mode Offline' : 'Memeriksa koneksi...'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Left Column - Table Selection */}
          <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Pilih Tabel untuk Diekspor</h2>
              <button
                onClick={handleSelectAll}
                className="text-[#2176FF] font-medium text-sm hover:underline"
              >
                Pilih Semua
              </button>
            </div>

            <div className="space-y-4">
              {/* Data Peserta */}
              <div className="p-4 bg-[#F8F9FB] rounded-xl border border-[#E0E7EF]">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selected.peserta}
                    onChange={(e) =>
                      setSelected((s) => ({ ...s, peserta: e.target.checked }))
                    }
                    className="w-5 h-5 rounded border-gray-300 text-[#6C63FF] focus:ring-[#6C63FF]"
                  />
                  <div className="flex gap-2 items-center">
                    <FaUser />
                    <span className="font-medium">Data Peserta</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Tabel data peserta menampilkan informasi lengkap mengenai peserta yang terdaftar dalam sebuah lomba. Setiap baris pada tabel mewakili satu peserta, dengan kolom-kolom yang mencakup nomor urut, nama lengkap, nomor pendaftaran, asal sekolah atau institusi.
                </p>
              </div>

              {/* Soal */}
              <div className="p-4 bg-[#F8F9FB] rounded-xl border border-[#E0E7EF]">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selected.soal}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setSelected((s) => ({ ...s, soal: isChecked }));
                      // Reset cabang lomba selection jika soal dan hasil lomba keduanya di-uncheck
                      if (!isChecked && !selected.hasil_lomba) {
                        setSelectedCabangLomba("");
                      }
                    }}
                    className="w-5 h-5 rounded border-gray-300 text-[#6C63FF] focus:ring-[#6C63FF]"
                  />
                  <div className="flex gap-2 items-center">
                    <HiNewspaper />
                    <span className="font-medium">Soal</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Tabel data soal yang diekspor mencakup tiga jenis utama, yaitu soal pilihan ganda (PG), soal esai, dan soal isian singkat. Soal PG terdiri dari pertanyaan dengan beberapa opsi jawaban, disertai kunci jawaban untuk memudahkan penilaian otomatis. Soal esai dan soal isian singkat.
                </p>
              </div>

              {/* Hasil Lomba */}
              <div className="p-4 bg-[#F8F9FB] rounded-xl border border-[#E0E7EF]">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selected.hasil_lomba}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setSelected((s) => ({ ...s, hasil_lomba: isChecked }));
                      // Reset cabang lomba selection jika hasil lomba dan soal keduanya di-uncheck
                      if (!isChecked && !selected.soal) {
                        setSelectedCabangLomba("");
                      }
                    }}
                    className="w-5 h-5 rounded border-gray-300 text-[#6C63FF] focus:ring-[#6C63FF]"
                  />
                  <div className="flex gap-2 items-center">
                    <FaClipboardList/>
                    <span className="font-medium">Hasil Lomba</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Tabel hasil lomba menampilkan rekapitulasi lengkap dari seluruh peserta yang telah mengikuti kompetisi. Setiap entri dalam tabel memuat informasi penting seperti nama peserta, cabang lomba, nomor pendaftaran, asal sekolah/institusi, dan skor akhir berdasarkan cabang lomba yang dipilih.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Export Options */}
          <div className="w-80 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6">Opsi Ekspor</h2>

            {/* Format File */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format File
              </label>
              <select
                value={fileFormat}
                onChange={(e) => setFileFormat(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#6C63FF] focus:border-[#6C63FF]"
              >
                <option value="csv">CSV</option>
                <option value="pdf">PDF</option>
              </select>
            </div>

            {/* Cabang Lomba Selection - Hanya muncul jika Soal atau Hasil Lomba dipilih */}
            {(selected.soal || selected.hasil_lomba) && (
              <div className="mb-6 transition-all duration-300 ease-in-out">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cabang Lomba
                </label>
                <select
                  value={selectedCabangLomba}
                  onChange={(e) => setSelectedCabangLomba(e.target.value)}
                  className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#6C63FF] focus:border-[#6C63FF] ${
                    !selectedCabangLomba ? 'text-gray-400' : 'text-gray-900'
                  }`}
                >
                  <option value="" disabled className="text-gray-400 italic">
                    ~ Pilih cabang lomba ~
                  </option>
                  {cabangLombaList.map((cabang) => (
                    <option key={cabang.id} value={cabang.id.toString()} className="text-gray-900">
                      {cabang.nama_lomba}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {selected.soal && selected.hasil_lomba 
                    ? '*Wajib dipilih untuk export soal dan hasil lomba'
                    : selected.soal 
                    ? '*Wajib dipilih untuk export soal'
                    : '*Wajib dipilih untuk export hasil lomba'
                  }
                </p>
              </div>
            )}

            {/* Date Range
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rentang Waktu
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#6C63FF] focus:border-[#6C63FF]"
                  placeholder="Tanggal mulai"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#6C63FF] focus:border-[#6C63FF]"
                  placeholder="Tanggal akhir"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Kosongkan untuk mengekspor semua data
              </p>
            </div> */}

            {/* Selected Tables Info */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Tabel Dipilih ({Object.entries(selected).filter(([key, value]) => value).length})
              </h3>
              <div className="text-sm text-gray-600">
                {Object.entries(selected).filter(([key, value]) => value).length === 0 ? (
                  <p className="text-gray-400 italic">Belum ada tabel dipilih</p>
                ) : (
                  <ul className="space-y-1">
                    {selected.peserta && <li>• Data Peserta</li>}
                    {selected.soal && <li>• Data Soal</li>}
                    {selected.hasil_lomba && <li>• Data Hasil Lomba</li>}
                  </ul>
                )}
              </div>
              {selectedCabangLomba && (
                <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                  <strong>Cabang Lomba:</strong><br/>
                  {cabangLombaList.find(cl => cl.id.toString() === selectedCabangLomba)?.nama_lomba}
                </div>
              )}
              {(startDate || endDate) && (
                <div className="mt-2 p-2 bg-green-50 rounded text-xs text-green-700">
                  <strong>Filter Tanggal:</strong><br/>
                  {startDate && `Dari: ${new Date(startDate).toLocaleDateString('id-ID')}`}<br/>
                  {endDate && `Sampai: ${new Date(endDate).toLocaleDateString('id-ID')}`}
                </div>
              )}
            </div>

            {/* Information Format */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Informasi Export
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <ul className="space-y-1">
                    <li><strong>Data Peserta:</strong> Nama lengkap, nomor pendaftaran, asal sekolah</li>
                    <li><strong>Data Soal:</strong> Pertanyaan (PG/Essay/Isian), opsi jawaban, kunci jawaban berdasarkan cabang lomba</li>
                    <li><strong>Hasil Lomba:</strong> Nama peserta, cabang lomba, nomor pendaftaran, asal sekolah/institusi, skor akhir berdasarkan cabang lomba</li>
                    <li><strong>Format:</strong> {fileFormat.toUpperCase()} - {fileFormat === 'csv' ? 'Mudah dibuka di Excel' : 'Dokumen siap cetak'}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Export Button */}
            <Button
              onClick={handleExport}
              disabled={isExporting || Object.values(selected).every(v => !v) || ((selected.soal || selected.hasil_lomba) && !selectedCabangLomba)}
              className="w-full bg-[#2ECC8B] hover:bg-[#27ae60] text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Mengekspor...
                </>
              ) : (
                <>
                  Export
                  <Download className="w-4 h-4" />
                </>
              )}
            </Button>
            
            {/* Export Info */}
            {Object.values(selected).some(v => v) && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                <p className="font-medium mb-1">Yang akan diekspor:</p>
                <p>• Format: {fileFormat.toUpperCase()}</p>
                <p>• Jumlah tabel: {Object.values(selected).filter(v => v).length}</p>
                <p>• Status database: {apiStatus === 'online' ? 'Terhubung' : 'Offline'}</p>
                {((selected.soal || selected.hasil_lomba) && !selectedCabangLomba) && (
                  <p className="text-red-600 mt-2">⚠️ Pilih cabang lomba untuk export {selected.soal && selected.hasil_lomba ? 'soal dan hasil lomba' : selected.soal ? 'soal' : 'hasil lomba'}</p>
                )}
              </div>
            )}
          </div>
        </div>
        <Toaster position="top-right" richColors />
      </div>
  );
}
