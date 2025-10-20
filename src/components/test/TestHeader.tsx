import { BookOpen, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface TestHeaderProps {
  answeredQuestions: number[];
  currentQuestion: number;
  timeRemaining: number;
}

const TestHeader = ({ answeredQuestions, currentQuestion, timeRemaining }: TestHeaderProps) => {
  const [displayTime, setDisplayTime] = useState(timeRemaining);

  useEffect(() => {
    setDisplayTime(timeRemaining);
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="backdrop-blur-sm rounded-[2rem] px-6 py-4 shadow-[var(--bubble-shadow)] border border-[var(--bubble-border)]"
      style={{
        background: 'var(--bubble-glass)',
      }}
    >
      <div className="flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <span className="font-medium text-foreground/80">PISA Practice Platform</span>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5">
          <Clock className="w-4 h-4 text-primary" />
          <span className="font-mono font-semibold text-primary">
            {formatTime(displayTime)}
          </span>
        </div>

        {/* Question Progress Bubbles */}
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((qNum) => (
            <div
              key={qNum}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                currentQuestion === qNum
                  ? "bg-primary text-primary-foreground scale-110"
                  : answeredQuestions.includes(qNum)
                  ? "bg-secondary/80 text-secondary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {qNum}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestHeader;