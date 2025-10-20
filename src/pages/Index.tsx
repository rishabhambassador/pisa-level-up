import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, BarChart3, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">PISA Platform</h1>
          </div>
          <Link to="/login">
            <Button variant="outline">Sign In</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="text-center max-w-4xl mx-auto space-y-6 mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            PISA Assessment Platform
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            An adaptive testing platform designed for primary grade students. Practice, assess, and track progress with personalized difficulty levels.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="gap-2">
                <GraduationCap className="w-5 h-5" />
                Student Registration
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="gap-2">
                Sign In
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-card rounded-2xl p-6 shadow-[var(--shadow-soft)] border">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Adaptive Testing</h3>
            <p className="text-muted-foreground">
              Practice questions determine student level, then adaptive assessments provide appropriate challenges.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-[var(--shadow-soft)] border">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Performance Analytics</h3>
            <p className="text-muted-foreground">
              Comprehensive dashboards for teachers to track class performance, gender comparisons, and trends.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-[var(--shadow-soft)] border">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Student Progress</h3>
            <p className="text-muted-foreground">
              Students can view their performance, track improvement, and understand their learning journey.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 PISA Platform. Built for primary grade assessments.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
