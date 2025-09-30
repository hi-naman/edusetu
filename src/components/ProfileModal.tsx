import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, Mail, Phone, MapPin, Hash, GraduationCap, Calendar, TrendingUp } from "lucide-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  student: any;
}

const ProfileModal = ({ isOpen, onClose, student }: ProfileModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <div className="p-3 rounded-full bg-student/10">
              <img className="h-6 w-6 text-student" src={student.profilePicture} alt="Profile" />
            </div>
            Student Profile
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Name */}
          <ProfileField
            icon={<User className="h-5 w-5 text-student mt-0.5" />}
            label="Full Name"
            value={student.name}
          />

          {/* Student ID */}
          <ProfileField
            icon={<Hash className="h-5 w-5 text-student mt-0.5" />}
            label="Student ID"
            value={student.id}
          />

          {/* Email */}
          {student.email && (
            <ProfileField
              icon={<Mail className="h-5 w-5 text-student mt-0.5" />}
              label="Email"
              value={student.email}
            />
          )}

          {/* Phone */}
          {student.phone && (
            <ProfileField
              icon={<Phone className="h-5 w-5 text-student mt-0.5" />}
              label="Phone"
              value={student.phone}
            />
          )}

          {/* Course & Branch */}
          <ProfileField
            icon={<GraduationCap className="h-5 w-5 text-student mt-0.5" />}
            label="Course & Branch"
            value={`${student.course} - ${student.branch}`}
          />

          {/* Semester */}
          <ProfileField
            icon={<Calendar className="h-5 w-5 text-student mt-0.5" />}
            label="Current Semester"
            value={`Semester ${student.semester}`}
          />

          {/* CGPA */}
          <ProfileField
            icon={<TrendingUp className="h-5 w-5 text-student mt-0.5" />}
            label="CGPA"
            value={`${student.cgpa}/10.0`}
          />

          {/* Address */}
          {student.address && (
            <ProfileField
              icon={<MapPin className="h-5 w-5 text-student mt-0.5" />}
              label="Address"
              value={student.address}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Sub-component for profile fields
const ProfileField = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => {
  return (
    <div className="flex items-start gap-3">
      {icon}
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
};

export default ProfileModal;