// // <<<<<<< HEAD
// // "use client";

// // import AdminSidebar from "@/components/admin/AdminSidebar";
// // import { Button } from "@/components/ui/button";
// // import { FaUpload } from "react-icons/fa";
// // import { useRouter } from "next/navigation";
// // import { useState } from "react";

// // const lombaOptions = [
// //   { value: "osa", label: "OSA" },
// //   { value: "obn", label: "OBN" },
// //   { value: "obi", label: "OBI" },
// //   { value: "semua", label: "Semua" },
// // ];
// // const soalTypeOptions = [
// //   { value: "pg", label: "PG" },
// //   { value: "esai", label: "Esai" },
// //   { value: "isian", label: "Isian Singkat" },
// //   { value: "semua", label: "Semua" },
// // ];

// // export default function ExportPage() {
// //   const router = useRouter();
// //   const [selected, setSelected] = useState({
// //     peserta: true,
// //     soal: true,
// //     hasil: true,
// //   });
// //   const [soalType, setSoalType] = useState("semua");
// //   const [soalLomba, setSoalLomba] = useState("semua");
// //   const [pesertaLomba, setPesertaLomba] = useState("semua");
// //   const [hasilLomba, setHasilLomba] = useState("semua");

// //   const handleSelectAll = () => {
// //     setSelected({ peserta: true, soal: true, hasil: true });
// //   };

// //   return (
// //     <div className="flex min-h-screen bg-[#FAFBFF]">
// //       <AdminSidebar />
// //       <main className="flex-1 flex flex-col items-start py-10 px-2 md:px-8">
// //         <div className="w-full max-w-3xl mb-8 ml-0">
// //           <h1 className="text-2xl font-bold mb-8 ml-0">Export</h1>
// //           <div className="bg-white rounded-xl shadow p-6 mb-6">
// //             <div className="flex justify-between items-center mb-4">
// //               <span className="font-semibold">Pilih Data untuk Diekspor</span>
// //               <Button
// //                 type="button"
// //                 className="bg-[#2176FF] text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-[#185bb5]"
// //                 onClick={handleSelectAll}
// //               >
// //                 Pilih Semua
// //               </Button>
// //             </div>
// //             {/* Data Peserta */}
// //             <div className="flex flex-col gap-2 mb-4 bg-[#F8F9FB] rounded-xl p-4 border border-[#E0E7EF]">
// //               <div className="flex items-center gap-2">
// //                 <input type="checkbox" checked={selected.peserta} onChange={e => setSelected(s => ({ ...s, peserta: e.target.checked }))} className="accent-[#6C63FF] w-5 h-5" />
// //                 <span className="font-bold text-lg">Data Peserta</span>
// //                 <select
// //                   className="ml-auto border rounded px-2 py-1 text-sm"
// //                   value={pesertaLomba}
// //                   onChange={e => setPesertaLomba(e.target.value)}
// //                 >
// //                   {lombaOptions.map(opt => (
// //                     <option key={opt.value} value={opt.value}>{opt.label}</option>
// //                   ))}
// //                 </select>
// //               </div>
// //               <div className="text-xs text-gray-600">
// //                 Tabel data peserta menampilkan informasi lengkap mengenai peserta yang terdaftar dalam sebuah lomba.
// //               </div>
// //             </div>
// //             {/* Soal */}
// //             <div className="flex flex-col gap-2 mb-4 bg-[#F8F9FB] rounded-xl p-4 border-2 border-[#2176FF]">
// //               <div className="flex items-center gap-2">
// //                 <input type="checkbox" checked={selected.soal} onChange={e => setSelected(s => ({ ...s, soal: e.target.checked }))} className="accent-[#6C63FF] w-5 h-5" />
// //                 <span className="font-bold text-lg">Soal</span>
// //                 <select
// //                   className="ml-auto border rounded px-2 py-1 text-sm"
// //                   value={soalType}
// //                   onChange={e => setSoalType(e.target.value)}
// //                 >
// //                   {soalTypeOptions.map(opt => (
// //                     <option key={opt.value} value={opt.value}>{opt.label}</option>
// //                   ))}
// //                 </select>
// //                 <select
// //                   className="ml-2 border rounded px-2 py-1 text-sm"
// //                   value={soalLomba}
// //                   onChange={e => setSoalLomba(e.target.value)}
// //                 >
// //                   {lombaOptions.map(opt => (
// //                     <option key={opt.value} value={opt.value}>{opt.label}</option>
// //                   ))}
// //                 </select>
// //               </div>
// //               <div className="text-xs text-gray-600">
// //                 Tabel data soal menampilkan informasi lengkap mengenai soal yang terdaftar dalam sebuah lomba. Baik itu Pilihan Ganda, Esai, atau Isian Singkat.
// //               </div>
// //             </div>
// //             {/* Hasil Peserta */}
// //             <div className="flex flex-col gap-2 mb-4 bg-[#F8F9FB] rounded-xl p-4 border border-[#E0E7EF]">
// //               <div className="flex items-center gap-2">
// //                 <input type="checkbox" checked={selected.hasil} onChange={e => setSelected(s => ({ ...s, hasil: e.target.checked }))} className="accent-[#6C63FF] w-5 h-5" />
// //                 <span className="font-bold text-lg">Hasil Peserta</span>
// //                 <select
// //                   className="ml-auto border rounded px-2 py-1 text-sm"
// //                   value={hasilLomba}
// //                   onChange={e => setHasilLomba(e.target.value)}
// //                 >
// //                   {lombaOptions.map(opt => (
// //                     <option key={opt.value} value={opt.value}>{opt.label}</option>
// //                   ))}
// //                 </select>
// //               </div>
// //               <div className="text-xs text-gray-600">
// //                 Tabel Hasil Peserta menampilkan informasi lengkap mengenai hasil ujian peserta yang terdaftar dalam sebuah lomba.
// //               </div>
// //             </div>
// //             <div className="flex justify-end mt-8">
// //               <Button
// //                 type="submit"
// //                 variant="default"
// //                 className="px-8 bg-[#2ECC8B] text-white py-2 rounded-lg font-semibold text-sm shadow hover:bg-[#27ae60] flex items-center gap-2"
// //               >
// //                 Export <FaUpload />
// //               </Button>
// //             </div>
// //           </div>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }
// // =======
// "use client";

