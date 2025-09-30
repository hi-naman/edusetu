import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  UserCheck, 
  UserX,
  Shield 
} from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface StudentActionsProps {
  student: any;
  onDisqualify: (studentId: string, reason: string) => void;
  onQualify: (studentId: string) => void;
}

const StudentActions = ({ student, onDisqualify, onQualify }: StudentActionsProps) => {
  const [disqualifyReason, setDisqualifyReason] = useState('');

  const isDisqualified = student.status === 'disqualified';

  return (
    <Card className="bg-gradient-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-admin" />
          <span>Recruiter Actions</span>
          <Badge 
            variant={isDisqualified ? "destructive" : "default"}
            className={isDisqualified ? "" : "bg-success text-white"}
          >
            {isDisqualified ? (
              <>
                <XCircle className="h-3 w-3 mr-1" />
                Disqualified
              </>
            ) : (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </>
            )}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Manage student recruitment status for this position.
        </div>
        
        <div className="flex gap-2">
          {isDisqualified ? (
            <Button 
              onClick={() => onQualify(student.id)}
              variant="default"
              className="bg-success hover:bg-success/90 text-white"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Qualify Student
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <UserX className="h-4 w-4 mr-2" />
                  Disqualify Student
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <span>Disqualify Student</span>
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to disqualify <strong>{student.name}</strong> from this recruitment process? 
                    This action will remove them from the active candidate pool.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDisqualify(student.id, 'Disqualified by recruiter')}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    Disqualify
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {isDisqualified && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-destructive">Disqualified</p>
                <p className="text-muted-foreground">
                  This student has been removed from active recruitment consideration.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentActions;