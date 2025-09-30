import { Button } from "@/components/ui/button";
import { UserRole } from "@/types";

interface HeaderProps {
  user?: {
    name: string;
    course: string;
    branch: string;
    role: UserRole;
  };
  onLogout: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
  const isStudent = user?.role === 'student';
  const headerBg = isStudent ? 'bg-gradient-to-r from-student to-student-secondary' : 'bg-gradient-to-r from-admin to-admin-secondary';
  
  return (
    <header className={`${headerBg} text-white shadow-elegant transition-all duration-300`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
              <h1 className="text-2xl font-bold">EduSetu</h1>
            </div>
            {user && (
              <div className="hidden md:block">
                <p className="text-sm opacity-90">Welcome back,</p>
                <p className="font-semibold">{user.name} • {user.course} {user.role === "student" ? `(${user.branch})` : null}</p>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className="text-right hidden sm:block">
                <p className="text-sm opacity-90 capitalize">{user.role} Dashboard</p>
              </div>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={onLogout}
              className="bg-white/10 border-white/30 hover:bg-white/20 text-white hover:text-white"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;