// import AdminSidebar from "@/components/dashboard-admin/Sidebar";
// import { Button } from "@/components/ui/button";
// import { FaUpload } from "react-icons/fa";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// const lombaOptions = [
//   { value: "osa", label: "OSA" },
//   { value: "obn", label: "OBN" },
//   { value: "obi", label: "OBI" },
//   { value: "semua", label: "Semua" },
// ];
// const soalTypeOptions = [
//   { value: "pg", label: "PG" },
//   { value: "esai", label: "Esai" },
//   { value: "isian", label: "Isian Singkat" },
//   { value: "semua", label: "Semua" },
// ];

// export default function ExportPage() {
//   const router = useRouter();
//   const [selected, setSelected] = useState({
//     peserta: true,
//     soal: true,
//     hasil: true,
//   });
//   const [soalType, setSoalType] = useState("semua");
//   const [soalLomba, setSoalLomba] = useState("semua");
//   const [pesertaLomba, setPesertaLomba] = useState("semua");
//   const [hasilLomba, setHasilLomba] = useState("semua");

//   const handleSelectAll = () => {
//     setSelected({ peserta: true, soal: true, hasil: true });
//   };

//   return (
//     <div className="flex min-h-screen bg-[#FAFBFF]">
//       <AdminSidebar />
//       <main className="flex-1 flex flex-col items-start py-10 px-2 md:px-8">
//         <div className="w-full max-w-3xl mb-8 ml-0">
//           <h1 className="text-2xl font-bold mb-8 ml-0">Export</h1>
//           <div className="bg-white rounded-xl shadow p-6 mb-6">
//             <div className="flex justify-between items-center mb-4">
//               <span className="font-semibold">Pilih Data untuk Diekspor</span>
//               <Button
//                 type="button"
//                 className="bg-[#2176FF] text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-[#185bb5]"
//                 onClick={handleSelectAll}
//               >
//                 Pilih Semua
//               </Button>
//             </div>
//             {/* Data Peserta */}
//             <div className="flex flex-col gap-2 mb-4 bg-[#F8F9FB] rounded-xl p-4 border border-[#E0E7EF]">
//               <div className="flex items-center gap-2">
//                 <input type="checkbox" checked={selected.peserta} onChange={e => setSelected(s => ({ ...s, peserta: e.target.checked }))} className="accent-[#6C63FF] w-5 h-5" />
//                 <span className="font-bold text-lg">Data Peserta</span>
//                 <select
//                   className="ml-auto border rounded px-2 py-1 text-sm"
//                   value={pesertaLomba}
//                   onChange={e => setPesertaLomba(e.target.value)}
//                 >
//                   {lombaOptions.map(opt => (
//                     <option key={opt.value} value={opt.value}>{opt.label}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="text-xs text-gray-600">
//                 Tabel data peserta menampilkan informasi lengkap mengenai peserta yang terdaftar dalam sebuah lomba.
//               </div>
//             </div>
//             {/* Soal */}
//             <div className="flex flex-col gap-2 mb-4 bg-[#F8F9FB] rounded-xl p-4 border-2 border-[#2176FF]">
//               <div className="flex items-center gap-2">
//                 <input type="checkbox" checked={selected.soal} onChange={e => setSelected(s => ({ ...s, soal: e.target.checked }))} className="accent-[#6C63FF] w-5 h-5" />
//                 <span className="font-bold text-lg">Soal</span>
//                 <select
//                   className="ml-auto border rounded px-2 py-1 text-sm"
//                   value={soalType}
//                   onChange={e => setSoalType(e.target.value)}
//                 >
//                   {soalTypeOptions.map(opt => (
//                     <option key={opt.value} value={opt.value}>{opt.label}</option>
//                   ))}
//                 </select>
//                 <select
//                   className="ml-2 border rounded px-2 py-1 text-sm"
//                   value={soalLomba}
//                   onChange={e => setSoalLomba(e.target.value)}
//                 >
//                   {lombaOptions.map(opt => (
//                     <option key={opt.value} value={opt.value}>{opt.label}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="text-xs text-gray-600">
//                 Tabel data soal menampilkan informasi lengkap mengenai soal yang terdaftar dalam sebuah lomba. Baik itu Pilihan Ganda, Esai, atau Isian Singkat.
//               </div>
//             </div>
//             {/* Hasil Peserta */}
//             <div className="flex flex-col gap-2 mb-4 bg-[#F8F9FB] rounded-xl p-4 border border-[#E0E7EF]">
//               <div className="flex items-center gap-2">
//                 <input type="checkbox" checked={selected.hasil} onChange={e => setSelected(s => ({ ...s, hasil: e.target.checked }))} className="accent-[#6C63FF] w-5 h-5" />
//                 <span className="font-bold text-lg">Hasil Peserta</span>
//                 <select
//                   className="ml-auto border rounded px-2 py-1 text-sm"
//                   value={hasilLomba}
//                   onChange={e => setHasilLomba(e.target.value)}
//                 >
//                   {lombaOptions.map(opt => (
//                     <option key={opt.value} value={opt.value}>{opt.label}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="text-xs text-gray-600">
//                 Tabel Hasil Peserta menampilkan informasi lengkap mengenai hasil ujian peserta yang terdaftar dalam sebuah lomba.
//               </div>
//             </div>
//             <div className="flex justify-end mt-8">
//               <Button
//                 type="submit"
//                 variant="default"
//                 className="px-8 bg-[#2ECC8B] text-white py-2 rounded-lg font-semibold text-sm shadow hover:bg-[#27ae60] flex items-center gap-2"
//               >
//                 Export <FaUpload />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
// >>>>>>> 4c55c92d284bd6c4fbef24c994510ed9705f3a7b
