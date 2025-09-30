import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';
import AchievementsList from '@/components/AchievementsList';
import BranchFilters from '@/components/BranchFilters';
import StudentActions from '@/components/StudentActions';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Trophy, 
  CheckCircle, 
  Clock, 
  Download, 
  BarChart3,
  GraduationCap,
  Building,
  Search,
  Filter,
  Code,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import mockData from '@/data/mockStudent.json';

const RecruiterPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [recruitmentType, setRecruitmentType] = useState<string>('branch');
  
  // Branch filter states
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [minCGPA, setMinCGPA] = useState<string>('');
  const [maxCGPA, setMaxCGPA] = useState<string>('');
  const [minAttendance, setMinAttendance] = useState<string>('');

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    const storedRecruitmentType = localStorage.getItem('recruitmentType') || 'branch';
    
    if (userRole !== 'recruiter') {
      navigate('/');
      return;
    }

    setRecruitmentType(storedRecruitmentType);
    setStudents(mockData.students);
    setFilteredStudents(mockData.students);
    setSelectedStudent(mockData.students[0]);
  }, [navigate]);

  // Filter students based on recruitment type and filters
  useEffect(() => {
    let filtered = students;

    if (recruitmentType === 'skill') {
      // Skill-based filtering
      if (selectedSkills.length > 0) {
        filtered = filtered.filter(student =>
          selectedSkills.every(skill =>
            student.skills.some((studentSkill: string) =>
              studentSkill.toLowerCase().includes(skill.toLowerCase())
            )
          )
        );
      }
    } else {
      // Branch-wise filtering
      if (selectedBranch !== 'all') {
        filtered = filtered.filter(student => student.branch === selectedBranch);
      }
      
      if (selectedYear !== 'all') {
        filtered = filtered.filter(student => student.year.toString() === selectedYear);
      }
      
      if (minCGPA) {
        filtered = filtered.filter(student => student.cgpa >= parseFloat(minCGPA));
      }
      
      if (maxCGPA) {
        filtered = filtered.filter(student => student.cgpa <= parseFloat(maxCGPA));
      }
      
      if (minAttendance) {
        filtered = filtered.filter(student => student.attendance >= parseInt(minAttendance));
      }
    }

    setFilteredStudents(filtered);
    if (filtered.length > 0 && !filtered.find(s => s.id === selectedStudent?.id)) {
      setSelectedStudent(filtered[0]);
    }
  }, [selectedSkills, selectedBranch, selectedYear, minCGPA, maxCGPA, minAttendance, students, selectedStudent, recruitmentType]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('recruitmentType');
    navigate('/');
  };

  // Get all unique skills from all students
  const allSkills = Array.from(new Set(students.flatMap(student => student.skills))).sort();

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSkillSearch = (query: string) => {
    setSkillSearchQuery(query);
  };

  const filteredSkills = allSkills.filter(skill =>
    skill.toLowerCase().includes(skillSearchQuery.toLowerCase())
  );

  const clearAllFilters = () => {
    if (recruitmentType === 'skill') {
      setSelectedSkills([]);
      setSkillSearchQuery('');
    } else {
      setSelectedBranch('all');
      setSelectedYear('all');
      setMinCGPA('');
      setMaxCGPA('');
      setMinAttendance('');
    }
  };

  const handleDisqualifyStudent = (studentId: string, reason: string) => {
    const updatedStudents = students.map(student =>
      student.id === studentId ? { ...student, status: 'disqualified' } : student
    );
    setStudents(updatedStudents);
    
    // Update filtered students as well
    const updatedFilteredStudents = filteredStudents.map(student =>
      student.id === studentId ? { ...student, status: 'disqualified' } : student
    );
    setFilteredStudents(updatedFilteredStudents);
    
    // Update selected student if it's the one being disqualified
    if (selectedStudent?.id === studentId) {
      setSelectedStudent({ ...selectedStudent, status: 'disqualified' });
    }

    toast({
      title: "Student Disqualified",
      description: `${selectedStudent?.name} has been disqualified from recruitment`,
    });
  };

  const handleQualifyStudent = (studentId: string) => {
    const updatedStudents = students.map(student =>
      student.id === studentId ? { ...student, status: 'active' } : student
    );
    setStudents(updatedStudents);
    
    // Update filtered students as well
    const updatedFilteredStudents = filteredStudents.map(student =>
      student.id === studentId ? { ...student, status: 'active' } : student
    );
    setFilteredStudents(updatedFilteredStudents);
    
    // Update selected student if it's the one being qualified
    if (selectedStudent?.id === studentId) {
      setSelectedStudent({ ...selectedStudent, status: 'active' });
    }

    toast({
      title: "Student Qualified",
      description: `${selectedStudent?.name} has been qualified for recruitment`,
    });
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
    setFilteredStudents(updatedStudents.filter(student =>
      selectedSkills.length === 0 || selectedSkills.every(skill =>
        student.skills.some((studentSkill: string) =>
          studentSkill.toLowerCase().includes(skill.toLowerCase())
        )
      )
    ));

    const achievement = selectedStudent.achievements.find((a: any) => a.id === achievementId);
    const newStatus = !achievement.verified ? 'verified' : 'pending';
    
    toast({
      title: "Achievement Updated",
      description: `${achievement.title} has been marked as ${newStatus}`,
    });
  };

  const exportNAACReport = () => {
    try {
      const studentsToExport = recruitmentType === 'skill' ? filteredStudents : students;
      const csvData = [
        ['Student ID', 'Name', 'Course', 'CGPA', 'Attendance %', 'Total Achievements', 'Verified Achievements', 'Internships', 'Research Papers', 'Skills'],
        ...studentsToExport.map(student => [
          student.id,
          student.name,
          student.course,
          student.cgpa,
          student.attendance,
          student.achievements.length,
          student.achievements.filter((a: any) => a.verified).length,
          student.internships.length,
          student.research.length,
          student.skills.join('; ')
        ])
      ];

      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const reportName = recruitmentType === 'skill' 
        ? `Skill_Based_Report_${selectedSkills.join('_') || 'All'}.csv`
        : 'NAAC_Student_Report.csv';
      link.download = reportName;
      link.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Report Exported",
        description: `${recruitmentType === 'skill' ? 'Skill-based' : 'NAAC'} report has been downloaded successfully`,
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
          <p className="text-muted-foreground">Loading recruiter panel...</p>
        </div>
      </div>
    );
  }

  const displayStudents = filteredStudents;
  
  // Get unique branches and years for filters
  const allBranches = Array.from(new Set(students.map(student => student.branch))).sort();
  const allYears = Array.from(new Set(students.map(student => student.year.toString()))).sort();
  const totalAchievements = displayStudents.reduce((sum, student) => sum + student.achievements.length, 0);
  const verifiedAchievements = displayStudents.reduce((sum, student) => 
    sum + student.achievements.filter((a: any) => a.verified).length, 0
  );
  const averageCGPA = displayStudents.length > 0 
    ? (displayStudents.reduce((sum, student) => sum + student.cgpa, 0) / displayStudents.length).toFixed(2)
    : '0.00';
  const averageAttendance = displayStudents.length > 0 
    ? Math.round(displayStudents.reduce((sum, student) => sum + student.attendance, 0) / displayStudents.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-admin-accent/5 to-admin-secondary/10">
      <Header 
        user={{
          name: "Recruiter",
          course: "Recruiter Panel",
          role: 'admin'
        }}
        onLogout={handleLogout}
      />
      
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {recruitmentType === 'skill' ? 'Skill-based' : 'Branch-wise'} Recruitment Dashboard 📊
            </h1>
            <p className="text-muted-foreground">
              {recruitmentType === 'skill' 
                ? `Filter students by technical skills ${selectedSkills.length > 0 ? `• ${selectedSkills.length} skills selected` : ''}`
                : `Filter students by branch, CGPA, and year ${selectedBranch !== 'all' || selectedYear !== 'all' || minCGPA || maxCGPA || minAttendance ? '• Filters active' : ''}`
              }
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/recruiter/selection')}
              className="border-admin text-admin hover:bg-admin/10"
            >
              <Filter className="mr-2 h-4 w-4" />
              Switch Mode
            </Button>
            <Button onClick={exportNAACReport} className="bg-admin hover:bg-admin/90 text-white">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Filter Sections */}
        {recruitmentType === 'skill' ? (
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5 text-admin" />
                  <span>Skill Filters</span>
                </CardTitle>
                {selectedSkills.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearAllFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear All ({selectedSkills.length})
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search skills..."
                  value={skillSearchQuery}
                  onChange={(e) => handleSkillSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {selectedSkills.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Selected Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map(skill => (
                      <Badge 
                        key={skill}
                        variant="default"
                        className="bg-admin text-white cursor-pointer hover:bg-admin/80"
                        onClick={() => handleSkillToggle(skill)}
                      >
                        {skill}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Available Skills ({filteredSkills.length}):
                </p>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {filteredSkills.map(skill => (
                    <Badge
                      key={skill}
                      variant={selectedSkills.includes(skill) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        selectedSkills.includes(skill)
                          ? 'bg-admin text-white'
                          : 'hover:bg-admin/10 hover:border-admin'
                      }`}
                      onClick={() => handleSkillToggle(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <BranchFilters
            selectedBranch={selectedBranch}
            selectedYear={selectedYear}
            minCGPA={minCGPA}
            maxCGPA={maxCGPA}
            minAttendance={minAttendance}
            onBranchChange={setSelectedBranch}
            onYearChange={setSelectedYear}
            onMinCGPAChange={setMinCGPA}
            onMaxCGPAChange={setMaxCGPA}
            onMinAttendanceChange={setMinAttendance}
            onClearFilters={clearAllFilters}
            branches={allBranches}
            years={allYears}
          />
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title={recruitmentType === 'skill' ? "Filtered Students" : "Total Students"}
            value={displayStudents.length}
            subtitle={recruitmentType === 'skill' && students.length !== displayStudents.length 
              ? `of ${students.length} total` 
              : undefined}
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
          <Card className="bg-gradient-card border-border hover:shadow-card transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-admin" />
                <span>Students</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {displayStudents.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No students match the selected skills</p>
                  <Button 
                    variant="outline" 
                    onClick={clearAllFilters}
                    className="mt-2"
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                displayStudents.map((student) => (
                <div
                  key={student.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedStudent?.id === student.id
                      ? 'border-admin bg-admin-accent'
                      : 'border-border bg-white hover:border-admin/50'
                  }`}
                  onClick={() => setSelectedStudent(student)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-foreground">{student.name}</h3>
                        <Badge 
                          variant={student.status === 'disqualified' ? "destructive" : "default"}
                          className={`text-xs ${student.status === 'disqualified' ? '' : 'bg-success text-white'}`}
                        >
                          {student.status === 'disqualified' ? 'Disqualified' : 'Active'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{student.course}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          CGPA: {student.cgpa}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {student.attendance}% attendance
                        </Badge>
                        {recruitmentType === 'branch' && (
                          <Badge variant="outline" className="text-xs">
                            Year {student.year}
                          </Badge>
                        )}
                      </div>
                      {recruitmentType === 'skill' && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {student.skills.slice(0, 3).map((skill: string) => (
                            <Badge 
                              key={skill} 
                              variant="secondary" 
                              className={`text-xs ${selectedSkills.includes(skill) ? 'bg-admin/20 text-admin border-admin' : ''}`}
                            >
                              {skill}
                            </Badge>
                          ))}
                          {student.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{student.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
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
              ))
              )}
            </CardContent>
          </Card>

          {/* Student Details */}
          <div className="lg:col-span-2 space-y-6">
            {selectedStudent && (
              <>
                {/* Student Overview */}
                <Card className="bg-gradient-card border-border hover:shadow-card transition-all duration-300">
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
                    
                    {/* Skills Section */}
                    {selectedStudent.skills && selectedStudent.skills.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-muted-foreground mb-2">Technical Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedStudent.skills.map((skill: string) => (
                            <Badge 
                              key={skill}
                              variant={selectedSkills.includes(skill) ? "default" : "outline"}
                              className={`text-xs ${
                                selectedSkills.includes(skill) 
                                  ? 'bg-admin text-white' 
                                  : 'hover:bg-admin/10'
                              }`}
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
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
                  isAdmin={false}
                  isRecruiter={true}
                  onToggleVerification={handleToggleVerification}
                />

                {/* Student Actions */}
                <StudentActions
                  student={selectedStudent}
                  onDisqualify={handleDisqualifyStudent}
                  onQualify={handleQualifyStudent}
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

export default RecruiterPanel;