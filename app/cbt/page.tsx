
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import HeaderExam from "@/components/cbt/HeaderExam";
import SidebarSoal from "@/components/cbt/SidebarSoal";
import TokenPopup from "@/components/cbt/TokenPopup";
import ConfirmationSubmitPopup from "@/components/cbt/ConfirmationSubmitPopup";
import SuccessNextSectionPopup from "@/components/cbt/SuccessNextSectionPopup";

type QuestionType = 'pg' | 'singkat' | 'esai';

interface Question {
  id: number;
  soal?: string;
  pertanyaan?: string;        // For PG questions
  pertanyaan_isian?: string;  // For isian singkat questions
  pertanyaan_essay?: string;  // For essay questions
  deskripsi_soal?: string;    // Alternative field name
  pilihan?: string[];         // For frontend compatibility
  opsi_a?: string;            // From API
  opsi_b?: string;
  opsi_c?: string;
  opsi_d?: string;
  opsi_e?: string;
  jawaban?: string;           // User's answer
  jenis: QuestionType;
  cabang_lomba_id: number;
  cabang_lomba?: {
    nama_cabang: string;
  };
}

interface Questions {
  pg: Question[];
  singkat: Question[];
  esai: Question[];
}

interface Answer {
  soal_id: number;
  jawaban: string;
  jenis: QuestionType;
}

interface PGAnswer {
  peserta_id: number;
  soal_id: number;
  jawaban_peserta: string; // a, b, c, d, e
  waktu_dijawab: string;
}

interface IsianSingkatAnswer {
  peserta_id: number;
  soal_isian_singkat_id: number;
  jawaban_peserta: string;
  waktu_dijawab: string;
}

interface EssayAnswer {
  peserta_id: number;
  soal_essay_id: number;
  jawaban_teks: string;
}

