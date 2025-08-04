
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
        if (existing !== -1) {
          const updated = [...prev];
          updated[existing] = newPGAnswer;
          return updated;
        }
        return [...prev, newPGAnswer];
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
        if (existing !== -1) {
          const updated = [...prev];
          updated[existing] = newIsianAnswer;
          return updated;
        }
        return [...prev, newIsianAnswer];
      });
    } else if (questionType === 'esai') {
      const newEssayAnswer: EssayAnswer = {
        peserta_id: user.id,
        soal_essay_id: activeQuestion.id,
        jawaban_teks: answerText
      };

      setEssayAnswers(prev => {
        const existing = prev.findIndex(a => a.soal_essay_id === activeQuestion.id);
        if (existing !== -1) {
          const updated = [...prev];
          updated[existing] = newEssayAnswer;
          return updated;
        }
        return [...prev, newEssayAnswer];
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
      if (existing !== -1) {
        const updated = [...prev];
        updated[existing] = newAnswer;
        return updated;
      }
      return [...prev, newAnswer];
    });

    // Remove mark when answer is saved
    setMarkedQuestions(prev => {
      const currentMarked = prev[questionType];
      const isMarked = currentMarked.includes(currentQuestion);
      
      if (isMarked) {
        return {
          ...prev,
          [questionType]: currentMarked.filter(q => q !== currentQuestion)
        };
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
      
      return {
        ...prev,
        [questionType]: isMarked
          ? currentMarked.filter(q => q !== currentQuestion)
          : [...currentMarked, currentQuestion]
      };
    });
  };

  const [availableTypes, setAvailableTypes] = useState<QuestionType[]>([]);
  const [examTitle, setExamTitle] = useState<string>("");
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(true);
  const router = useRouter();
  const tokenRef = useRef<string>("");

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

      // Set judul ujian dari cabang_lomba yang pertama ditemukan
      const firstQuestion = soalPG[0] || soalSingkat[0] || soalEsai[0];
      if (firstQuestion?.cabang_lomba?.nama_cabang) {
        setExamTitle(firstQuestion.cabang_lomba.nama_cabang);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // Masuk fullscreen jika belum
  useEffect(() => {
    const enterFullScreen = async () => {
      try {
        if (!document.fullscreenElement) {
          const element = document.documentElement;
          if (element.requestFullscreen) {
            await element.requestFullscreen();
          } else if ((element as any).webkitRequestFullscreen) {
            await (element as any).webkitRequestFullscreen();
          } else if ((element as any).msRequestFullscreen) {
            await (element as any).msRequestFullscreen();
          }
        }
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err);
      }
    };

    // Try to enter fullscreen on component mount
    enterFullScreen();

    // Also try to enter fullscreen when visibility changes to visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        enterFullScreen();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

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
          // Fetch questions after successful token validation
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

  // Deteksi keluar tab dan hanguskan token
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "hidden") {
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
      if (document.visibilityState === "visible") {
        setShowTokenPopup(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleTokenSubmit = async () => {
    setErrorToken("");
    // Validasi token ke backend
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const res = await fetch(`${baseUrl}/api/peserta/pakai-token`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      credentials: 'include',
      body: JSON.stringify({ kode_token: inputToken }),
    });
    const data = await res.json();
    if (data.success) {
      setShowTokenPopup(false);
      setInputToken("");
      setErrorToken("");
      setTokenAktif(inputToken);
      tokenRef.current = inputToken;
      localStorage.setItem("token_aktif", inputToken);
    } else {
      setErrorToken("Kode token tidak valid atau sudah hangus. Minta token baru ke admin.");
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
        setQuestionType(prevType);
        setCurrentQuestion(questions[prevType].length); // Go to last question of previous type
      }
    } else {
      setCurrentQuestion(prev => Math.max(prev - 1, 1));
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
            setShowConfirmationPopup(false);
            setShowSuccessPopup(true);
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
      } else {
        // If this is the last type, show confirmation popup
        setShowConfirmationPopup(true);
      }
    } else {
      setCurrentQuestion(prev => Math.min(prev + 1, currentTypeQuestions.length));
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
      <div className={`${(showTokenPopup || showConfirmationPopup) ? "blur-sm pointer-events-none select-none" : ""}`}>
        <HeaderExam 
          examTitle={examTitle || "CBT Exam"} 
          timeLeft="59:36" 
        />

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

      {/* Popup Token Ulang */}
      {showTokenPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative flex flex-col items-center">
            <h2 className="text-2xl font-bold text-center mb-4">Masukkan Token Ujian</h2>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300 mb-2 text-center"
              placeholder="Token Ujian"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
            />
            {errorToken && (
              <div className="w-full text-center text-red-600 text-sm mb-2">{errorToken}</div>
            )}
            <Button
              className="w-full bg-[#D84C3B] hover:bg-red-600 text-white font-semibold py-2 rounded-md shadow transition"
              onClick={handleTokenSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      )}

      {/* Background blur saat popup muncul */}
      <div className={`fixed inset-0 transition-all ${(showConfirmationPopup || showSuccessPopup) ? 'bg-black/40 backdrop-blur-sm' : 'pointer-events-none'}`} />

      {/* Popup Konfirmasi Submit */}
      <ConfirmationSubmitPopup
        open={showConfirmationPopup}
        onClose={() => setShowConfirmationPopup(false)}
        onConfirm={submitAllAnswers}
        soalPGDikerjakan={pgAnswers.length}
        soalSingkatDikerjakan={isianSingkatAnswers.length}
        soalEsaiDikerjakan={essayAnswers.length}
        sisaWaktu="59:36" // TODO: Implement actual timer
      />

      {/* Popup Selamat */}
      <SuccessNextSectionPopup 
        open={showSuccessPopup}
        onClose={() => {
          setShowSuccessPopup(false);
          router.push('/dashboard-peserta/hasil-lomba/');
        }}
        nama="John Doe" // TODO: Use actual user name
        pesan="Selamat! Anda telah menyelesaikan ujian dengan baik. Hasil ujian Anda akan segera diproses dan dapat dilihat di halaman hasil ujian."
        sisaWaktu="59:36" // TODO: Use actual time remaining
      />
    </div>
  );
}