import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface QuestionPanelProps {
  questionNumber: string;
  questionText: string;
  options: { label: string; text: string }[];
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

const QuestionPanel = ({
  questionNumber,
  questionText,
  options,
  selectedAnswer,
  onAnswerSelect,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: QuestionPanelProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <div className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground font-medium text-sm mb-3">
          {questionNumber}
        </div>
        <h3 className="text-lg font-semibold text-foreground leading-relaxed">
          {questionText}
        </h3>
      </div>

      <div className="flex-1 space-y-3">
        {options.map((option) => (
          <button
            key={option.label}
            onClick={() => onAnswerSelect(option.label)}
            className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
              selectedAnswer === option.label
                ? "border-primary shadow-md scale-[1.02]"
                : "border-border hover:border-primary/50"
            }`}
            style={{
              background: selectedAnswer === option.label 
                ? 'var(--option-selected)' 
                : 'white',
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  selectedAnswer === option.label
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {option.label}
              </div>
              <p className="flex-1 text-foreground/90 leading-relaxed pt-0.5">
                {option.text}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3 mt-6 pt-6 border-t">
        <Button
          onClick={onPrevious}
          disabled={!hasPrevious}
          variant="outline"
          size="lg"
          className="flex-1 rounded-2xl"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={!hasNext}
          size="lg"
          className="flex-1 rounded-2xl bg-secondary hover:bg-secondary/90"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default QuestionPanel;