export default function CBTPage() {
  const [showTokenPopup, setShowTokenPopup] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isTimeUpFinish, setIsTimeUpFinish] = useState(false); // Flag untuk membedakan popup waktu habis vs selesai normal
  const [inputToken, setInputToken] = useState("");
  const [errorToken, setErrorToken] = useState("");
  const [tokenAktif, setTokenAktif] = useState<string>("");
  const [questionType, setQuestionType] = useState<QuestionType>('pg');
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answer, setAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Questions>({
    pg: [],
    singkat: [],
    esai: []
  });
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [pgAnswers, setPGAnswers] = useState<PGAnswer[]>([]);
  const [isianSingkatAnswers, setIsianSingkatAnswers] = useState<IsianSingkatAnswer[]>([]);
  const [essayAnswers, setEssayAnswers] = useState<EssayAnswer[]>([]);
  const [markedQuestions, setMarkedQuestions] = useState<{
    pg: number[];
    singkat: number[];
    esai: number[];
  }>({
    pg: [],
    singkat: [],
    esai: []
  });

  const saveAnswer = (answerText: string) => {
    const activeQuestion = questions[questionType][currentQuestion - 1];
    if (!activeQuestion) return;

    const userData = localStorage.getItem("user_data");
    if (!userData) return;
    const user = JSON.parse(userData);
    
    // Format datetime for MySQL: YYYY-MM-DD HH:MM:SS
    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Save to the appropriate answer type
    if (questionType === 'pg') {
      const newPGAnswer: PGAnswer = {
        peserta_id: user.id,
        soal_id: activeQuestion.id,
        jawaban_peserta: answerText,
        waktu_dijawab: currentTime
      };

      setPGAnswers(prev => {
        const existing = prev.findIndex(a => a.soal_id === activeQuestion.id);
        let updated;
        if (existing !== -1) {
          updated = [...prev];
          updated[existing] = newPGAnswer;
        } else {
          updated = [...prev, newPGAnswer];
        }
        // Save to localStorage
        localStorage.setItem("cbt_pg_answers", JSON.stringify(updated));
        return updated;
      });
    } else if (questionType === 'singkat') {
      const newIsianAnswer: IsianSingkatAnswer = {
        peserta_id: user.id,
        soal_isian_singkat_id: activeQuestion.id,
        jawaban_peserta: answerText,
        waktu_dijawab: currentTime
      };

      setIsianSingkatAnswers(prev => {
        const existing = prev.findIndex(a => a.soal_isian_singkat_id === activeQuestion.id);
        let updated;
        if (existing !== -1) {
          updated = [...prev];
          updated[existing] = newIsianAnswer;
        } else {
          updated = [...prev, newIsianAnswer];
        }
        // Save to localStorage
        localStorage.setItem("cbt_singkat_answers", JSON.stringify(updated));
        return updated;
      });
    } else if (questionType === 'esai') {
      const newEssayAnswer: EssayAnswer = {
        peserta_id: user.id,
        soal_essay_id: activeQuestion.id,
        jawaban_teks: answerText
      };

      setEssayAnswers(prev => {
        const existing = prev.findIndex(a => a.soal_essay_id === activeQuestion.id);
        let updated;
        if (existing !== -1) {
          updated = [...prev];
          updated[existing] = newEssayAnswer;
        } else {
          updated = [...prev, newEssayAnswer];
        }
        // Save to localStorage
        localStorage.setItem("cbt_essay_answers", JSON.stringify(updated));
        return updated;
      });
    }

    // Keep the old answers array for compatibility
    const newAnswer: Answer = {
      soal_id: activeQuestion.id,
      jawaban: answerText,
      jenis: questionType
    };

    setAnswers(prev => {
      const existing = prev.findIndex(a => a.soal_id === activeQuestion.id && a.jenis === questionType);
      let updated;
      if (existing !== -1) {
        updated = [...prev];
        updated[existing] = newAnswer;
      } else {
        updated = [...prev, newAnswer];
      }
      // Save to localStorage
      localStorage.setItem("cbt_answers", JSON.stringify(updated));
      return updated;
    });

    // Save current progress (question type and number)
    const progress = {
      questionType,
      currentQuestion,
      lastUpdated: Date.now()
    };
    localStorage.setItem("cbt_progress", JSON.stringify(progress));

    // Remove mark when answer is saved
    setMarkedQuestions(prev => {
      const currentMarked = prev[questionType];
      const isMarked = currentMarked.includes(currentQuestion);
      
      if (isMarked) {
        const updated = {
          ...prev,
          [questionType]: currentMarked.filter(q => q !== currentQuestion)
        };
        // Save marked questions to localStorage
        localStorage.setItem("cbt_marked_questions", JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  // Fungsi untuk menandai soal
  const toggleMarkQuestion = () => {
    const activeQuestion = questions[questionType][currentQuestion - 1];
    if (!activeQuestion) return;

    setMarkedQuestions(prev => {
      const currentMarked = prev[questionType];
      const isMarked = currentMarked.includes(currentQuestion);
      
      const updated = {
        ...prev,
        [questionType]: isMarked
          ? currentMarked.filter(q => q !== currentQuestion)
          : [...currentMarked, currentQuestion]
      };
      
      // Save marked questions to localStorage
      localStorage.setItem("cbt_marked_questions", JSON.stringify(updated));
      return updated;
    });
  };

  const [availableTypes, setAvailableTypes] = useState<QuestionType[]>([]);
  const [examTitle, setExamTitle] = useState<string>("");
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(true);
  const [examDuration, setExamDuration] = useState<number>(0); // Durasi ujian dalam menit
  const [timeLeft, setTimeLeft] = useState<number>(0); // Waktu tersisa dalam detik
  const [examStartTime, setExamStartTime] = useState<number | null>(null); // Waktu mulai ujian
  const [userData, setUserData] = useState<any>(null); // Data user
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [allowExitFullscreen, setAllowExitFullscreen] = useState<boolean>(false);
  const [showWarningMessage, setShowWarningMessage] = useState<boolean>(false);
  const [showInitialFullscreenPrompt, setShowInitialFullscreenPrompt] = useState<boolean>(true); // Hanya tampil di awal
  const [hasEnteredFullscreenOnce, setHasEnteredFullscreenOnce] = useState<boolean>(false); // Track jika pernah fullscreen
  const router = useRouter();
  const tokenRef = useRef<string>("");

  // Format waktu untuk display (HH:MM:SS atau MM:SS)
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  };

  // Check if time is running low (less than 10 minutes)
  const isTimeRunningLow = (): boolean => {
    return timeLeft <= 600; // 10 minutes = 600 seconds
  };

  // Check if time is critical (less than 5 minutes)
  const isTimeCritical = (): boolean => {
    return timeLeft <= 300; // 5 minutes = 300 seconds
  };

  // Inisialisasi timer ujian
  const initializeExamTimer = () => {
    console.log('=== INITIALIZE EXAM TIMER ===');
    const savedDuration = localStorage.getItem("durasi_ujian");
    const savedStartTime = localStorage.getItem("exam_start_time");
    
    console.log('savedDuration from localStorage:', savedDuration);
    console.log('savedStartTime from localStorage:', savedStartTime);
    
    if (savedDuration) {
      const duration = parseInt(savedDuration);
      console.log('parsed duration:', duration, 'minutes');
      setExamDuration(duration);
      
      let startTime = Date.now();
      let isNewExam = false;
      
      if (savedStartTime) {
        const savedTime = parseInt(savedStartTime);
        const elapsedFromSaved = Math.floor((Date.now() - savedTime) / 1000);
        const totalSeconds = duration * 60;
        
        console.log('checking saved start time:', new Date(savedTime));
        console.log('elapsed from saved time:', elapsedFromSaved, 'seconds');
        console.log('total exam duration:', totalSeconds, 'seconds');
        
        // Jika waktu yang berlalu sudah melebihi durasi ujian + buffer 1 menit, reset timer
        if (elapsedFromSaved > (totalSeconds + 60)) {
          console.log('⚠️ Saved start time is too old, resetting timer...');
          isNewExam = true;
          startTime = Date.now();
          localStorage.setItem("exam_start_time", startTime.toString());
          console.log('✅ New start time set:', new Date(startTime));
        } else {
          startTime = savedTime;
          console.log('using existing valid start time:', new Date(startTime));
        }
      } else {
        // Pertama kali memulai ujian, simpan waktu mulai
        isNewExam = true;
        localStorage.setItem("exam_start_time", startTime.toString());
        console.log('setting new start time (first time):', new Date(startTime));
      }
      
      setExamStartTime(startTime);
      
      // Hitung waktu yang tersisa
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      const totalSeconds = duration * 60;
      const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);
      
      console.log('current time:', new Date());
      console.log('start time:', new Date(startTime));
      console.log('elapsed seconds:', elapsedSeconds);
      console.log('total seconds:', totalSeconds);
      console.log('remaining seconds:', remainingSeconds);
      console.log('formatted time:', formatTime(remainingSeconds));
      console.log('is new exam:', isNewExam);
      
      setTimeLeft(remainingSeconds);
    } else {
      console.log('No savedDuration found in localStorage!');
    }
    console.log('=== END INITIALIZE EXAM TIMER ===');
  };

  // Handle ketika waktu habis
  const handleTimeUp = async () => {
    try {
      // Izinkan keluar dari fullscreen karena ujian sudah selesai
      setAllowExitFullscreen(true);
      
      // Auto-save jawaban yang sedang dikerjakan
      if (questionType === 'pg' && selectedOption) {
        saveAnswer(selectedOption);
      } else if (questionType === 'singkat' && answer.trim()) {
        saveAnswer(answer.trim());
      } else if (questionType === 'esai' && answer.trim()) {
        saveAnswer(answer.trim());
      }

      // Submit semua jawaban tanpa menampilkan alert error
      await submitAnswersTimeUp();
      
      // Clear timer data
      localStorage.removeItem("exam_start_time");
      localStorage.removeItem("durasi_ujian");
      
      // Clear saved CBT data from localStorage since exam is finished
      localStorage.removeItem("cbt_pg_answers");
      localStorage.removeItem("cbt_singkat_answers");
      localStorage.removeItem("cbt_essay_answers");
      localStorage.removeItem("cbt_answers");
      localStorage.removeItem("cbt_marked_questions");
      localStorage.removeItem("cbt_progress");
      
      // Set flag bahwa ini adalah finish karena waktu habis
      setIsTimeUpFinish(true);
      
      // Tampilkan popup selamat dengan pesan waktu habis
      setShowSuccessPopup(true);
      
    } catch (error) {
      console.error("Error during time up:", error);
      // Tetap tampilkan popup selamat meskipun ada error
      setAllowExitFullscreen(true);
      setIsTimeUpFinish(true);
      setShowSuccessPopup(true);
    }
  };

  // Fungsi untuk mengambil soal dari API
  const fetchQuestions = async (cabangLombaId: number, pesertaId: number) => {
    try {
      setIsLoadingQuestions(true);
      console.log('Fetching questions for cabangLombaId:', cabangLombaId, 'pesertaId:', pesertaId);
      
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      // Common fetch headers
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Credentials': 'true'
      };

      // Common fetch options
      const fetchOptions = {
        method: 'GET',
        headers,
        credentials: 'include' as RequestCredentials
      };

      // Fetch cabang lomba info untuk mendapatkan durasi ujian
      console.log('=== FETCHING CABANG LOMBA DATA ===');
      const cabangLombaResponse = await fetch(`${baseUrl}/api/lomba/${cabangLombaId}`, fetchOptions);
      let cabangLombaData = null;
      
      console.log('cabangLombaResponse status:', cabangLombaResponse.status);
      console.log('cabangLombaResponse ok:', cabangLombaResponse.ok);
      
      if (cabangLombaResponse.ok) {
        const cabangLombaResult = await cabangLombaResponse.json();
        console.log('cabangLombaResult:', cabangLombaResult);
        cabangLombaData = cabangLombaResult.data;
        console.log('cabangLombaData:', cabangLombaData);
        
        // Hitung durasi ujian berdasarkan waktu mulai dan akhir
        if (cabangLombaData?.waktu_mulai_pengerjaan && cabangLombaData?.waktu_akhir_pengerjaan) {
          console.log('waktu_mulai_pengerjaan:', cabangLombaData.waktu_mulai_pengerjaan);
          console.log('waktu_akhir_pengerjaan:', cabangLombaData.waktu_akhir_pengerjaan);
          
          const waktuMulai = new Date(cabangLombaData.waktu_mulai_pengerjaan);
          const waktuAkhir = new Date(cabangLombaData.waktu_akhir_pengerjaan);
          
          console.log('parsed waktuMulai:', waktuMulai);
          console.log('parsed waktuAkhir:', waktuAkhir);
          
          const durasiMenit = Math.floor((waktuAkhir.getTime() - waktuMulai.getTime()) / (1000 * 60));
          
          console.log('calculated durasiMenit:', durasiMenit);
          
          // Simpan durasi ujian ke localStorage
          localStorage.setItem("durasi_ujian", durasiMenit.toString());
          console.log('Durasi ujian disimpan:', durasiMenit, 'menit');
          console.log('localStorage durasi_ujian after set:', localStorage.getItem("durasi_ujian"));
        } else {
          console.log('Missing waktu_mulai_pengerjaan or waktu_akhir_pengerjaan');
        }
      } else {
        console.log('Failed to fetch cabang lomba data');
        const errorText = await cabangLombaResponse.text();
        console.log('Error response:', errorText);
      }
      console.log('=== END FETCHING CABANG LOMBA DATA ===');

      // Fetch all question types in parallel
      const [pgResponse, singkatResponse, esaiResponse] = await Promise.all([
        fetch(`${baseUrl}/api/soal/pg?cabang_lomba_id=${cabangLombaId}`, fetchOptions),
        fetch(`${baseUrl}/api/soal/isian-singkat?cabang_lomba_id=${cabangLombaId}`, fetchOptions),
        fetch(`${baseUrl}/api/soal/essay?cabang_lomba_id=${cabangLombaId}`, fetchOptions)
      ]);

      // Check for HTTP errors
      if (!pgResponse.ok) {
        console.error('PG Response Error:', pgResponse.status, pgResponse.statusText);
        const errorText = await pgResponse.text();
        console.error('PG Error Text:', errorText);
      }
      if (!singkatResponse.ok) {
        console.error('Singkat Response Error:', singkatResponse.status, singkatResponse.statusText);
        const errorText = await singkatResponse.text();
        console.error('Singkat Error Text:', errorText);
      }
      if (!esaiResponse.ok) {
        console.error('Esai Response Error:', esaiResponse.status, esaiResponse.statusText);
        const errorText = await esaiResponse.text();
        console.error('Esai Error Text:', errorText);
      }

      console.log('Raw PG Response:', await pgResponse.clone().text());
      console.log('Raw Singkat Response:', await singkatResponse.clone().text());
      console.log('Raw Esai Response:', await esaiResponse.clone().text());

      const pgData = pgResponse.ok ? await pgResponse.json() : { data: [] };
      const singkatData = singkatResponse.ok ? await singkatResponse.json() : { data: [] };
      const esaiData = esaiResponse.ok ? await esaiResponse.json() : { data: [] };

      console.log('Parsed PG Data:', pgData);
      console.log('Parsed Singkat Data:', singkatData);
      console.log('Parsed Esai Data:', esaiData);
      console.log('Singkat Data Structure:', singkatData?.data?.[0]);
      console.log('Esai Data Structure:', esaiData?.data?.[0]);

      // Extract data arrays from API response
      const soalPG = pgData?.data || [];
      const soalSingkat = singkatData?.data || [];
      const soalEsai = esaiData?.data || [];

      console.log('API returned PG:', soalPG);
      console.log('API returned Singkat:', soalSingkat);
      console.log('API returned Esai:', soalEsai);

      // Process PG questions to convert opsi_* to pilihan array
      const processedPG = soalPG.map((q: any) => {
        const pilihan = [];
        if (q.opsi_a) pilihan.push(q.opsi_a);
        if (q.opsi_b) pilihan.push(q.opsi_b);
        if (q.opsi_c) pilihan.push(q.opsi_c);
        if (q.opsi_d) pilihan.push(q.opsi_d);
        if (q.opsi_e) pilihan.push(q.opsi_e);
        
        return {
          ...q,
          jenis: 'pg' as const,
          soal: q.pertanyaan || q.soal || q.deskripsi_soal,
          pilihan
        };
      });

      // Update questions state (API already filters by cabang_lomba_id)
      setQuestions({
        pg: processedPG,
        singkat: soalSingkat.map((q: any) => ({ 
          ...q, 
          jenis: 'singkat' as const,
          soal: q.pertanyaan_isian || q.soal || q.pertanyaan || q.deskripsi_soal
        })),
        esai: soalEsai.map((q: any) => ({ 
          ...q, 
          jenis: 'esai' as const,
          soal: q.pertanyaan_essay || q.soal || q.pertanyaan || q.deskripsi_soal
        }))
      });

      console.log('Questions State Updated:', {
        pg: processedPG.length,
        singkat: soalSingkat.length,
        esai: soalEsai.length
      });

      // Set tipe soal yang tersedia
      const types: QuestionType[] = [];
      if (soalPG.length > 0) types.push('pg');
      if (soalSingkat.length > 0) types.push('singkat');
      if (soalEsai.length > 0) types.push('esai');
      setAvailableTypes(types);

      // Set tipe soal awal
      if (types.length > 0) {
        setQuestionType(types[0]);
      }

      // Set judul ujian dari cabang_lomba yang pertama ditemukan atau dari data cabang lomba
      if (cabangLombaData?.nama_cabang) {
        setExamTitle(cabangLombaData.nama_cabang);
      } else {
        const firstQuestion = soalPG[0] || soalSingkat[0] || soalEsai[0];
        if (firstQuestion?.cabang_lomba?.nama_cabang) {
          setExamTitle(firstQuestion.cabang_lomba.nama_cabang);
        }
      }
      
      // Initialize timer setelah durasi ujian diset
      console.log('=== SCHEDULING TIMER INITIALIZATION ===');
      setTimeout(() => {
        console.log('=== CALLING initializeExamTimer FROM TIMEOUT ===');
        console.log('localStorage durasi_ujian before init:', localStorage.getItem("durasi_ujian"));
        initializeExamTimer();
      }, 100);
      
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // Masuk fullscreen ketika component mount dan proteksi fullscreen
  useEffect(() => {
    let isExamActive = true;

    // Inject CSS to hide browser fullscreen notifications
    const hideFullscreenNotificationStyle = document.createElement('style');
    hideFullscreenNotificationStyle.textContent = `
      /* Hide Chrome fullscreen notification */
      body:fullscreen .fullscreen-api-shown {
        display: none !important;
      }
      
      /* Hide fullscreen exit hint */
      body:fullscreen::before {
        display: none !important;
      }
      
      /* Hide webkit fullscreen notification */
      body:-webkit-full-screen .webkit-full-screen-ancestor {
        display: none !important;
      }
      
      /* Hide any overlay or notification during fullscreen */
      *:fullscreen > .fullscreen-notification,
      *:-webkit-full-screen > .fullscreen-notification,
      *:-moz-full-screen > .fullscreen-notification {
        display: none !important;
      }
      
      /* Hide browser UI elements during fullscreen */
      :fullscreen {
        padding: 0 !important;
        margin: 0 !important;
      }
    `;
    document.head.appendChild(hideFullscreenNotificationStyle);

    const enterFullScreen = async () => {
      try {
        console.log('Attempting to enter fullscreen...');
        if (!document.fullscreenElement) {
          const element = document.documentElement;
          
          // Check if fullscreen is available before attempting
          if (!document.fullscreenEnabled && !(document as any).webkitFullscreenEnabled && !(document as any).mozFullScreenEnabled) {
            console.warn('Fullscreen not available');
            return;
          }
          
          if (element.requestFullscreen) {
            await element.requestFullscreen();
            console.log('Fullscreen activated via requestFullscreen');
            setIsFullscreen(true);
            setShowInitialFullscreenPrompt(false);
            setHasEnteredFullscreenOnce(true);
          } else if ((element as any).webkitRequestFullscreen) {
            await (element as any).webkitRequestFullscreen();
            console.log('Fullscreen activated via webkitRequestFullscreen');
            setIsFullscreen(true);
            setShowInitialFullscreenPrompt(false);
            setHasEnteredFullscreenOnce(true);
          } else if ((element as any).msRequestFullscreen) {
            await (element as any).msRequestFullscreen();
            console.log('Fullscreen activated via msRequestFullscreen');
            setIsFullscreen(true);
            setShowInitialFullscreenPrompt(false);
            setHasEnteredFullscreenOnce(true);
          } else {
            console.warn('Fullscreen API not supported');
          }
        } else {
          console.log('Already in fullscreen mode');
          setIsFullscreen(true);
          setShowInitialFullscreenPrompt(false);
          setHasEnteredFullscreenOnce(true);
        }
      } catch (err) {
        console.error('Error entering fullscreen:', err);
        // Jika error permissions, tunggu sebentar sebelum retry
        if (isExamActive && !allowExitFullscreen) {
          // Tampilkan warning untuk semua jenis error
          setShowWarningMessage(true);
          setTimeout(() => setShowWarningMessage(false), 3000);
          
          // Retry dengan delay lebih lama untuk permission errors
          if (err instanceof Error && (err.message.includes('Permission') || err.message.includes('denied'))) {
            setTimeout(() => {
              if (isExamActive && !document.fullscreenElement && !allowExitFullscreen && hasEnteredFullscreenOnce) {
                enterFullScreen();
              }
            }, 3000); // Delay lebih lama untuk permission error
          } else {
            // Retry lebih cepat untuk error lain
            setTimeout(() => {
              if (isExamActive && !document.fullscreenElement && !allowExitFullscreen && hasEnteredFullscreenOnce) {
                enterFullScreen();
              }
            }, 1500);
          }
        }
      }
    };

    const exitFullScreen = async () => {
      try {
        if (document.fullscreenElement) {
          if (document.exitFullscreen) {
            await document.exitFullscreen();
          } else if ((document as any).webkitExitFullscreen) {
            await (document as any).webkitExitFullscreen();
          } else if ((document as any).mozCancelFullScreen) {
            await (document as any).mozCancelFullScreen();
          } else if ((document as any).msExitFullscreen) {
            await (document as any).msExitFullscreen();
          }
        }
      } catch (err) {
        console.error('Error exiting fullscreen:', err);
      }
    };

    // Check if already in fullscreen
    if (document.fullscreenElement) {
      setIsFullscreen(true);
      setShowInitialFullscreenPrompt(false);
      setHasEnteredFullscreenOnce(true);
      isExamActive = true;
    }

    // Monitor fullscreen changes dengan proteksi
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      console.log('Fullscreen change detected, current state:', isCurrentlyFullscreen);
      setIsFullscreen(isCurrentlyFullscreen);
      
      if (isCurrentlyFullscreen) {
        isExamActive = true;
        setShowInitialFullscreenPrompt(false);
        setHasEnteredFullscreenOnce(true);
      }
      
      // Jika keluar dari fullscreen dan ujian masih aktif, coba masuk kembali otomatis (hanya jika sudah pernah fullscreen)
      if (!isCurrentlyFullscreen && isExamActive && !allowExitFullscreen && hasEnteredFullscreenOnce) {
        console.log('Attempting to re-enter fullscreen - exam still active and user has entered fullscreen before');
        setShowWarningMessage(true);
        setTimeout(() => setShowWarningMessage(false), 3000);
        // Langsung coba masuk fullscreen lagi dengan delay untuk menghindari rate limiting
        setTimeout(() => {
          if (isExamActive && !document.fullscreenElement && !allowExitFullscreen && hasEnteredFullscreenOnce) {
            enterFullScreen();
          }
        }, 1000);
      }
    };

    // Blokir tombol ESC dan F11 (hanya setelah user pernah masuk fullscreen)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isExamActive && !allowExitFullscreen && hasEnteredFullscreenOnce) {
        if (e.key === 'Escape' || e.key === 'F11') {
          e.preventDefault();
          e.stopPropagation();
          setShowWarningMessage(true);
          setTimeout(() => setShowWarningMessage(false), 3000);
          return false;
        }
        
        // Blokir Alt+Tab, Alt+F4, Ctrl+W, dll
        if (e.altKey || (e.ctrlKey && (e.key === 'w' || e.key === 'r' || e.key === 't'))) {
          e.preventDefault();
          e.stopPropagation();
          setShowWarningMessage(true);
          setTimeout(() => setShowWarningMessage(false), 3000);
          return false;
        }
      }
    };

    // Blokir right click (hanya setelah user pernah masuk fullscreen)
    const handleContextMenu = (e: MouseEvent) => {
      if (isExamActive && !allowExitFullscreen && hasEnteredFullscreenOnce) {
        e.preventDefault();
        return false;
      }
    };

    // Blokir reload page (hanya setelah user pernah masuk fullscreen)
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isExamActive && !allowExitFullscreen && hasEnteredFullscreenOnce) {
        e.preventDefault();
        e.returnValue = 'Ujian masih berlangsung!';
        return 'Ujian masih berlangsung!';
      }
    };

    // Blokir focus loss (hanya setelah user pernah masuk fullscreen)
    const handleBlur = () => {
      if (isExamActive && !allowExitFullscreen && hasEnteredFullscreenOnce) {
        setTimeout(() => window.focus(), 10);
        setShowWarningMessage(true);
        setTimeout(() => setShowWarningMessage(false), 3000);
      }
    };

    // Tambahkan event listeners untuk proteksi
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('blur', handleBlur);

    // Store the enterFullScreen function globally so it can be called from button
    (window as any).enterFullScreen = enterFullScreen;
    (window as any).exitFullScreen = exitFullScreen;
    (window as any).setExamInactive = () => {
      isExamActive = false;
    };

    // Jangan auto-enter fullscreen di awal, biarkan user klik tombol dulu

    return () => {
      isExamActive = false;
      
      // Remove injected style
      if (hideFullscreenNotificationStyle && hideFullscreenNotificationStyle.parentNode) {
        hideFullscreenNotificationStyle.parentNode.removeChild(hideFullscreenNotificationStyle);
      }
      
      // Cleanup event listeners
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('blur', handleBlur);
      
      delete (window as any).enterFullScreen;
      delete (window as any).exitFullScreen;
      delete (window as any).setExamInactive;
    };
  }, [allowExitFullscreen, hasEnteredFullscreenOnce]);

  useEffect(() => {
    if (showTokenPopup || showConfirmationPopup) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showTokenPopup, showConfirmationPopup]);

  // Auto-save when user tries to leave the page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Auto-save current answer before leaving
      if (questionType === 'pg' && selectedOption) {
        saveAnswer(selectedOption);
      } else if (questionType === 'singkat' && answer.trim()) {
        saveAnswer(answer.trim());
      } else if (questionType === 'esai' && answer.trim()) {
        saveAnswer(answer.trim());
      }
      
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [questionType, selectedOption, answer]);

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Reset currentQuestion when switching question types and load saved answer
  useEffect(() => {
    if (questions[questionType].length > 0) {
      setCurrentQuestion(1);
      setAnswer("");
      setSelectedOption(null);
      
      // Load saved answer if exists for the first question
      const activeQuestion = questions[questionType][0];
      if (activeQuestion) {
        let savedAnswer = null;
        
        if (questionType === 'pg') {
          savedAnswer = pgAnswers.find(a => a.soal_id === activeQuestion.id);
          if (savedAnswer) {
            setSelectedOption(savedAnswer.jawaban_peserta);
          }
        } else if (questionType === 'singkat') {
          savedAnswer = isianSingkatAnswers.find(a => a.soal_isian_singkat_id === activeQuestion.id);
          if (savedAnswer) {
            setAnswer(savedAnswer.jawaban_peserta);
          }
        } else if (questionType === 'esai') {
          savedAnswer = essayAnswers.find(a => a.soal_essay_id === activeQuestion.id);
          if (savedAnswer) {
            setAnswer(savedAnswer.jawaban_teks);
          }
        }
      }
    }
  }, [questionType, questions]);

  // Load progress after questions are loaded (only once)
  useEffect(() => {
    if (questions.pg.length > 0 || questions.singkat.length > 0 || questions.esai.length > 0) {
      const savedProgress = localStorage.getItem("cbt_progress");
      if (savedProgress) {
        try {
          const progress = JSON.parse(savedProgress);
          // Only restore progress if it's recent (within last 24 hours)
          const isRecentProgress = (Date.now() - progress.lastUpdated) < 24 * 60 * 60 * 1000;
          
          if (isRecentProgress && availableTypes.includes(progress.questionType as QuestionType)) {
            const progressType = progress.questionType as QuestionType;
            const maxQuestion = questions[progressType]?.length || 1;
            const validCurrentQuestion = Math.min(progress.currentQuestion, maxQuestion);
            
            setQuestionType(progressType);
            setCurrentQuestion(validCurrentQuestion);
            
            console.log('Restored progress:', {
              questionType: progressType,
              currentQuestion: validCurrentQuestion
            });
          }
        } catch (error) {
          console.error("Error loading progress:", error);
        }
      }
    }
  }, [questions, availableTypes]);

  // Load saved answer when switching questions within the same type
  useEffect(() => {
    const activeQuestion = questions[questionType][currentQuestion - 1];
    if (activeQuestion) {
      let savedAnswer = null;
      
      // Get saved answer based on question type
      if (questionType === 'pg') {
        savedAnswer = pgAnswers.find(a => a.soal_id === activeQuestion.id);
        if (savedAnswer) {
          setSelectedOption(savedAnswer.jawaban_peserta);
          setAnswer("");
        }
      } else if (questionType === 'singkat') {
        savedAnswer = isianSingkatAnswers.find(a => a.soal_isian_singkat_id === activeQuestion.id);
        if (savedAnswer) {
          setAnswer(savedAnswer.jawaban_peserta);
          setSelectedOption(null);
        }
      } else if (questionType === 'esai') {
        savedAnswer = essayAnswers.find(a => a.soal_essay_id === activeQuestion.id);
        if (savedAnswer) {
          setAnswer(savedAnswer.jawaban_teks);
          setSelectedOption(null);
        }
      }

      if (!savedAnswer) {
        // Clear if no saved answer
        setAnswer("");
        setSelectedOption(null);
      }
    }
  }, [currentQuestion, questionType, questions, pgAnswers, isianSingkatAnswers, essayAnswers]);

  // Set userData dari localStorage secara langsung saat component mount
  useEffect(() => {
    const storedUserData = localStorage.getItem("user_data");
    if (storedUserData) {
      const user = JSON.parse(storedUserData);
      setUserData(user);
      console.log('Setting userData:', user);
    }
  }, []);

  // Load saved answers and progress from localStorage
  useEffect(() => {
    // Load saved answers
    const savedPGAnswers = localStorage.getItem("cbt_pg_answers");
    const savedSingkatAnswers = localStorage.getItem("cbt_singkat_answers");
    const savedEssayAnswers = localStorage.getItem("cbt_essay_answers");
    const savedAnswers = localStorage.getItem("cbt_answers");
    const savedMarkedQuestions = localStorage.getItem("cbt_marked_questions");
    
    if (savedPGAnswers) {
      try {
        setPGAnswers(JSON.parse(savedPGAnswers));
      } catch (error) {
        console.error("Error loading PG answers:", error);
      }
    }
    
    if (savedSingkatAnswers) {
      try {
        setIsianSingkatAnswers(JSON.parse(savedSingkatAnswers));
      } catch (error) {
        console.error("Error loading Singkat answers:", error);
      }
    }
    
    if (savedEssayAnswers) {
      try {
        setEssayAnswers(JSON.parse(savedEssayAnswers));
      } catch (error) {
        console.error("Error loading Essay answers:", error);
      }
    }
    
    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers));
      } catch (error) {
        console.error("Error loading answers:", error);
      }
    }
    
    if (savedMarkedQuestions) {
      try {
        setMarkedQuestions(JSON.parse(savedMarkedQuestions));
      } catch (error) {
        console.error("Error loading marked questions:", error);
      }
    }
  }, []);

  // Ambil token aktif dari localStorage dan validasi
  useEffect(() => {
    const checkAndValidateToken = async () => {
      const storedToken = localStorage.getItem("token_aktif");
      const storedUserData = localStorage.getItem("user_data");
      
      if (!storedToken || !storedUserData) {
        // Redirect ke dashboard jika tidak ada token atau user data
        window.location.href = "/dashboard-peserta";
        return;
      }

      const user = JSON.parse(storedUserData);
      setUserData(user); // Set user data untuk digunakan di komponen lain
      
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${baseUrl}/api/peserta/pakai-token`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          credentials: 'include',
          body: JSON.stringify({ 
            kode_token: storedToken,
            peserta_id: user.id,
            cabang_lomba_id: user.cabang_lomba_id
          }),
        });

        const data = await res.json();
        if (data.success) {
          setTokenAktif(storedToken);
          tokenRef.current = storedToken;
          // Fetch questions first - timer akan diinisialisasi di dalam fetchQuestions setelah durasi diset
          await fetchQuestions(user.cabang_lomba_id, user.id);
        } else {
          // Token tidak valid, kembali ke dashboard
          localStorage.removeItem("token_aktif");
          window.location.href = "/dashboard-peserta";
        }
      } catch (error) {
        console.error("Error validating token:", error);
      }
    };

    checkAndValidateToken();
  }, []);

  // Deteksi keluar tab dan hanguskan token (hanya jika ujian masih aktif)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "hidden" && !allowExitFullscreen) {
        const kodeToken = tokenRef.current;
        if (kodeToken) {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
          await fetch(`${baseUrl}/api/peserta/hanguskan-token`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({ kode_token: kodeToken }),
          });
          localStorage.removeItem("token_aktif");
        }
      }
      if (document.visibilityState === "visible" && !allowExitFullscreen) {
        setShowTokenPopup(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [allowExitFullscreen]);

  const handleTokenSubmit = async (token: string) => {
    setErrorToken("");
    
    if (!token.trim()) {
      setErrorToken("Silakan masukkan token yang valid.");
      return;
    }
    
    // Ambil user data untuk peserta_id dan cabang_lomba_id
    const storedUserData = localStorage.getItem("user_data");
    if (!storedUserData) {
      setErrorToken("Data peserta tidak ditemukan. Silakan login ulang.");
      return;
    }
    
    const user = JSON.parse(storedUserData);
    
    try {
      // Validasi token ke backend dengan data peserta
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${baseUrl}/api/peserta/pakai-token`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({ 
          kode_token: token,
          peserta_id: user.id,
          cabang_lomba_id: user.cabang_lomba_id
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        setShowTokenPopup(false);
        setInputToken("");
        setErrorToken("");
        setTokenAktif(token);
        tokenRef.current = token;
        localStorage.setItem("token_aktif", token);
      } else {
        setErrorToken(data.message || "Kode token tidak valid atau sudah hangus. Minta token baru ke admin.");
      }
    } catch (error) {
      console.error("Error validating token:", error);
      setErrorToken("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  const handleBack = () => {
    // Auto-save current answer before navigation
    if (questionType === 'pg' && selectedOption) {
      saveAnswer(selectedOption);
    } else if (questionType === 'singkat' && answer.trim()) {
      saveAnswer(answer.trim());
    } else if (questionType === 'esai' && answer.trim()) {
      saveAnswer(answer.trim());
    }

    if (currentQuestion === 1) {
      // Find previous available question type
      const currentTypeIndex = availableTypes.indexOf(questionType);
      if (currentTypeIndex > 0) {
        const prevType = availableTypes[currentTypeIndex - 1];
        const lastQuestion = questions[prevType].length;
        setQuestionType(prevType);
        setCurrentQuestion(lastQuestion); // Go to last question of previous type
        
        // Save progress for previous question type
        const progress = {
          questionType: prevType,
          currentQuestion: lastQuestion,
          lastUpdated: Date.now()
        };
        localStorage.setItem("cbt_progress", JSON.stringify(progress));
      }
    } else {
      const prevQuestion = Math.max(currentQuestion - 1, 1);
      setCurrentQuestion(prevQuestion);
      
      // Save progress
      const progress = {
        questionType,
        currentQuestion: prevQuestion,
        lastUpdated: Date.now()
      };
      localStorage.setItem("cbt_progress", JSON.stringify(progress));
    }
  };

  const submitAllAnswers = async () => {
    try {
      const userData = localStorage.getItem("user_data");
      if (!userData) return;
      
      const user = JSON.parse(userData);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      let allSuccess = true;
      
      // Submit PG answers
      if (pgAnswers.length > 0) {
        console.log('Submitting PG answers:', pgAnswers);
        const pgResponse = await fetch(`${baseUrl}/api/jawaban/pg`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          credentials: 'include',
          body: JSON.stringify({
            answers: pgAnswers
          })
        });
        
        const pgResult = await pgResponse.json();
        console.log('PG Response:', pgResult);
        
        if (!pgResponse.ok) {
          console.error('Failed to submit PG answers:', pgResult);
          allSuccess = false;
        }
      }

      // Submit Isian Singkat answers
      if (isianSingkatAnswers.length > 0) {
        console.log('Submitting Isian Singkat answers:', isianSingkatAnswers);
        const isianResponse = await fetch(`${baseUrl}/api/jawaban/isian-singkat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          credentials: 'include',
          body: JSON.stringify({
            answers: isianSingkatAnswers
          })
        });
        
        const isianResult = await isianResponse.json();
        console.log('Isian Singkat Response:', isianResult);
        
        if (!isianResponse.ok) {
          console.error('Failed to submit Isian Singkat answers:', isianResult);
          allSuccess = false;
        }
      }

      // Submit Essay answers
      if (essayAnswers.length > 0) {
        console.log('Submitting Essay answers:', essayAnswers);
        const essayResponse = await fetch(`${baseUrl}/api/jawaban/essay`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          credentials: 'include',
          body: JSON.stringify({
            answers: essayAnswers
          })
        });
        
        const essayResult = await essayResponse.json();
        console.log('Essay Response:', essayResult);
        
        if (!essayResponse.ok) {
          console.error('Failed to submit Essay answers:', essayResult);
          allSuccess = false;
        }
      }

      // Check if no answers were submitted
      if (pgAnswers.length === 0 && isianSingkatAnswers.length === 0 && essayAnswers.length === 0) {
        alert("Tidak ada jawaban untuk disubmit. Silakan jawab minimal satu soal.");
        return;
      }

      // Show result
      if (allSuccess) {
        // Call API to finish exam and update status to 'selesai'
        try {
          const finishResponse = await fetch(`${baseUrl}/api/peserta/selesaikan-ujian`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
              peserta_id: user.id
            })
          });
          
          const finishResult = await finishResponse.json();
          console.log('Finish exam response:', finishResult);
          
          if (finishResponse.ok) {
            // Izinkan keluar dari fullscreen karena ujian sudah selesai
            setAllowExitFullscreen(true);
            
            // Nonaktifkan proteksi ujian
            if ((window as any).setExamInactive) {
              (window as any).setExamInactive();
            }
            
            setShowConfirmationPopup(false);
            setIsTimeUpFinish(false); // Ini bukan karena waktu habis
            setShowSuccessPopup(true);
            
            // Clear saved CBT data from localStorage since exam is finished
            localStorage.removeItem("cbt_pg_answers");
            localStorage.removeItem("cbt_singkat_answers");
            localStorage.removeItem("cbt_essay_answers");
            localStorage.removeItem("cbt_answers");
            localStorage.removeItem("cbt_marked_questions");
            localStorage.removeItem("cbt_progress");
          } else {
            console.error('Failed to finish exam:', finishResult);
            const errorMessage = finishResult.message || 'Gagal menyelesaikan ujian';
            alert(`Jawaban berhasil disimpan, tetapi gagal menyelesaikan ujian: ${errorMessage}. Silakan hubungi admin.`);
          }
        } catch (finishError) {
          console.error("Error finishing exam:", finishError);
          alert("Jawaban berhasil disimpan, tetapi gagal menyelesaikan ujian. Silakan hubungi admin.");
        }
      } else {
        alert("Beberapa jawaban gagal disimpan. Silakan coba lagi.");
      }
      
    } catch (error) {
      console.error("Error submitting answers:", error);
      alert("Terjadi kesalahan saat menyimpan jawaban: " + error);
    }
  };

  // Fungsi khusus submit untuk waktu habis - tanpa alert error
  const submitAnswersTimeUp = async () => {
    try {
      const userData = localStorage.getItem("user_data");
      if (!userData) return;
      
      const user = JSON.parse(userData);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      // Submit PG answers
      if (pgAnswers.length > 0) {
        console.log('Submitting PG answers on time up:', pgAnswers);
        try {
          const pgResponse = await fetch(`${baseUrl}/api/jawaban/pg`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
              answers: pgAnswers
            })
          });
          
          const pgResult = await pgResponse.json();
          console.log('PG Response on time up:', pgResult);
        } catch (error) {
          console.error('Error submitting PG answers on time up:', error);
        }
      }

      // Submit Isian Singkat answers
      if (isianSingkatAnswers.length > 0) {
        console.log('Submitting Isian Singkat answers on time up:', isianSingkatAnswers);
        try {
          const isianResponse = await fetch(`${baseUrl}/api/jawaban/isian-singkat`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
              answers: isianSingkatAnswers
            })
          });
          
          const isianResult = await isianResponse.json();
          console.log('Isian Singkat Response on time up:', isianResult);
        } catch (error) {
          console.error('Error submitting Isian Singkat answers on time up:', error);
        }
      }

      // Submit Essay answers
      if (essayAnswers.length > 0) {
        console.log('Submitting Essay answers on time up:', essayAnswers);
        try {
          const essayResponse = await fetch(`${baseUrl}/api/jawaban/essay`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
              answers: essayAnswers
            })
          });
          
          const essayResult = await essayResponse.json();
          console.log('Essay Response on time up:', essayResult);
        } catch (error) {
          console.error('Error submitting Essay answers on time up:', error);
        }
      }

      // Try to finish exam - don't throw error if it fails
      try {
        const finishResponse = await fetch(`${baseUrl}/api/peserta/selesaikan-ujian`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          credentials: 'include',
          body: JSON.stringify({
            peserta_id: user.id
          })
        });
        
        const finishResult = await finishResponse.json();
        console.log('Finish exam response on time up:', finishResult);
      } catch (finishError) {
        console.error("Error finishing exam on time up:", finishError);
      }
      
    } catch (error) {
      console.error("Error during time up submission:", error);
    }
  };

  const handleQuestionClick = (questionNumber: number) => {
    // Auto-save current answer before navigation
    if (questionType === 'pg' && selectedOption) {
      saveAnswer(selectedOption);
    } else if (questionType === 'singkat' && answer.trim()) {
      saveAnswer(answer.trim());
    } else if (questionType === 'esai' && answer.trim()) {
      saveAnswer(answer.trim());
    }

    setCurrentQuestion(questionNumber);
    
    // Save progress
    const progress = {
      questionType,
      currentQuestion: questionNumber,
      lastUpdated: Date.now()
    };
    localStorage.setItem("cbt_progress", JSON.stringify(progress));
  };

  const handleNext = () => {
    // Auto-save current answer before navigation
    if (questionType === 'pg' && selectedOption) {
      saveAnswer(selectedOption);
    } else if (questionType === 'singkat' && answer.trim()) {
      saveAnswer(answer.trim());
    } else if (questionType === 'esai' && answer.trim()) {
      saveAnswer(answer.trim());
    }

    const currentTypeQuestions = questions[questionType];
    
    if (currentQuestion === currentTypeQuestions.length) {
      // Find next available question type
      const currentTypeIndex = availableTypes.indexOf(questionType);
      if (currentTypeIndex < availableTypes.length - 1) {
        const nextType = availableTypes[currentTypeIndex + 1];
        setQuestionType(nextType);
        setCurrentQuestion(1);
        setSelectedOption(null);
        setAnswer("");
        
        // Save progress for new question type
        const progress = {
          questionType: nextType,
          currentQuestion: 1,
          lastUpdated: Date.now()
        };
        localStorage.setItem("cbt_progress", JSON.stringify(progress));
      } else {
        // If this is the last type, show confirmation popup
        setShowConfirmationPopup(true);
      }
    } else {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      
      // Save progress
      const progress = {
        questionType,
        currentQuestion: nextQuestion,
        lastUpdated: Date.now()
      };
      localStorage.setItem("cbt_progress", JSON.stringify(progress));
    }
  };

  const getAnsweredQuestions = () => {
    const answeredQuestionNumbers: number[] = [];
    
    questions[questionType].forEach((question, index) => {
      let hasAnswer = false;
      
      if (questionType === 'pg') {
        hasAnswer = pgAnswers.some(a => a.soal_id === question.id);
      } else if (questionType === 'singkat') {
        hasAnswer = isianSingkatAnswers.some(a => a.soal_isian_singkat_id === question.id);
      } else if (questionType === 'esai') {
        hasAnswer = essayAnswers.some(a => a.soal_essay_id === question.id);
      }
      
      if (hasAnswer) {
        answeredQuestionNumbers.push(index + 1);
      }
    });
    
    return answeredQuestionNumbers;
  };

  const getNextButtonText = () => {
    const currentTypeQuestions = questions[questionType];
    const isLastQuestion = currentQuestion === currentTypeQuestions.length;
    
    if (isLastQuestion) {
      const currentTypeIndex = availableTypes.indexOf(questionType);
      if (currentTypeIndex < availableTypes.length - 1) {
        const nextType = availableTypes[currentTypeIndex + 1];
        switch (nextType) {
          case 'singkat':
            return "Lanjut ke Soal Singkat";
          case 'esai':
            return "Lanjut ke Soal Esai";
          default:
            return "Next Section";
        }
      } else {
        return "Submit Ujian";
      }
    }
    return "Next";
  };

  const getBackButtonText = () => {
    if (currentQuestion === 1) {
      switch (questionType) {
        case 'singkat':
          return "Kembali ke Soal PG";
        case 'esai':
          return "Kembali ke Soal Singkat";
        default:
          return "Back";
      }
    }
    return "Back";
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className={`${(showTokenPopup || showConfirmationPopup || showSuccessPopup || showInitialFullscreenPrompt) ? "blur-sm pointer-events-none select-none" : ""}`}>
        <HeaderExam 
          examTitle={examTitle || "CBT Exam"} 
          timeLeft={formatTime(timeLeft)}
          isTimeRunningLow={isTimeRunningLow()}
          isTimeCritical={isTimeCritical()}
        />
        {/* Debug info - remove this later
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed top-20 right-4 bg-black text-white p-2 text-xs z-50">
            <div>timeLeft: {timeLeft}</div>
            <div>formatted: {formatTime(timeLeft)}</div>
            <div>examDuration: {examDuration}</div>
            <div>examStartTime: {examStartTime}</div>
            <div>localStorage durasi_ujian: {typeof window !== 'undefined' ? localStorage.getItem("durasi_ujian") : 'N/A'}</div>
          </div>
        )} */}

        <div className="container mx-auto px-6 pt-4">
          <div className="flex gap-4 mb-4">
            {availableTypes.map((type) => (
              <Button 
                key={type}
                variant={questionType === type ? 'default' : 'outline'}
                className={questionType === type
                  ? "bg-[#B94A48] text-white hover:bg-[#A43D3B] font-medium"
                  : "text-gray-700 hover:bg-gray-50 font-medium"
                }
                onClick={() => {
                  // Auto-save current answer before switching question type
                  if (questionType === 'pg' && selectedOption) {
                    saveAnswer(selectedOption);
                  } else if (questionType === 'singkat' && answer.trim()) {
                    saveAnswer(answer.trim());
                  } else if (questionType === 'esai' && answer.trim()) {
                    saveAnswer(answer.trim());
                  }

                  setQuestionType(type);
                  setCurrentQuestion(1);
                  setSelectedOption(null);
                  setAnswer("");
                  
                  // Save progress for new question type
                  const progress = {
                    questionType: type,
                    currentQuestion: 1,
                    lastUpdated: Date.now()
                  };
                  localStorage.setItem("cbt_progress", JSON.stringify(progress));
                }}
              >
                {type === 'pg' ? 'Pilihan Ganda' : type === 'singkat' ? 'Jawaban Singkat' : 'Esai'}
              </Button>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-6 py-4 flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <Card className="p-8 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Soal No.{currentQuestion}</h2>
                <span className="text-[#B94A48] font-medium">
                  {currentQuestion}/{questions[questionType].length}
                </span>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border border-gray-100">
                  {questions[questionType][currentQuestion - 1] ? (
                    <p className="text-gray-800 leading-relaxed">
                      {questions[questionType][currentQuestion - 1].soal}
                    </p>
                  ) : (
                    <p className="text-gray-500 text-center">
                      {isLoadingQuestions 
                        ? 'Memuat soal...'
                        : questions[questionType].length === 0 
                          ? `Tidak ada soal ${questionType === 'pg' ? 'pilihan ganda' : questionType === 'singkat' ? 'jawaban singkat' : 'esai'} untuk cabang lomba ini.`
                          : 'Memuat soal...'
                      }
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  {questionType === 'pg' && questions[questionType][currentQuestion - 1]?.pilihan && (
                    <>
                      {questions[questionType][currentQuestion - 1]?.pilihan?.map((pilihan, index) => {
                        const label = String.fromCharCode(97 + index); // 'a', 'b', 'c', etc.
                        return (
                          <div
                            key={label}
                            className={`flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-all ${
                              selectedOption === label
                                ? "bg-[#B94A48] bg-opacity-10 border-2 border-[#B94A48]"
                                : "bg-white border border-gray-200 hover:border-[#B94A48] hover:border-opacity-50"
                            }`}
                            onClick={() => {
                              setSelectedOption(label);
                              // Don't auto-save, let user manually save or navigate
                            }}
                          >
                            <div className={`w-7 h-7 rounded flex items-center justify-center text-sm font-medium
                              ${selectedOption === label 
                                ? "bg-[#B94A48] text-white border border-[#B94A48]" 
                                : "border border-gray-300 text-gray-600"}
                            `}>
                              {label}
                            </div>
                            <p className={`text-gray-700 ${selectedOption === label ? "text-[#B94A48] font-medium" : ""}`}>
                              {pilihan}
                            </p>
                          </div>
                        );
                      })}
                      {/* {selectedOption && (
                        <Button 
                          onClick={() => saveAnswer(selectedOption)} 
                          className="w-full bg-green-500 hover:bg-green-600 text-white mt-4"
                        >
                          Simpan
                        </Button>
                      )} */}
                    </>
                  )}
                  {questionType === 'singkat' && questions[questionType][currentQuestion - 1] && (
                    <>
                      <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Tulis jawaban singkat Anda di sini..."
                        className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B94A48] focus:ring-1 focus:ring-[#B94A48]"
                      />
                      {/* <Button 
                        onClick={() => saveAnswer(answer)} 
                        className="w-full bg-green-500 hover:bg-green-600 text-white"
                      >
                        Simpan
                      </Button> */}
                    </>
                  )}
                  {questionType === 'esai' && questions[questionType][currentQuestion - 1] && (
                    <>
                      <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Tulis jawaban esai Anda di sini..."
                        className="w-full h-64 p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B94A48] focus:ring-1 focus:ring-[#B94A48] resize-none"
                      />
                      {/* <Button 
                        onClick={() => saveAnswer(answer)} 
                        className="w-full bg-green-500 hover:bg-green-600 text-white"
                      >
                        Simpan
                      </Button> */}
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline"
                  className="px-6 py-2 text-gray-700 hover:bg-gray-50"
                  onClick={handleBack}
                  disabled={questions[questionType].length === 0 || isLoadingQuestions}
                >
                  {getBackButtonText()}
                </Button>
                <Button 
                  variant="secondary"
                  className={`px-6 py-2 ${
                    markedQuestions[questionType].includes(currentQuestion)
                      ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={toggleMarkQuestion}
                  disabled={questions[questionType].length === 0 || isLoadingQuestions}
                >
                  {markedQuestions[questionType].includes(currentQuestion) ? "Batal Tandai" : "Tandai Soal"}
                </Button>
                <Button 
                  className={`px-6 py-2 text-white ${
                    (currentQuestion === questions[questionType]?.length && 
                     availableTypes.indexOf(questionType) === availableTypes.length - 1)
                      ? "bg-green-500 hover:bg-green-600" 
                      : "bg-[#B94A48] hover:bg-[#A43D3B]"
                  }`}
                  onClick={handleNext}
                  disabled={questions[questionType].length === 0 || isLoadingQuestions}
                >
                  {getNextButtonText()}
                </Button>
              </div>
            </Card>
          </div>

          <SidebarSoal 
            totalQuestions={questions[questionType]?.length || 0}
            currentQuestion={currentQuestion}
            onQuestionClick={handleQuestionClick}
            answeredQuestions={getAnsweredQuestions()}
            markedQuestions={markedQuestions[questionType]}
          />
        </div>
      </div>

      {/* Background blur saat popup muncul */}
      {(showTokenPopup || showConfirmationPopup || showSuccessPopup || showWarningMessage || showInitialFullscreenPrompt) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
      )}

      {/* Popup Peringatan Fullscreen */}
      {showWarningMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Tidak diizinkan keluar dari fullscreen selama ujian berlangsung!</span>
            </div>
          </div>
        </div>
      )}

      {/* Popup Fullscreen Initial (hanya di awal) */}
      {showInitialFullscreenPrompt && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="text-center">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Mode Fullscreen Diperlukan
              </h3>
              <p className="text-gray-600 mb-6">
                Untuk menjaga integritas ujian, silakan aktifkan mode fullscreen dengan menekan tombol di bawah ini sebelum memulai ujian.
              </p>
              <button
                onClick={() => {
                  if ((window as any).enterFullScreen) {
                    (window as any).enterFullScreen();
                  }
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Mulai Ujian Fullscreen
              </button>
              <p className="text-xs text-gray-500 mt-3">
                Setelah ini, Anda tidak akan bisa keluar dari fullscreen selama ujian berlangsung
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Popup Token Ulang */}
      <TokenPopup
        open={showTokenPopup}
        onClose={() => setShowTokenPopup(false)}
        onSubmit={handleTokenSubmit}
        errorMessage={errorToken}
      />

      {/* Popup Konfirmasi Submit */}
      <ConfirmationSubmitPopup
        open={showConfirmationPopup}
        onClose={() => setShowConfirmationPopup(false)}
        onConfirm={submitAllAnswers}
        soalPGDikerjakan={pgAnswers.length}
        soalSingkatDikerjakan={isianSingkatAnswers.length}
        soalEsaiDikerjakan={essayAnswers.length}
        totalSoalPG={questions.pg.length}
        totalSoalSingkat={questions.singkat.length}
        totalSoalEsai={questions.esai.length}
        sisaWaktu={formatTime(timeLeft)}
      />

      {/* Popup Selamat */}
      <SuccessNextSectionPopup 
        open={showSuccessPopup}
        onClose={() => {
          // Izinkan keluar dari fullscreen dan nonaktifkan proteksi sebelum redirect
          setAllowExitFullscreen(true);
          if ((window as any).setExamInactive) {
            (window as any).setExamInactive();
          }
          
          // Keluar dari fullscreen sebelum redirect
          if ((window as any).exitFullScreen) {
            (window as any).exitFullScreen();
          }
          
          setShowSuccessPopup(false);
          setIsTimeUpFinish(false); // Reset flag
          router.push('/dashboard-peserta/hasil-lomba/');
        }}
        nama={userData?.nama_lengkap || userData?.nama || "Peserta"} 
        pesan={isTimeUpFinish 
          ? "Waktu ujian Anda telah habis! Namun jangan khawatir, semua jawaban yang telah Anda kerjakan sudah berhasil disimpan secara otomatis. Hasil ujian Anda akan segera diproses dan dapat dilihat di halaman hasil ujian."
          : "Selamat! Anda telah menyelesaikan ujian dengan baik. Hasil ujian Anda akan segera diproses dan dapat dilihat di halaman hasil ujian."
        }
        sisaWaktu={formatTime(timeLeft)}
      />
    </div>
  );
}