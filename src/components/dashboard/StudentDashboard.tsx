import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Trophy, TrendingUp, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StudentStats {
  totalTests: number;
  averageScore: number;
  assignedLevel: string | null;
}

const StudentDashboard = () => {
  const [stats, setStats] = useState<StudentStats>({
    totalTests: 0,
    averageScore: 0,
    assignedLevel: null,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get student details
      const { data: studentDetails } = await supabase
        .from("student_details")
        .select("assigned_level")
        .eq("user_id", user.id)
        .single();

      // Get test sessions
      const { data: sessions, error } = await supabase
        .from("test_sessions")
        .select("score_percentage, completed_at")
        .eq("student_id", user.id)
        .not("completed_at", "is", null);

      if (!error && sessions) {
        const totalTests = sessions.length;
        const averageScore = totalTests > 0
          ? sessions.reduce((sum, s) => sum + (s.score_percentage || 0), 0) / totalTests
          : 0;

        setStats({
          totalTests,
          averageScore: Math.round(averageScore),
          assignedLevel: studentDetails?.assigned_level || null,
        });
      }

      setLoading(false);
    };

    fetchStudentStats();
  }, []);

  const startTest = () => {
    navigate("/test");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTests}</div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Level</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.assignedLevel ? stats.assignedLevel.replace("level_", "Level ") : "Not Set"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-[var(--shadow-soft)]">
        <CardHeader>
          <CardTitle className="text-2xl">Ready to Start?</CardTitle>
          <CardDescription className="text-base">
            {!stats.assignedLevel
              ? "Take practice questions to determine your level"
              : "Continue your PISA assessment at your assigned level"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={startTest}
            size="lg"
            className="w-full md:w-auto"
          >
            <PlayCircle className="w-5 h-5 mr-2" />
            {!stats.assignedLevel ? "Start Practice Test" : "Continue Assessment"}
          </Button>
        </CardContent>
      </Card>

      {stats.totalTests > 0 && (
        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Track your performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You've completed {stats.totalTests} test{stats.totalTests !== 1 ? "s" : ""} with an average score of {stats.averageScore}%. Keep up the great work!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentDashboard;