import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Clock, Award, BookOpen, Trophy, Users, Filter } from "lucide-react";
import { useState } from "react";

interface Achievement {
  id: string;
  title: string;
  type: string;
  year: number;
  verified: boolean;
  description?: string;
}

interface AchievementsListProps {
  achievements: Achievement[];
  isAdmin?: boolean;
  isRecruiter?: boolean;
  onToggleVerification?: (achievementId: string) => void;
}

const AchievementsList = ({ achievements, isAdmin = false, isRecruiter = false, onToggleVerification }: AchievementsListProps) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'course':
        return BookOpen;
      case 'competition':
        return Trophy;
      case 'leadership':
        return Users;
      case 'certification':
        return Award;
      default:
        return Award;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'educational':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'technical':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'co-curricular':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'course':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'competition':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'leadership':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'certification':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filter achievements based on selected filter and recruiter view
  const filteredAchievements = achievements.filter(achievement => {
    // For recruiters, only show verified achievements
    if (isRecruiter && !achievement.verified) {
      return false;
    }
    
    // Filter by type
    if (selectedFilter === 'all') {
      return true;
    }
    return achievement.type.toLowerCase() === selectedFilter.toLowerCase();
  });

  return (
    <Card className="bg-gradient-card border-border hover:shadow-card transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-student" />
            <span>Achievements</span>
            <Badge variant="secondary" className="ml-2">
              {filteredAchievements.length} / {achievements.length}
            </Badge>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="educational">Educational</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="co-curricular">Co-curricular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredAchievements.map((achievement) => {
          const TypeIcon = getTypeIcon(achievement.type);
          
          return (
            <div
              key={achievement.id}
              className="flex items-start space-x-4 p-4 rounded-lg border border-border bg-white hover:shadow-sm transition-all duration-200"
            >
              <div className="flex-shrink-0">
                <div className={`p-2 rounded-lg ${getTypeColor(achievement.type)}`}>
                  <TypeIcon className="h-4 w-4" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium text-foreground truncate">
                      {achievement.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getTypeColor(achievement.type)}>
                        {achievement.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {achievement.year}
                      </span>
                    </div>
                    {achievement.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {achievement.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {achievement.verified ? (
                      <Badge className="bg-success text-white hover:bg-success/90">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-warning border-warning">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                    
                    {isAdmin && onToggleVerification && (
                      <Button
                        size="sm"
                        variant={achievement.verified ? "destructive" : "default"}
                        onClick={() => onToggleVerification(achievement.id)}
                        className="text-xs"
                      >
                        {achievement.verified ? "Unverify" : "Verify"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {filteredAchievements.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>
              {achievements.length === 0 
                ? "No achievements recorded yet" 
                : selectedFilter === 'all' 
                  ? "No verified achievements found"
                  : `No ${selectedFilter} achievements found`
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AchievementsList;