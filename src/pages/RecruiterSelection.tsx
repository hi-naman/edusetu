import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, GraduationCap, ArrowLeft } from "lucide-react";

const RecruiterSelection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    
    if (userRole !== 'recruiter') {
      navigate('/');
      return;
    }
  }, [navigate]);

  const handleBack = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUserId');
    navigate('/');
  };

  const handleSelection = (type: 'skill' | 'branch') => {
    // Store recruitment type for the recruiter panel
    localStorage.setItem('recruitmentType', type);
    navigate('/recruiter/panel');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-admin-accent/5 to-admin-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-white/80 backdrop-blur-sm shadow-elegant border-0">
        <CardHeader className="text-center space-y-4 pb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="absolute top-4 left-4 text-muted-foreground :text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
          
          <div className="mx-auto bg-gradient-to-r from-admin to-admin-secondary p-4 rounded-2xl w-fit">
            <Users className="h-12 w-12 text-white" />
          </div>
          <div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-admin to-admin-secondary bg-clip-text text-transparent">
              Recruitment Dashboard
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              Choose your recruitment approach to access relevant student data
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Skill-based Recruitment */}
            <Card className="group :shadow-lg transition-all duration-300 :scale-105 cursor-pointer border-admin-accent/20 :border-admin-accent/40">
              <CardContent className="p-8 text-center space-y-6">
                <div className="mx-auto bg-admin-accent p-6 rounded-full w-fit group-:bg-admin-secondary transition-colors">
                  <Target className="h-10 w-10 text-admin" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-foreground">Skill-based Recruitment</h3>
                  <p className="text-muted-foreground mt-3 leading-relaxed">
                    Filter and discover students based on specific technical skills, certifications, 
                    project experience, and achievement categories. Perfect for role-specific hiring.
                  </p>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>✓ Filter by programming languages</p>
                  <p>✓ Sort by project complexity</p>
                  <p>✓ View skill certifications</p>
                  <p>✓ Achievement-based matching</p>
                </div>
                <Button
                  onClick={() => handleSelection('skill')}
                  className="w-full bg-admin :bg-admin/90 text-white"
                  size="lg"
                >
                  <Target className="mr-2 h-5 w-5" />
                  Access Skill-based View
                </Button>
              </CardContent>
            </Card>

            {/* Branch-wise Recruitment */}
            <Card className="group :shadow-lg transition-all duration-300 :scale-105 cursor-pointer border-admin-accent/20 :border-admin-accent/40">
              <CardContent className="p-8 text-center space-y-6">
                <div className="mx-auto bg-admin-accent p-6 rounded-full w-fit group-:bg-admin-secondary transition-colors">
                  <GraduationCap className="h-10 w-10 text-admin" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-foreground">Branch-wise Recruitment</h3>
                  <p className="text-muted-foreground mt-3 leading-relaxed">
                    Explore students organized by their academic branches and specializations. 
                    Ideal for campus recruitment and department-specific hiring needs.
                  </p>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>✓ Browse by academic department</p>
                  <p>✓ Compare CGPA and attendance</p>
                  <p>✓ View branch-specific projects</p>
                  <p>✓ Bulk student analysis</p>
                </div>
                <Button
                  onClick={() => handleSelection('branch')}
                  className="w-full bg-admin :bg-admin/90 text-white"
                  size="lg"
                >
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Access Branch-wise View
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <h4 className="font-semibold text-center text-foreground">Recruiter Features</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <Users className="h-6 w-6 mx-auto text-admin" />
                <p className="text-xs text-muted-foreground">Student Analytics</p>
              </div>
              <div className="space-y-2">
                <Target className="h-6 w-6 mx-auto text-admin" />
                <p className="text-xs text-muted-foreground">Achievement Verification</p>
              </div>
              <div className="space-y-2">
                <GraduationCap className="h-6 w-6 mx-auto text-admin" />
                <p className="text-xs text-muted-foreground">NAAC Reports</p>
              </div>
              <div className="space-y-2">
                <Users className="h-6 w-6 mx-auto text-admin" />
                <p className="text-xs text-muted-foreground">Bulk Export</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruiterSelection;