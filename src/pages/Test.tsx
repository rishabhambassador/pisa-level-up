import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import TestHeader from "@/components/test/TestHeader";
import ReadingPassage from "@/components/test/ReadingPassage";
import QuestionPanel from "@/components/test/QuestionPanel";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Sample data structure (will be replaced with real data from database)
const samplePassage = {
  title: "The Future of Renewable Energy",
  content: `Climate change has become one of the most pressing challenges of our time. As global temperatures continue to rise, scientists and policymakers are exploring various solutions to reduce greenhouse gas emissions and transition to cleaner energy sources.

Renewable energy technologies, such as solar panels and wind turbines, have made significant advances in recent years. The cost of solar energy has decreased by more than 80% over the past decade, making it competitive with traditional fossil fuels in many regions.

However, the transition to renewable energy is not without challenges. One major obstacle is the intermittent nature of solar and wind power. The sun doesn't always shine, and the wind doesn't always blow, which means these sources cannot provide constant power without effective energy storage solutions.

Battery technology has improved dramatically, but large-scale energy storage remains expensive. Researchers are exploring various alternatives, including hydrogen fuel cells, compressed air energy storage, and even gravity-based systems that store energy by lifting heavy weights.

The path forward will likely involve a combination of different technologies and approaches. What is clear is that addressing climate change will require sustained effort, innovation, and cooperation at all levels of society.`,
};

const sampleQuestions = [
  {
    id: "Q1",
    text: "According to the passage, what is the main advantage of renewable energy that has emerged in recent years?",
    options: [
      { label: "A", text: "It produces no greenhouse gas emissions" },
      { label: "B", text: "The cost has decreased significantly" },
      { label: "C", text: "It works better than fossil fuels" },
      { label: "D", text: "It requires no maintenance" },
    ],
    correctAnswer: "B",
  },
  {
    id: "Q2",
    text: "What does the author identify as a major challenge for renewable energy?",
    options: [
      { label: "A", text: "High initial costs" },
      { label: "B", text: "Lack of public support" },
      { label: "C", text: "Intermittent power generation" },
      { label: "D", text: "Environmental damage" },
    ],
    correctAnswer: "C",
  },
];

const Test = () => {
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (loading) return;
    
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading]);

  const handleSubmitTest = () => {
    toast({
      title: "Test submitted",
      description: "Your answers have been recorded.",
    });
    navigate("/dashboard");
  };

  const handleAnswerSelect = (answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [sampleQuestions[currentQuestionIndex].id]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const getAnsweredQuestions = () => {
    return sampleQuestions
      .map((q, idx) => (answers[q.id] ? idx + 1 : null))
      .filter((q) => q !== null) as number[];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentQuestion = sampleQuestions[currentQuestionIndex];

  return (
    <div 
      className="min-h-screen p-6"
      style={{
        background: 'var(--classroom-bg)',
      }}
    >
      {/* Top Bubble - Header */}
      <div className="mb-6">
        <TestHeader
          answeredQuestions={getAnsweredQuestions()}
          currentQuestion={currentQuestionIndex + 1}
          timeRemaining={timeRemaining}
        />
      </div>

      {/* Middle Bubble - Main Content */}
      <div 
        className="backdrop-blur-sm rounded-[3rem] p-8 shadow-[var(--bubble-shadow)] border border-[var(--bubble-border)] min-h-[calc(100vh-140px)]"
        style={{
          background: 'var(--bubble-glass)',
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 h-full">
          {/* Left Section - Reading Passage */}
          <div className="h-full">
            <ReadingPassage
              title={samplePassage.title}
              content={samplePassage.content}
            />
          </div>

          {/* Right Section - Question Panel */}
          <div className="h-full">
            <QuestionPanel
              questionNumber={currentQuestion.id}
              questionText={currentQuestion.text}
              options={currentQuestion.options}
              selectedAnswer={answers[currentQuestion.id] || null}
              onAnswerSelect={handleAnswerSelect}
              onPrevious={handlePrevious}
              onNext={handleNext}
              hasPrevious={currentQuestionIndex > 0}
              hasNext={currentQuestionIndex < sampleQuestions.length - 1}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;