"use client";

import { Card } from "@/components/ui/card";

interface SidebarSoalProps {
  totalQuestions: number;
  currentQuestion: number;
  onQuestionClick: (questionNumber: number) => void;
  answeredQuestions?: number[]; // Array of question numbers that have been answered
  markedQuestions?: number[]; // Array of question numbers that have been marked
}

export default function SidebarSoal({ 
  totalQuestions, 
  currentQuestion,
  onQuestionClick,
  answeredQuestions = [],
  markedQuestions = []
}: SidebarSoalProps) {
  const questionNumbers = Array.from({ length: totalQuestions }, (_, i) => i + 1);

  return (
    <div className="w-72">
      <Card className="p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-5 gap-2">
          {questionNumbers.map((num) => {
            const isAnswered = answeredQuestions.includes(num);
            const isMarked = markedQuestions.includes(num);
            const isCurrent = num === currentQuestion;
            
            return (
              <button
                key={num}
                onClick={() => onQuestionClick(num)}
                className={`w-11 h-11 rounded font-medium text-sm transition-all ${
                  isCurrent
                    ? "bg-[#B94A48] text-white"
                    : isMarked
                    ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                    : isAnswered
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-[#B94A48] hover:border-opacity-50"
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
