import { ScrollArea } from "@/components/ui/scroll-area";

interface ReadingPassageProps {
  title: string;
  content: string;
}

const ReadingPassage = ({ title, content }: ReadingPassageProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-foreground/90">Reading Passage</h2>
      </div>
      
      <div 
        className="flex-1 rounded-3xl p-8 shadow-[var(--paper-shadow)]"
        style={{
          background: 'var(--paper-bg)',
        }}
      >
        <ScrollArea className="h-full pr-4">
          <h3 className="text-2xl font-serif font-bold mb-6 text-foreground">
            {title}
          </h3>
          <div 
            className="prose prose-lg max-w-none font-serif leading-relaxed text-foreground/90"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ReadingPassage;