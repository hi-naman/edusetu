import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GraduationCap, X } from "lucide-react";

interface BranchFiltersProps {
  selectedBranch: string;
  selectedYear: string;
  minCGPA: string;
  maxCGPA: string;
  minAttendance: string;
  onBranchChange: (branch: string) => void;
  onYearChange: (year: string) => void;
  onMinCGPAChange: (cgpa: string) => void;
  onMaxCGPAChange: (cgpa: string) => void;
  onMinAttendanceChange: (attendance: string) => void;
  onClearFilters: () => void;
  branches: string[];
  years: string[];
}

const BranchFilters = ({
  selectedBranch,
  selectedYear,
  minCGPA,
  maxCGPA,
  minAttendance,
  onBranchChange,
  onYearChange,
  onMinCGPAChange,
  onMaxCGPAChange,
  onMinAttendanceChange,
  onClearFilters,
  branches,
  years
}: BranchFiltersProps) => {
  const hasActiveFilters = selectedBranch !== 'all' || selectedYear !== 'all' || minCGPA || maxCGPA || minAttendance;

  return (
    <Card className="bg-gradient-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="h-5 w-5 text-admin" />
            <span>Branch-wise Filters</span>
          </CardTitle>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Branch Filter */}
          <div className="space-y-2">
            <Label htmlFor="branch">Branch</Label>
            <Select value={selectedBranch} onValueChange={onBranchChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branches.map((branch) => (
                  <SelectItem key={branch} value={branch}>
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year Filter */}
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Select value={selectedYear} onValueChange={onYearChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    Year {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Min CGPA */}
          <div className="space-y-2">
            <Label htmlFor="minCgpa">Min CGPA</Label>
            <Input
              id="minCgpa"
              type="number"
              step="0.1"
              min="0"
              max="10"
              placeholder="0.0"
              value={minCGPA}
              onChange={(e) => onMinCGPAChange(e.target.value)}
            />
          </div>

          {/* Max CGPA */}
          <div className="space-y-2">
            <Label htmlFor="maxCgpa">Max CGPA</Label>
            <Input
              id="maxCgpa"
              type="number"
              step="0.1"
              min="0"
              max="10"
              placeholder="10.0"
              value={maxCGPA}
              onChange={(e) => onMaxCGPAChange(e.target.value)}
            />
          </div>

          {/* Min Attendance */}
          <div className="space-y-2">
            <Label htmlFor="minAttendance">Min Attendance (%)</Label>
            <Input
              id="minAttendance"
              type="number"
              min="0"
              max="100"
              placeholder="0"
              value={minAttendance}
              onChange={(e) => onMinAttendanceChange(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BranchFilters;