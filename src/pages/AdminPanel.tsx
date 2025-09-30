import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';
import AchievementsList from '@/components/AchievementsList';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Trophy, 
  CheckCircle, 
  Clock, 
  Download, 
  BarChart3,
  GraduationCap,
  Building
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import mockData from '@/data/mockStudent.json';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    
    if (userRole !== 'admin') {
      navigate('/');
      return;
    }

    setStudents(mockData.students);
    setSelectedStudent(mockData.students[0]);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUserId');
    navigate('/');
  };

  const handleToggleVerification = (achievementId: string) => {
    if (!selectedStudent) return;

    const updatedStudent = {
      ...selectedStudent,
      achievements: selectedStudent.achievements.map((achievement: any) =>
        achievement.id === achievementId
          ? { ...achievement, verified: !achievement.verified }
          : achievement
      )
    };

    setSelectedStudent(updatedStudent);
    
    const updatedStudents = students.map(student =>
      student.id === selectedStudent.id ? updatedStudent : student
    );
    setStudents(updatedStudents);

    const achievement = selectedStudent.achievements.find((a: any) => a.id === achievementId);
    const newStatus = !achievement.verified ? 'verified' : 'pending';
    
    toast({
      title: "Achievement Updated",
      description: `${achievement.title} has been marked as ${newStatus}`,
    });
  };

  const exportNAACReport = () => {
    try {
      const csvData = [
        ['Student ID', 'Name', 'Course', 'CGPA', 'Attendance %', 'Total Achievements', 'Verified Achievements', 'Internships', 'Research Papers'],
        ...students.map(student => [
          student.id,
          student.name,
          student.course,
          student.cgpa,
          student.attendance,
          student.achievements.length,
          student.achievements.filter((a: any) => a.verified).length,
          student.internships.length,
          student.research.length
        ])
      ];

      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'NAAC_Student_Report.csv';
      link.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Report Exported",
        description: "NAAC report has been downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export report. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (students.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-admin border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const totalAchievements = students.reduce((sum, student) => sum + student.achievements.length, 0);
  const verifiedAchievements = students.reduce((sum, student) => 
    sum + student.achievements.filter((a: any) => a.verified).length, 0
  );
  const averageCGPA = (students.reduce((sum, student) => sum + student.cgpa, 0) / students.length).toFixed(2);
  const averageAttendance = Math.round(students.reduce((sum, student) => sum + student.attendance, 0) / students.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-admin-accent/5 to-admin-secondary/10">
      <Header 
        user={{
          name: "Administrator",
          course: "Admin Panel",
          role: 'admin'
        }}
        onLogout={handleLogout}
      />
      
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage student data and verify achievements</p>
          </div>
          <Button onClick={exportNAACReport} className="bg-admin hov:bg-admin/90 text-white">
            <Download className="mr-2 h-4 w-4" />
            Export NAAC Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Students"
            value={students.length}
            icon={Users}
            variant="admin"
          />
          <StatsCard
            title="Average CGPA"
            value={averageCGPA}
            subtitle="/10.0"
            icon={GraduationCap}
            variant="admin"
          />
          <StatsCard
            title="Average Attendance"
            value={`${averageAttendance}%`}
            icon={BarChart3}
            variant="admin"
          />
          <StatsCard
            title="Achievements"
            value={totalAchievements}
            subtitle={`${verifiedAchievements} verified`}
            icon={Trophy}
            variant="admin"
          />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Students List */}
          <Card className="bg-gradient-card border-border her:shadow-card transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-admin" />
                <span>Students</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {students.map((student) => (
                <div
                  key={student.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedStudent?.id === student.id
                      ? 'border-admin bg-admin-accent'
                      : 'border-border bg-white hor:border-admin/50'
                  }`}
                  onClick={() => setSelectedStudent(student)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">{student.course}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          CGPA: {student.cgpa}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {student.attendance}% attendance
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-muted-foreground">Sem {student.semester}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Trophy className="h-3 w-3 text-admin" />
                        <span className="text-xs">{student.achievements.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Student Details */}
          <div className="lg:col-span-2 space-y-6">
            {selectedStudent && (
              <>
                {/* Student Overview */}
                <Card className="bg-gradient-card border-border hov:shadow-card transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="h-5 w-5 text-admin" />
                        <span>{selectedStudent.name}</span>
                      </div>
                      <Badge variant="outline" className="border-admin text-admin">
                        {selectedStudent.id}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Course</p>
                        <p className="font-medium">{selectedStudent.course}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Semester</p>
                        <p className="font-medium">{selectedStudent.semester}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">CGPA</p>
                        <p className="font-medium">{selectedStudent.cgpa}/10.0</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Attendance</p>
                        <p className="font-medium">{selectedStudent.attendance}%</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-admin">{selectedStudent.achievements.length}</p>
                        <p className="text-xs text-muted-foreground">Achievements</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-admin">{selectedStudent.internships.length}</p>
                        <p className="text-xs text-muted-foreground">Internships</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-admin">{selectedStudent.research.length}</p>
                        <p className="text-xs text-muted-foreground">Research</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Achievements Management */}
                <AchievementsList 
                  achievements={selectedStudent.achievements}
                  isAdmin={true}
                  onToggleVerification={handleToggleVerification}
                />

                {/* Additional Info */}
                {(selectedStudent.internships.length > 0 || selectedStudent.research.length > 0) && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {selectedStudent.internships.length > 0 && (
                      <Card className="bg-gradient-card border-border">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Building className="h-5 w-5 text-admin" />
                            <span>Internships</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {selectedStudent.internships.map((internship: any) => (
                            <div key={internship.id} className="p-3 bg-white rounded border border-border">
                              <p className="font-medium text-sm">{internship.role}</p>
                              <p className="text-admin text-sm">{internship.company}</p>
                              <p className="text-xs text-muted-foreground">{internship.duration} • {internship.year}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    {selectedStudent.research.length > 0 && (
                      <Card className="bg-gradient-card border-border">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <BarChart3 className="h-5 w-5 text-admin" />
                            <span>Research</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {selectedStudent.research.map((paper: any) => (
                            <div key={paper.id} className="p-3 bg-white rounded border border-border">
                              <p className="font-medium text-sm">{paper.title}</p>
                              <p className="text-admin text-sm">{paper.conference}</p>
                              <p className="text-xs text-muted-foreground">{paper.year} • {paper.status}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;