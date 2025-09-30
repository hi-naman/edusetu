import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: string;
  name: string;
  course: string;
  semester: number;
  cgpa: number;
  attendance: number;
  email: string;
  phone: string;
  achievements: any[];
  internships: any[];
  research: any[];
  skills: string[];
}

interface PortfolioButtonProps {
  student: Student;
  variant?: 'student' | 'admin';
}

const PortfolioButton = ({ student, variant = 'student' }: PortfolioButtonProps) => {
  const { toast } = useToast();

  const generatePDF = async () => {
    try {
      toast({
        title: "Generating Portfolio",
        description: "Please wait while we create your PDF portfolio...",
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      let yPosition = 30;

      // Header
      pdf.setFontSize(24);
      pdf.setTextColor(37, 99, 235); // student primary color
      pdf.text('Student Portfolio', margin, yPosition);
      
      yPosition += 15;
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${student.name} - ${student.course}`, margin, yPosition);

      // Personal Information
      yPosition += 20;
      pdf.setFontSize(14);
      pdf.setTextColor(75, 85, 99);
      pdf.text('Personal Information', margin, yPosition);
      
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Email: ${student.email}`, margin, yPosition);
      
      yPosition += 6;
      pdf.text(`Phone: ${student.phone}`, margin, yPosition);
      
      yPosition += 6;
      pdf.text(`Semester: ${student.semester}`, margin, yPosition);
      
      yPosition += 6;
      pdf.text(`CGPA: ${student.cgpa}`, margin, yPosition);
      
      yPosition += 6;
      pdf.text(`Attendance: ${student.attendance}%`, margin, yPosition);

      // Skills
      yPosition += 15;
      pdf.setFontSize(14);
      pdf.setTextColor(75, 85, 99);
      pdf.text('Skills', margin, yPosition);
      
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      const skillsText = student.skills.join(', ');
      const skillsLines = pdf.splitTextToSize(skillsText, pageWidth - 2 * margin);
      pdf.text(skillsLines, margin, yPosition);
      yPosition += skillsLines.length * 6;

      // Achievements
      yPosition += 10;
      pdf.setFontSize(14);
      pdf.setTextColor(75, 85, 99);
      pdf.text('Achievements', margin, yPosition);
      
      student.achievements.forEach((achievement, index) => {
        yPosition += 10;
        if (yPosition > 270) { // New page if needed
          pdf.addPage();
          yPosition = 30;
        }
        
        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${index + 1}. ${achievement.title}`, margin, yPosition);
        
        yPosition += 6;
        pdf.setFontSize(10);
        pdf.setTextColor(100, 116, 139);
        pdf.text(`   Type: ${achievement.type} | Year: ${achievement.year} | Status: ${achievement.verified ? 'Verified' : 'Pending'}`, margin, yPosition);
        
        if (achievement.description) {
          yPosition += 6;
          const descLines = pdf.splitTextToSize(`   ${achievement.description}`, pageWidth - 2 * margin);
          pdf.text(descLines, margin, yPosition);
          yPosition += descLines.length * 5;
        }
      });

      // Internships
      if (student.internships.length > 0) {
        yPosition += 15;
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 30;
        }
        
        pdf.setFontSize(14);
        pdf.setTextColor(75, 85, 99);
        pdf.text('Internships', margin, yPosition);
        
        student.internships.forEach((internship, index) => {
          yPosition += 10;
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 30;
          }
          
          pdf.setFontSize(11);
          pdf.setTextColor(0, 0, 0);
          pdf.text(`${index + 1}. ${internship.role} at ${internship.company}`, margin, yPosition);
          
          yPosition += 6;
          pdf.setFontSize(10);
          pdf.setTextColor(100, 116, 139);
          pdf.text(`   Duration: ${internship.duration} | Year: ${internship.year}`, margin, yPosition);
          
          if (internship.description) {
            yPosition += 6;
            const descLines = pdf.splitTextToSize(`   ${internship.description}`, pageWidth - 2 * margin);
            pdf.text(descLines, margin, yPosition);
            yPosition += descLines.length * 5;
          }
        });
      }

      // Research Papers
      if (student.research.length > 0) {
        yPosition += 15;
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 30;
        }
        
        pdf.setFontSize(14);
        pdf.setTextColor(75, 85, 99);
        pdf.text('Research Publications', margin, yPosition);
        
        student.research.forEach((paper, index) => {
          yPosition += 10;
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 30;
          }
          
          pdf.setFontSize(11);
          pdf.setTextColor(0, 0, 0);
          pdf.text(`${index + 1}. ${paper.title}`, margin, yPosition);
          
          yPosition += 6;
          pdf.setFontSize(10);
          pdf.setTextColor(100, 116, 139);
          pdf.text(`   Conference: ${paper.conference} | Year: ${paper.year} | Status: ${paper.status}`, margin, yPosition);
          
          if (paper.coAuthors) {
            yPosition += 6;
            pdf.text(`   Co-authors: ${paper.coAuthors.join(', ')}`, margin, yPosition);
          }
        });
      }

      // Footer
      const totalPages = (pdf as any).internal.pages.length - 1; // Fix for jsPDF type issue
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Generated by Smart Student Hub - Page ${i} of ${totalPages}`, margin, pdf.internal.pageSize.getHeight() - 10);
      }

      // Save the PDF
      pdf.save(`${student.name}_Portfolio.pdf`);
      
      toast({
        title: "Portfolio Generated!",
        description: "Your PDF portfolio has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate portfolio. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={generatePDF}
      className={`${variant === 'student' ? 'bg-student hover:bg-student/90' : 'bg-admin hover:bg-admin/90'} text-white shadow-lg hover:shadow-xl transition-all duration-300`}
      size="lg"
    >
      <Download className="mr-2 h-4 w-4" />
      Generate Portfolio PDF
    </Button>
  );
};

export default PortfolioButton;