import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileQuestion, BarChart3, Plus } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Registered students</p>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions</CardTitle>
            <FileQuestion className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">In question bank</p>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tests</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Total assessments</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle>Question Management</CardTitle>
            <CardDescription>Add and manage assessment questions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add New Question
            </Button>
            <Button className="w-full" variant="outline">
              <FileQuestion className="w-4 h-4 mr-2" />
              View All Questions
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle>Analytics & Reports</CardTitle>
            <CardDescription>View student performance data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Class Performance
            </Button>
            <Button className="w-full" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Student Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-[var(--shadow-soft)]">
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Set up your PISA platform</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Add questions to the question bank (practice and assessment questions)</li>
            <li>Students will register and complete practice questions</li>
            <li>System assigns difficulty level based on practice performance</li>
            <li>Students complete their assigned level assessment</li>
            <li>Review analytics and student performance data</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;