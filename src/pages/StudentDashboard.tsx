import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';
import AchievementsList from '@/components/AchievementsList';
import ChartAttendance from '@/components/ChartAttendance';
import PortfolioButton from '@/components/PortfolioButton';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Trophy, TrendingUp, Calendar, Building, FileText, Users, User } from "lucide-react";
import mockData from '@/data/mockStudent.json';
import { Button } from 'react-day-picker';
import ProfileModal from '@/components/ProfileModal';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);


  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('currentUserId');

    if (userRole !== 'student') {
      navigate('/');
      return;
    }

    const studentData = mockData.students.find(s => s.id === userId) || mockData.students[0];
    setStudent(studentData);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUserId');
    navigate('/');
  };

  if (!student) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-student border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const verifiedAchievements = student.achievements.filter((a: any) => a.verified).length;
  const pendingAchievements = student.achievements.length - verifiedAchievements;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-student-accent/5 to-student-secondary/10">
      <Header
        user={{
          name: student.name,
          course: student.course,
          branch: student.branch,
          role: 'student'
        }}
        onLogout={handleLogout}
      />

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {student.name.split(' ')[0]} !</h1>
          <button
              onClick={() => setIsProfileOpen(true)}
              className="p-2 rounded-full bg-student/10 hover:bg-student/20 transition-colors duration-200 group"
              aria-label="View Profile"
            >
              <User className="h-6 w-6 text-student group-hover:scale-110 transition-transform duration-200" />
            </button>
          <p className="text-muted-foreground">Here's your academic progress overview</p>
        </div> 
        <ProfileModal isOpen={isProfileOpen} onClose={setIsProfileOpen} student={student} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Current CGPA"
            value={student.cgpa}
            subtitle="/10.0"
            icon={GraduationCap}
            variant="student"
            trend={{ value: 0.3, isPositive: true }}
          />
          <StatsCard
            title="Attendance"
            value={`${student.attendance}%`}
            icon={Calendar}
            variant="student"
            trend={{ value: 2, isPositive: true }}
          />
          <StatsCard
            title="Achievements"
            value={student.achievements.length}
            subtitle={`${verifiedAchievements} verified`}
            icon={Trophy}
            variant="student"
          />
          <StatsCard
            title="Semester"
            value={student.semester}
            subtitle={`of ${student.course}`}
            icon={TrendingUp}
            variant="student"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Achievements */}
          <div className="lg:col-span-2 space-y-6">
            <AchievementsList achievements={student.achievements} />

            {/* Internships Section */}
            {student.internships.length > 0 && (
              <Card className="bg-gradient-card border-border hover:shadow-card transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-student" />
                    <span>Internships</span>
                    <Badge variant="secondary" className="ml-auto">
                      {student.internships.length} Total
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {student.internships.map((internship: any) => (
                    <div key={internship.id} className="p-4 rounded-lg border border-border bg-white">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-foreground">{internship.role}</h3>
                          <p className="text-student font-medium">{internship.company}</p>
                          <p className="text-sm text-muted-foreground mt-1">{internship.description}</p>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <p>{internship.duration}</p>
                          <p>{internship.year}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center font-semibold text-sm text-foreground cursor-pointer hover:underline">+ Add Internship</div>
                </CardContent>
              </Card>
            )}

            {/* Research Papers Section */}
            {student.research.length > 0 && (
              <Card className="bg-gradient-card border-border hover:shadow-card transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-student" />
                    <span>Research Publications</span>
                    <Badge variant="secondary" className="ml-auto">
                      {student.research.length} Total
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {student.research.map((paper: any) => (
                    <div key={paper.id} className="p-4 rounded-lg border border-border bg-white">
                      <h3 className="font-medium text-foreground">{paper.title}</h3>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{paper.conference}</span>
                        <span>•</span>
                        <span>{paper.year}</span>
                        <span>•</span>
                        <Badge className="bg-success text-white">{paper.status}</Badge>
                      </div>
                      {paper.coAuthors && (
                        <div className="mt-2 flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Co-authors: {paper.coAuthors.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="text-center font-semibold text-sm text-foreground cursor-pointer hover:underline">+ Add Research Paper</div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Chart & Actions */}
          <div className="space-y-6">
            <ChartAttendance data={student.attendanceData} variant="student" />

            {/* Gradesheet */}
            <Card className="bg-gradient-card border-border hover:shadow-card transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-student" />
                  <span>Gradesheet</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Generate your semester-wise gradesheet in PDF format.
                </p>
                <button onClick={() => alert('Feature coming soon!')} className="h-11 rounded-md px-8 bg-student hover:bg-student/90 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  Generate Gradesheet
                </button>
              </CardContent>
            </Card>

            {/* Gradesheet */}
            <Card className="bg-gradient-card border-border hover:shadow-card transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-student" />
                  <span>Active Backlogs</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You have {student.backlogs} active backlogs.{student.backlogs>0 ? " Focus on clearing them to improve your academic standing." : " Great job maintaining a clean academic record!"}
                </p>
              </CardContent>
            </Card>

            {/* Skills Section */}
            <Card className="bg-gradient-card border-border hover:shadow-card transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-student" />
                  <span>Skills</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {student.skills.map((skill: string) => (
                    <Badge key={skill} variant="outline" className="border-student text-student">
                      {skill}
                    </Badge>
                  ))}
                  <Badge onClick={() => alert('Feature coming soon!')} variant="outline" className="border-student text-student cursor-pointer hover:bg-blue-500 hover:text-white">
                    + Add Skill
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Generation */}
            <Card className="bg-gradient-card border-border hover:shadow-card transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-student" />
                  <span>Portfolio</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Generate a comprehensive PDF portfolio with all your achievements, internships, and academic records.
                </p>
                <PortfolioButton student={student} variant="student" />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;