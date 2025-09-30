export type UserRole = 'student' | 'admin' | 'recruiter';

export interface Achievement {
  id: string;
  title: string;
  type: 'Educational' | 'Technical' | 'Co-curricular';
  year: number;
  verified: boolean;
  description?: string;
}

export interface Internship {
  id: string;
  company: string;
  role: string;
  duration: string;
  year: number;
  description: string;
}

export interface Research {
  id: string;
  title: string;
  conference: string;
  year: number;
  status: string;
  coAuthors: string[];
}

export interface Student {
  id: string;
  name: string;
  course: string;
  semester: number;
  cgpa: number;
  attendance: number;
  email: string;
  phone: string;
  branch: string;
  year: number;
  status: 'active' | 'disqualified';
  achievements: Achievement[];
  internships: Internship[];
  research: Research[];
  skills: string[];
  attendanceData: {
    months: string[];
    attendance: number[];
  };
}