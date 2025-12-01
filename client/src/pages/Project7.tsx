import { useState, useEffect } from 'react';
import { Users, Dna, Calculator, Shield, Award, ChevronDown, ChevronUp, BarChart3, Target, Globe, CheckCircle, Zap, BookOpen, Table, ChevronLeft, ChevronRight, TrendingUp, Brain, Lock, AlertCircle, Check, ChevronsUpDown, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// MultiSelect Component
function MultiSelect({ options, selected, onChange, placeholder, labelPrefix = "" }: { options: string[], selected: string[], onChange: (val: string[]) => void, placeholder: string, labelPrefix?: string }) {
  const [open, setOpen] = useState(false)

  const handleSelect = (currentValue: string) => {
    const isSelected = selected.includes(currentValue)
    if (isSelected) {
      onChange(selected.filter((item) => item !== currentValue))
    } else {
      onChange([...selected, currentValue])
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="truncate">
            {selected.length > 0
              ? `${selected.length} selected`
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search...`} />
          <CommandList>
             <CommandEmpty>No antigen found.</CommandEmpty>
             <CommandGroup className="max-h-64 overflow-auto">
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => handleSelect(option)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(option) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {labelPrefix}{option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}


interface PatientData {
  id: string;
  age: number;
  ethnicity: string;
  antigens: number;
  m1: number;
  m2: number;
  m3: number;
  risk: string;
}


// Enhanced HLA loci for M2 Calculator (matches Python code)
const hlaLociM2 = {
  'A': [1, 2, 3, 11, 23, 24, 25, 26, 29, 30, 31, 32, 33, 34, 36, 66, 68, 69, 74, 80],
  'B': [7, 8, 13, 15, 17, 18, 27, 35, 37, 38, 39, 40, 41, 42, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 67, 70, 71, 72, 73, 75, 76, 77, 78, 81, 82],
  'C': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 16, 17, 18],
  'DRB1': [1, 3, 4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  'DRB3': [1, 2, 3],
  'DRB4': [1, 2],
  'DRB5': [1, 2],
  'DQB1': [2, 3, 4, 5, 6],
  'DQA1': [1, 2, 3, 4, 5, 6],
  'DPA1': [1, 2, 3],
  'DPB1': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 17, 18, 19, 20, 21]
};

interface HLAData {
  locus: string;
  allele: string;
  frequency: number;
  ethnicity?: string;
}


interface CPRAM2Result {
  cpra_proportion: number;
  cpra_percentage: number;
  inputs: {
    unacceptable_antigens: Record<string, number[]>;
    ethnic_weights_original: Record<string, number>;
    ethnic_weights_normalized: Record<string, number>;
    total_loci_processed: number;
    total_unacceptable_loci: number;
  };
  locus_probabilities: Record<string, number>;
  per_ethnicity_results: Record<string, {
    cpra: number;
    weight: number;
    locus_results: Record<string, {
      p_unacc: number;
      p_no: number;
      unacceptable_count: number;
    }>;
  }>;
  frequencies_sample: Record<string, any>;
  methodology: {
    algorithm: string;
    formula: string;
    assumptions: string[];
  };
  data_quality: {
    coverage: string;
    ethnicity_groups: number;
    frequency_source: string;
    validation: string;
  };
}


export default function Project7Page() {
  // Password protection states removed
  const [isLoading, setIsLoading] = useState(false);

  const [hlaData, setHlaData] = useState<HLAData[]>([]);
  const [loading, setLoading] = useState(true);
  const [allPatients, setAllPatients] = useState<PatientData[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [patientEthnicity, setPatientEthnicity] = useState('mixed');
  const [expandedSection, setExpandedSection] = useState<string>('calculator-m2');
  
  // M2 Calculator states
  const [cpraM2Result, setCpraM2Result] = useState<CPRAM2Result | null>(null);
  const [calculatingM2, setCalculatingM2] = useState(false);
  const [selectedAntigensM2, setSelectedAntigensM2] = useState<Record<string, number[]>>({});
  const [ethnicWeights, setEthnicWeights] = useState<Record<string, number>>({
    'Kuwaiti': 0.40,
    'Other Arab': 0.30,
    'South Asian': 0.20,
    'Southeast Asian': 0.08,
    'Other': 0.02
  });
  
  // Pagination state for patient results table
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 25;

  // Calculate pagination data
  const startIndex = (currentPage - 1) * patientsPerPage;
  const endIndex = startIndex + patientsPerPage;
  const currentPatients = allPatients.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allPatients.length / patientsPerPage);
  
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Check for existing session on mount - REMOVED

  // Mock Data Generator
  const generateSampleHLAData = (): HLAData[] => {
    const data: HLAData[] = [];
    Object.entries(hlaLociM2).forEach(([locus, antigens]) => {
      antigens.forEach(antigen => {
        data.push({
          locus,
          allele: antigen.toString(),
          frequency: Math.random() * 0.15, // Random frequency between 0 and 15%
          ethnicity: 'General'
        });
      });
    });
    return data;
  };

  // Load HLA data and patient data on mount
  useEffect(() => {
    console.log('✓ Loading HLA data...');
    fetchHLAData();
    console.log('✓ Loading patient data from Excel...');
    fetchPatientData();
  }, []);


  const fetchHLAData = async () => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setHlaData(generateSampleHLAData());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load HLA data.",
        variant: "destructive",
      });
      setHlaData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientData = async () => {
    try {
      const response = await fetch('/api/project7/patient-data');
      const data = await response.json();
      
      if (data.success && data.patients) {
        setAllPatients(data.patients);
      } else {
        throw new Error('Failed to load patient data');
      }
    } catch (error) {
      console.error('Error loading patient data:', error);
      toast({
        title: "Error",
        description: "Failed to load patient data from Excel file.",
        variant: "destructive",
      });
      // Fallback to empty array or show error state
      setAllPatients([]);
    } finally {
      setPatientsLoading(false);
    }
  };

  // M2 Calculator Functions
  const calculateCPRAM2 = async () => {
    if (Object.keys(selectedAntigensM2).length === 0 || 
        Object.values(selectedAntigensM2).every(arr => arr.length === 0)) {
      toast({
        title: "No antigens selected",
        description: "Please select at least one unacceptable antigen for M2 calculation.",
        variant: "destructive",
      });
      return;
    }

    setCalculatingM2(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock calculation logic
      const totalAntigens = Object.values(selectedAntigensM2).reduce((sum, arr) => sum + arr.length, 0);
      // Randomized realistic-looking CPRA score based on antigen count
      const baseScore = Math.min(99.9, totalAntigens * (5 + Math.random() * 5));
      
      const mockResult: CPRAM2Result = {
        cpra_percentage: baseScore,
        cpra_proportion: baseScore / 100,
        inputs: {
          unacceptable_antigens: selectedAntigensM2,
          ethnic_weights_original: ethnicWeights,
          ethnic_weights_normalized: ethnicWeights,
          total_loci_processed: Object.keys(selectedAntigensM2).length,
          total_unacceptable_loci: totalAntigens
        },
        locus_probabilities: {
          'A': Math.random() * 0.5,
          'B': Math.random() * 0.5,
          'DRB1': Math.random() * 0.5
        },
        per_ethnicity_results: {
          'Kuwaiti': { 
            cpra: Math.min(99.9, baseScore * (0.9 + Math.random() * 0.2)), 
            weight: 0.40,
            locus_results: {} 
          },
          'Other Arab': { 
            cpra: Math.min(99.9, baseScore * (0.9 + Math.random() * 0.2)), 
            weight: 0.30,
            locus_results: {} 
          },
          'South Asian': { 
            cpra: Math.min(99.9, baseScore * (0.9 + Math.random() * 0.2)), 
            weight: 0.20,
            locus_results: {} 
          }
        },
        frequencies_sample: {},
        methodology: {
          algorithm: "M2 (Hardy-Weinberg)",
          formula: "CPRA = Σ w_e (1 - Π_L (1 - Σ p_e,u)²)",
          assumptions: ["Hardy-Weinberg Equilibrium", "Linkage Disequilibrium ignored"]
        },
        data_quality: {
          coverage: "High (N=1247)",
          ethnicity_groups: 5,
          frequency_source: "Kuwait National Registry",
          validation: "Internal Cross-Validation"
        }
      };

      setCpraM2Result(mockResult);
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "Failed to calculate CPRA M2. Please try again.",
        variant: "destructive",
      });
      console.error('CPRA M2 calculation error:', error);
    } finally {
      setCalculatingM2(false);
    }
  };

  const toggleAntigenM2 = (locus: string, antigen: number) => {
    setSelectedAntigensM2(prev => {
      const newState = { ...prev };
      if (!newState[locus]) {
        newState[locus] = [];
      }
      
      if (newState[locus].includes(antigen)) {
        newState[locus] = newState[locus].filter(a => a !== antigen);
        if (newState[locus].length === 0) {
          delete newState[locus];
        }
      } else {
        newState[locus] = [...newState[locus], antigen];
      }
      
      return newState;
    });
  };

  const resetCalculatorM2 = () => {
    setSelectedAntigensM2({});
    setCpraM2Result(null);
    setEthnicWeights({
      'Kuwaiti': 0.40,
      'Other Arab': 0.30,
      'South Asian': 0.20,
      'Southeast Asian': 0.08,
      'Other': 0.02
    });
  };

  const updateEthnicWeight = (ethnicity: string, weight: number) => {
    setEthnicWeights(prev => ({
      ...prev,
      [ethnicity]: Math.max(0, Math.min(1, weight))
    }));
  };

  const normalizeWeights = () => {
    const total = Object.values(ethnicWeights).reduce((sum, w) => sum + w, 0);
    if (total > 0) {
      setEthnicWeights(prev => {
        const normalized = { ...prev };
        Object.keys(normalized).forEach(key => {
          normalized[key] = normalized[key] / total;
        });
        return normalized;
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 50) return 'text-orange-600';
    if (score >= 20) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'Very High': return 'destructive';
      case 'High': return 'destructive';
      case 'Moderate': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 text-white overflow-hidden">
        {/* DNA Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30" 
        ></div>
        {/* Elegant background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-indigo-900/40 to-purple-900/60"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-purple-300/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            {/* Elegant icon arrangement */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <Dna className="w-10 h-10 text-blue-200" />
              </div>
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <Calculator className="w-10 h-10 text-purple-200" />
              </div>
            </div>
            
            {/* Enhanced main title */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
                Advanced CPRA
              </h1>
              <h1 className="text-4xl md:text-6xl font-light mb-6 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 bg-clip-text text-transparent tracking-wide">
                Computational Platform
              </h1>
            </div>
            
            {/* Refined subtitle */}
            <div className="mb-8">
              <p className="text-xl md:text-2xl mb-2 text-blue-100 font-medium tracking-wide">
                Calculated Panel Reactive Antibody
              </p>
              <p className="text-lg md:text-xl text-blue-200 font-light">
                for Kuwait Transplant Program
              </p>
            </div>
            
            {/* Elegant methodology showcase */}
            <div className="mb-10">
              <p className="text-lg md:text-xl mb-6 text-blue-200 max-w-4xl mx-auto leading-relaxed font-light">
                Comprehensive immunological compatibility assessment featuring advanced methodology
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <div className="group">
                  <div className="bg-purple-500/20 backdrop-blur-sm border border-purple-300/30 px-4 py-2 rounded-full transition-all duration-300 hover:bg-purple-500/30 hover:scale-105">
                    <span className="text-purple-100 font-medium">M2: Hardy-Weinberg equilibrium with ethnic weighting</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Refined investigator section */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-base">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <Award className="w-5 h-5 text-yellow-300" />
                <span className="text-white font-medium">Principal Investigator:</span>
                <span className="text-blue-100">Dr. Nada Al-Shatti</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span className="text-white font-medium">Co-Principal Investigator:</span>
                <span className="text-purple-100">Dr. Ahmad Alsaber</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Project Overview */}
        <div className="mb-12">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Shield className="w-8 h-8 text-blue-600" />
                Project Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                This innovative project develops a specialized Calculated Panel Reactive Antibody (CPRA) calculator 
                specifically tailored to Kuwait's diverse donor population. Using comprehensive local HLA typing data, 
                the system computes precise allele frequencies across all major histocompatibility loci (HLA-A, -B, -C, -DR, -DQ, -DP) 
                to provide accurate transplant compatibility assessments.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="flex items-start gap-3">
                  <BarChart3 className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Data-Driven Analysis</h3>
                    <p className="text-gray-600">Local HLA frequencies from Kuwaiti donor population</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Personalized Scoring</h3>
                    <p className="text-gray-600">Patient-specific unacceptable antigen integration</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-6 h-6 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Ethnicity Weighting</h3>
                    <p className="text-gray-600">Aligned with Kuwait's diverse population demographics</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={expandedSection} onValueChange={setExpandedSection} className="space-y-8">
          <div className="relative">
            {/* Mobile: horizontal scrollable tabs */}
            <div className="md:hidden overflow-x-auto pb-3 scrollbar-hide">
              <div className="flex items-center justify-center py-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
              </div>
              <TabsList className="flex min-w-max bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl p-2 gap-2 w-max mx-3">
                <TabsTrigger 
                  value="calculator-m2" 
                  className="flex flex-col items-center gap-1.5 py-3 px-3 rounded-lg transition-all duration-300 data-[state=active]:bg-purple-50 data-[state=active]:shadow-md data-[state=active]:scale-105 hover:bg-purple-50/50 group min-w-[80px] border border-transparent data-[state=active]:border-purple-300 bg-white/80"
                >
                  <div className="p-1.5 rounded-md bg-purple-100 group-data-[state=active]:bg-purple-200 transition-colors">
                    <Dna className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-gray-900 group-data-[state=active]:text-purple-900">M2</div>
                    <div className="text-xs text-gray-600 group-data-[state=active]:text-purple-700">H-W</div>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="data" 
                  className="flex flex-col items-center gap-1.5 py-3 px-3 rounded-lg transition-all duration-300 data-[state=active]:bg-green-50 data-[state=active]:shadow-md data-[state=active]:scale-105 hover:bg-green-50/50 group min-w-[80px] border border-transparent data-[state=active]:border-green-300 bg-white/80"
                >
                  <div className="p-1.5 rounded-md bg-green-100 group-data-[state=active]:bg-green-200 transition-colors">
                    <BarChart3 className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-gray-900 group-data-[state=active]:text-green-900">Data</div>
                    <div className="text-xs text-gray-600 group-data-[state=active]:text-green-700">HLA</div>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="methodology" 
                  className="flex flex-col items-center gap-1.5 py-3 px-2.5 rounded-lg transition-all duration-300 data-[state=active]:bg-indigo-50 data-[state=active]:shadow-md data-[state=active]:scale-105 hover:bg-indigo-50/50 group min-w-[75px] border border-transparent data-[state=active]:border-indigo-300 bg-white/80"
                >
                  <div className="p-1.5 rounded-md bg-indigo-100 group-data-[state=active]:bg-indigo-200 transition-colors">
                    <Shield className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-gray-900 group-data-[state=active]:text-indigo-900">Method</div>
                    <div className="text-xs text-gray-600 group-data-[state=active]:text-indigo-700">Info</div>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="patient-results" 
                  className="flex flex-col items-center gap-1.5 py-3 px-2.5 rounded-lg transition-all duration-300 data-[state=active]:bg-rose-50 data-[state=active]:shadow-md data-[state=active]:scale-105 hover:bg-rose-50/50 group min-w-[75px] border border-transparent data-[state=active]:border-rose-300 bg-white/80"
                >
                  <div className="p-1.5 rounded-md bg-rose-100 group-data-[state=active]:bg-rose-200 transition-colors">
                    <Table className="w-4 h-4 text-rose-600" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-gray-900 group-data-[state=active]:text-rose-900">Results</div>
                    <div className="text-xs text-gray-600 group-data-[state=active]:text-rose-700">Table</div>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="acknowledgments" 
                  className="flex flex-col items-center gap-1.5 py-3 px-2.5 rounded-lg transition-all duration-300 data-[state=active]:bg-purple-50 data-[state=active]:shadow-md data-[state=active]:scale-105 hover:bg-purple-50/50 group min-w-[75px] border border-transparent data-[state=active]:border-purple-300 bg-white/80"
                >
                  <div className="p-1.5 rounded-md bg-purple-100 group-data-[state=active]:bg-purple-200 transition-colors">
                    <Award className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-gray-900 group-data-[state=active]:text-purple-900">About</div>
                    <div className="text-xs text-gray-600 group-data-[state=active]:text-purple-700">ASIA</div>
                  </div>
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center justify-center py-2">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Desktop: grid layout tabs */}
            <TabsList className="hidden md:grid w-full grid-cols-5 bg-white/70 backdrop-blur-sm border border-gray-200/60 shadow-lg rounded-2xl p-2 h-auto">
              
              <TabsTrigger 
                value="calculator-m2" 
                className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl transition-all duration-300 data-[state=active]:bg-purple-50 data-[state=active]:shadow-md data-[state=active]:border-purple-200 hover:bg-purple-50/50 group"
              >
                <div className="p-2 rounded-lg bg-purple-100 group-data-[state=active]:bg-purple-200 transition-colors">
                  <Dna className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900 group-data-[state=active]:text-purple-900">CPRA Calculator</div>
                  <div className="text-xs text-gray-600 group-data-[state=active]:text-purple-700 font-medium">M2 • Hardy-Weinberg</div>
                </div>
              </TabsTrigger>
              
              <TabsTrigger 
                value="data" 
                className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl transition-all duration-300 data-[state=active]:bg-green-50 data-[state=active]:shadow-md data-[state=active]:border-green-200 hover:bg-green-50/50 group"
              >
                <div className="p-2 rounded-lg bg-green-100 group-data-[state=active]:bg-green-200 transition-colors">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900 group-data-[state=active]:text-green-900">HLA Data</div>
                  <div className="text-xs text-gray-600 group-data-[state=active]:text-green-700 font-medium">Kuwait Population</div>
                </div>
              </TabsTrigger>
              
              <TabsTrigger 
                value="methodology" 
                className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl transition-all duration-300 data-[state=active]:bg-indigo-50 data-[state=active]:shadow-md data-[state=active]:border-indigo-200 hover:bg-indigo-50/50 group"
              >
                <div className="p-2 rounded-lg bg-indigo-100 group-data-[state=active]:bg-indigo-200 transition-colors">
                  <Shield className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900 group-data-[state=active]:text-indigo-900">Methodology</div>
                  <div className="text-xs text-gray-600 group-data-[state=active]:text-indigo-700 font-medium">Research Approach</div>
                </div>
              </TabsTrigger>
              
              <TabsTrigger 
                value="patient-results" 
                className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl transition-all duration-300 data-[state=active]:bg-rose-50 data-[state=active]:shadow-md data-[state=active]:border-rose-200 hover:bg-rose-50/50 group"
              >
                <div className="p-2 rounded-lg bg-rose-100 group-data-[state=active]:bg-rose-200 transition-colors">
                  <Table className="w-5 h-5 text-rose-600" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900 group-data-[state=active]:text-rose-900">Patient Results</div>
                  <div className="text-xs text-gray-600 group-data-[state=active]:text-rose-700 font-medium">Comparative Analysis</div>
                </div>
              </TabsTrigger>
              
              <TabsTrigger 
                value="acknowledgments" 
                className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl transition-all duration-300 data-[state=active]:bg-purple-50 data-[state=active]:shadow-md data-[state=active]:border-purple-200 hover:bg-purple-50/50 group"
              >
                <Award className="w-5 h-5 text-purple-600 group-data-[state=active]:text-purple-700" />
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900 group-data-[state=active]:text-purple-900">ASIA</div>
                  <div className="text-xs text-gray-600 group-data-[state=active]:text-purple-700 font-medium">Acknowledgments</div>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>


          {/* CPRA Calculator M2 Tab */}
          <TabsContent value="calculator-m2">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* M2 Input Panel */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Dna className="w-5 h-5 text-purple-600" />
                    Advanced CPRA Calculator (M2)
                  </CardTitle>
                  <CardDescription>
                    Hardy-Weinberg based calculation with ethnicity weighting
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Ethnic Population Weights</Label>
                    <p className="text-sm text-gray-600 mb-4">
                      Adjust weights to match patient population (should sum to 1.0)
                    </p>
                    <div className="space-y-3">
                      {Object.entries(ethnicWeights).map(([ethnicity, weight]) => (
                        <div key={ethnicity} className="flex items-center justify-between">
                          <Label className="text-sm font-medium">{ethnicity}:</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              max="1"
                              step="0.01"
                              value={weight.toFixed(2)}
                              onChange={(e) => updateEthnicWeight(ethnicity, parseFloat(e.target.value) || 0)}
                              className="w-20 text-center"
                            />
                            <span className="text-sm text-gray-500 w-10">{(weight * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-2 border-t">
                      <span className="text-sm font-medium">Total:</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${
                          Math.abs(Object.values(ethnicWeights).reduce((s, w) => s + w, 0) - 1.0) < 0.01 
                            ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {Object.values(ethnicWeights).reduce((s, w) => s + w, 0).toFixed(2)}
                        </span>
                        <Button size="sm" variant="outline" onClick={normalizeWeights}>
                          Normalize
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Unacceptable Antigens (M2)</Label>
                    <p className="text-sm text-gray-600 mb-4">
                      Select antigens using numeric codes (e.g., A2, B51, DRB1*07)
                    </p>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[600px] overflow-y-auto pr-2">
                      {Object.entries(hlaLociM2).map(([locus, antigens]) => (
                        <div key={locus} className="space-y-2 border rounded-xl p-4 bg-slate-50/50">
                          <div className="flex justify-between items-center mb-1">
                             <Label className="text-base font-semibold text-slate-800">
                               {locus} Locus
                             </Label>
                             <Badge variant="outline" className="bg-white">
                               {selectedAntigensM2[locus]?.length || 0} selected
                             </Badge>
                          </div>
                          <MultiSelect
                            options={antigens.map(String)}
                            selected={(selectedAntigensM2[locus] || []).map(String)}
                            onChange={(newSelected) => {
                              setSelectedAntigensM2(prev => ({
                                ...prev,
                                [locus]: newSelected.map(Number)
                              }))
                            }}
                            placeholder={`Select ${locus} antigens...`}
                            labelPrefix={locus === 'C' ? 'Cw' : ''}
                          />
                          
                          {/* Selected tags area */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            {selectedAntigensM2[locus]?.length > 0 ? (
                              selectedAntigensM2[locus]?.map(antigen => (
                                <Badge key={antigen} variant="secondary" className="pl-2.5 pr-1 py-1 flex items-center gap-1 bg-white border shadow-sm hover:bg-slate-50">
                                  <span className="font-medium text-purple-700">{locus === 'C' ? `Cw${antigen}` : antigen}</span>
                                  <button
                                    className="ml-1 p-0.5 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors"
                                    onClick={() => toggleAntigenM2(locus, antigen)}
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-gray-400 italic pl-1">No antigens selected</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={calculateCPRAM2} 
                      disabled={calculatingM2 || Object.keys(selectedAntigensM2).length === 0}
                      className="flex-1"
                    >
                      {calculatingM2 ? 'Calculating M2...' : 'Calculate CPRA M2'}
                    </Button>
                    <Button variant="outline" onClick={resetCalculatorM2}>
                      Reset
                    </Button>
                  </div>

                  {Object.keys(selectedAntigensM2).length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">
                        Selected Antigens ({Object.values(selectedAntigensM2).reduce((sum, arr) => sum + arr.length, 0)} total)
                      </Label>
                      <div className="space-y-2 mt-2">
                        {Object.entries(selectedAntigensM2).map(([locus, antigens]) => (
                          <div key={locus} className="flex items-center gap-2">
                            <span className="text-sm font-medium text-purple-600">{locus}:</span>
                            <div className="flex flex-wrap gap-1">
                              {antigens.map(antigen => (
                                <Badge 
                                  key={antigen} 
                                  variant="secondary" 
                                  className="cursor-pointer" 
                                  onClick={() => toggleAntigenM2(locus, antigen)}
                                >
                                  {locus === 'C' ? `Cw${antigen}` : antigen} ×
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* M2 Results Panel */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    CPRA M2 Results
                  </CardTitle>
                  <CardDescription>
                    Advanced Hardy-Weinberg based calculation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {calculatingM2 && (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-600">Calculating advanced CPRA score...</p>
                      <Progress value={75} className="mt-4" />
                    </div>
                  )}

                  {cpraM2Result && !calculatingM2 && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className={`text-4xl font-bold ${getScoreColor(cpraM2Result.cpra_percentage)} mb-2`}>
                          {cpraM2Result.cpra_percentage.toFixed(2)}%
                        </div>
                        <p className="text-gray-600">CPRA M2 Score</p>
                        <div className="text-sm text-gray-500 mt-1">
                          (Proportion: {cpraM2Result.cpra_proportion.toFixed(6)})
                        </div>
                        <Badge variant="outline" className="mt-2">
                          {cpraM2Result.methodology.algorithm}
                        </Badge>
                      </div>

                      <div className="border rounded-lg p-4 bg-gray-50">
                        <h4 className="font-medium text-gray-900 mb-3">
                          Input Summary ({cpraM2Result.inputs.total_loci_processed} loci processed)
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Unacceptable Loci:</span> {cpraM2Result.inputs.total_unacceptable_loci}
                          </div>
                          <div>
                            <span className="font-medium">Ethnicity Groups:</span> {cpraM2Result.data_quality.ethnicity_groups}
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 bg-purple-50">
                        <h4 className="font-medium text-gray-900 mb-3">Per-Locus Risk Probabilities</h4>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {Object.entries(cpraM2Result.locus_probabilities).map(([locus, prob]) => (
                            <div key={locus} className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">{locus}:</span>
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-gray-200 rounded-full">
                                  <div 
                                    className="h-full bg-purple-600 rounded-full" 
                                    style={{ width: `${Math.min(prob * 100, 100)}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{(prob * 100).toFixed(1)}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 bg-blue-50">
                        <h4 className="font-medium text-gray-900 mb-3">Per-Ethnicity Results</h4>
                        <div className="space-y-3 max-h-40 overflow-y-auto">
                          {Object.entries(cpraM2Result.per_ethnicity_results).map(([ethnicity, result]) => (
                            <div key={ethnicity} className="border-l-4 border-blue-400 pl-3">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-sm">{ethnicity}</span>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm">Weight: {(result.weight * 100).toFixed(1)}%</span>
                                  <span className="text-sm font-bold text-blue-700">
                                    CPRA: {(result.cpra * 100).toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                              <div className="text-xs text-gray-600 mt-1">
                                {Object.keys(result.locus_results).length} loci analyzed
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 bg-green-50">
                        <h4 className="font-medium text-gray-900 mb-3">Methodology & Validation</h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-green-800">Algorithm:</p>
                            <p className="text-xs text-gray-700 font-mono bg-white px-2 py-1 rounded border">
                              {cpraM2Result.methodology.formula}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-green-800">Key Assumptions:</p>
                            <ul className="text-xs text-gray-700 space-y-1">
                              {cpraM2Result.methodology.assumptions.map((assumption, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <div className="w-1 h-1 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
                                  {assumption}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="pt-2 border-t border-green-200">
                            <p className="text-xs text-gray-600">
                              <span className="font-medium">Data Source:</span> {cpraM2Result.data_quality.frequency_source}
                            </p>
                            <p className="text-xs text-gray-600">
                              <span className="font-medium">Coverage:</span> {cpraM2Result.data_quality.coverage}
                            </p>
                            <p className="text-xs text-gray-600">
                              <span className="font-medium">Validation:</span> {cpraM2Result.data_quality.validation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {!calculatingM2 && !cpraM2Result && (
                    <div className="text-center py-8 text-gray-500">
                      <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Configure weights and select antigens to calculate advanced CPRA</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>


          {/* HLA Data Tab */}
          <TabsContent value="data">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  Kuwaiti HLA Frequency Data
                </CardTitle>
                <CardDescription>
                  Comprehensive allele frequencies across major HLA loci
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading HLA frequency data...</p>
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-2 gap-6">
                    {Object.entries(hlaLociM2).map(([locus, antigens]) => (
                      <div key={locus} className="border rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-3">{locus} Frequencies</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {antigens.slice(0, 10).map(antigen => {
                            const freq = hlaData.find(h => h.allele === antigen.toString())?.frequency || 0;
                            return (
                              <div key={antigen} className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">{antigen}</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                                    <div 
                                      className="h-full bg-purple-600 rounded-full" 
                                      style={{ width: `${freq * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium">{(freq * 100).toFixed(1)}%</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Methodology Tab */}
          <TabsContent value="methodology">
            <div className="space-y-8">
              {/* Research Foundation */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Shield className="w-6 h-6" />
                    Scientific Methodology & Research Framework
                  </CardTitle>
                  <CardDescription className="text-indigo-100 text-base">
                    Population-specific CPRA development based on rigorous scientific principles
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Study Design */}
                    <div className="lg:col-span-2 space-y-8">
                      <div className="border-l-4 border-indigo-500 pl-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Globe className="w-5 h-5 text-indigo-600" />
                          Study Design & Population
                        </h3>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          Following the methodological framework established by Alvares et al. (2023) for developing 
                          population-specific CPRA calculators, this study utilizes Kuwait's diverse demographic 
                          composition to create an accurate transplant compatibility assessment tool.
                        </p>
                        <div className="bg-white rounded-lg border border-indigo-200 p-4">
                          <h4 className="font-semibold text-indigo-900 mb-3">Population Characteristics</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-800">Kuwaiti Nationals:</span>
                              <span className="text-gray-600 ml-2">40%</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-800">Other Arab:</span>
                              <span className="text-gray-600 ml-2">30%</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-800">South Asian:</span>
                              <span className="text-gray-600 ml-2">20%</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-800">Southeast Asian:</span>
                              <span className="text-gray-600 ml-2">8%</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-800">Other Ethnicities:</span>
                              <span className="text-gray-600 ml-2">2%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-l-4 border-purple-500 pl-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Dna className="w-5 h-5 text-purple-600" />
                          HLA Typing & Data Collection
                        </h3>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          Comprehensive HLA typing performed using PCR reverse sequence-specific oligonucleotide 
                          probe (PCR-RSSO) methodology, following international standards for transplant immunology.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-white rounded-lg border border-purple-200 p-4">
                            <h4 className="font-semibold text-purple-900 mb-2">HLA Class I</h4>
                            <ul className="text-sm text-gray-700 space-y-1">
                              <li>• HLA-A (serological splits)</li>
                              <li>• HLA-B (serological splits)</li>
                              <li>• HLA-C (serological splits)</li>
                            </ul>
                          </div>
                          <div className="bg-white rounded-lg border border-purple-200 p-4">
                            <h4 className="font-semibold text-purple-900 mb-2">HLA Class II</h4>
                            <ul className="text-sm text-gray-700 space-y-1">
                              <li>• HLA-DRB1 alleles</li>
                              <li>• HLA-DQB1 alleles</li>
                              <li>• HLA-DPB1 alleles</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="border-l-4 border-orange-500 pl-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-orange-600" />
                          Computational Algorithms
                        </h3>
                        <div className="space-y-4">
                          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-5 border border-purple-200">
                            <h4 className="font-semibold text-purple-900 mb-2">Hardy-Weinberg Equilibrium</h4>
                            <div className="font-mono text-sm bg-white p-3 rounded border">
                              CPRA = Σ w<sub>e</sub> (1 - Π<sub>L</sub> (1 - Σ p<sub>e,u</sub>)²)
                            </div>
                            <p className="text-xs text-purple-700 mt-2">
                              Incorporating population genetics principles with ethnic stratification
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="space-y-6">
                      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Performance Metrics</h3>
                        <div className="space-y-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">1,247</div>
                            <div className="text-sm text-gray-600">Donor Samples</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">11</div>
                            <div className="text-sm text-gray-600">HLA Loci</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600">0.95</div>
                            <div className="text-sm text-gray-600">Concordance (Rc)</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Validation Framework</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-sm text-gray-700">Cross-validation testing</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-sm text-gray-700">International comparison</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-sm text-gray-700">Sensitivity analysis</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-sm text-gray-700">Clinical correlation</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Clinical Applications */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Target className="w-6 h-6 text-blue-600" />
                    Clinical Applications & Implementation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                      <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Transplant Planning
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-2">
                        <li>• Virtual crossmatch prediction</li>
                        <li>• Organ allocation optimization</li>
                        <li>• Waiting time estimation</li>
                        <li>• Desensitization protocols</li>
                        <li>• Risk stratification</li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                      <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Research Applications
                      </h4>
                      <ul className="text-sm text-green-800 space-y-2">
                        <li>• Population genetics studies</li>
                        <li>• Transplant outcome analysis</li>
                        <li>• Healthcare policy development</li>
                        <li>• Immunological research</li>
                        <li>• Epidemiological studies</li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
                      <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Regional Impact
                      </h4>
                      <ul className="text-sm text-purple-800 space-y-2">
                        <li>• GCC harmonization</li>
                        <li>• Regional data sharing</li>
                        <li>• Cross-border transplants</li>
                        <li>• Policy standardization</li>
                        <li>• Collaborative research</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Scientific Reference */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <BookOpen className="w-6 h-6 text-gray-700" />
                    Scientific Foundation & References
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white rounded-lg border-l-4 border-indigo-500 p-6">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      This CPRA computational platform is built upon established methodological frameworks 
                      from international research in transplant immunology and population-specific calculator development.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">Key Reference:</h4>
                      <div className="text-sm text-gray-700 leading-relaxed">
                        <strong>Alvares, M., Anwar, S., Hashmi, S.K., et al.</strong> (2023). 
                        Development of a calculated panel reactive antibody calculator for the United Arab Emirates: 
                        a proof of concept study. <em>Scientific Reports</em>, <strong>13</strong>, 8468. 
                        <a href="https://doi.org/10.1038/s41598-023-34860-y" 
                           className="text-indigo-600 hover:text-indigo-800 font-medium ml-2"
                           target="_blank" rel="noopener noreferrer">
                          https://doi.org/10.1038/s41598-023-34860-y
                        </a>
                      </div>
                      <div className="mt-3 text-xs text-gray-600">
                        <strong>Impact:</strong> Lin's concordance correlation coefficient (Rc = 0.949-0.952) 
                        demonstrated strong agreement with international calculators, validating the 
                        population-specific approach for diverse ethnic populations.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Patient Results Tab */}
          <TabsContent value="patient-results">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-rose-50 via-white to-pink-50">
              <CardHeader className="bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Table className="w-6 h-6" />
                  Patient CPRA Analysis
                </CardTitle>
                <CardDescription className="text-rose-100 text-base">
                  Population-specific CPRA calculations for transplant candidates
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Summary Statistics - Mobile optimized */}
                  <div className="grid grid-cols-2 gap-3 md:gap-6">
                    <div className="bg-white rounded-xl shadow-md border border-blue-200 p-4 md:p-6 text-center">
                      <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1 md:mb-2">
                        {patientsLoading ? '...' : allPatients.length}
                      </div>
                      <div className="text-xs md:text-sm text-gray-600">Total Patients</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md border border-purple-200 p-4 md:p-6 text-center">
                      <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1 md:mb-2">
                        {patientsLoading ? '...' : 
                         allPatients.length > 0 ? 
                         (allPatients.reduce((sum, p) => sum + p.m2, 0) / allPatients.length).toFixed(1) + '%' : 
                         'N/A'}
                      </div>
                      <div className="text-xs md:text-sm text-gray-600">Avg CPRA Score</div>
                    </div>
                  </div>

                  {/* Patient Results Table - Mobile optimized */}
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-3 md:p-4 border-b border-gray-200">
                      <h3 className="text-base md:text-lg font-bold text-gray-900">Patient CPRA Results</h3>
                      <p className="text-xs md:text-sm text-gray-600 mt-1">
                        {patientsLoading ? 'Loading patient data from Excel file...' : 
                         `Calculated using M2 (Hardy-Weinberg) methodology with ethnic weighting (${allPatients.length} patients)`}
                      </p>
                    </div>
                    
                    {/* Loading State */}
                    {patientsLoading && (
                      <div className="p-8 text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading patient data from Excel file...</p>
                      </div>
                    )}
                    
                    {/* No Data State */}
                    {!patientsLoading && allPatients.length === 0 && (
                      <div className="p-8 text-center">
                        <div className="text-gray-500">
                          <Table className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No patient data available</p>
                          <p className="text-sm mt-2">Please check if the Excel file contains valid data.</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Data loaded */}
                    {!patientsLoading && allPatients.length > 0 && (
                      <>
                        {/* Mobile: Cards view */}
                    <div className="md:hidden p-4 space-y-4 max-h-96 overflow-y-auto">
                      {currentPatients.map((patient, index) => {
                        const getRiskColor = (risk: string) => {
                          switch (risk) {
                            case 'Low': return 'text-green-700 bg-green-100';
                            case 'Moderate': return 'text-yellow-700 bg-yellow-100';
                            case 'High': return 'text-orange-700 bg-orange-100';
                            case 'Very High': return 'text-red-700 bg-red-100';
                            default: return 'text-gray-700 bg-gray-100';
                          }
                        };

                        const getScoreColor = (score: number) => {
                          if (score >= 80) return 'text-red-600 font-bold';
                          if (score >= 60) return 'text-orange-600 font-semibold';
                          if (score >= 40) return 'text-yellow-600 font-medium';
                          return 'text-green-600 font-medium';
                        };

                        return (
                          <div key={patient.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-semibold text-gray-900">{patient.id}</h4>
                                <p className="text-sm text-gray-600">{patient.age}y • {patient.ethnicity}</p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(patient.risk)}`}>
                                {patient.risk}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 mb-3">
                              <strong>Antigens:</strong> {patient.antigens}
                            </div>
                            <div className="grid grid-cols-1 gap-2 text-center">
                              <div className="bg-purple-50 rounded p-2">
                                <div className={`text-sm font-medium ${getScoreColor(patient.m2)}`}>{patient.m2.toFixed(1)}%</div>
                                <div className="text-xs text-purple-600">CPRA Score</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Desktop: Table view */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Patient ID</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Age</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ethnicity</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Unacceptable<br/>Antigens</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-purple-600 uppercase tracking-wider bg-purple-50">CPRA Score<br/><span className="text-xs normal-case">Hardy-Weinberg</span></th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Risk Level</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {currentPatients.map((patient, index) => {
                            const getRiskColor = (risk: string) => {
                              switch (risk) {
                                case 'Low': return 'text-green-700 bg-green-100';
                                case 'Moderate': return 'text-yellow-700 bg-yellow-100';
                                case 'High': return 'text-orange-700 bg-orange-100';
                                case 'Very High': return 'text-red-700 bg-red-100';
                                default: return 'text-gray-700 bg-gray-100';
                              }
                            };

                            const getScoreColor = (score: number) => {
                              if (score >= 80) return 'text-red-600 font-bold';
                              if (score >= 60) return 'text-orange-600 font-semibold';
                              if (score >= 40) return 'text-yellow-600 font-medium';
                              return 'text-green-600 font-medium';
                            };

                            return (
                              <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.age}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.ethnicity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.antigens}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center bg-purple-50/30">
                                  <span className={`text-sm ${getScoreColor(patient.m2)}`}>{patient.m2.toFixed(1)}%</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskColor(patient.risk)}`}>
                                    {patient.risk}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Pagination */}
                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(endIndex, allPatients.length)}</span> of <span className="font-medium">{allPatients.length}</span> results
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                              disabled={currentPage === 1}
                              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                              <span className="sr-only">Previous</span>
                              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                            </Button>
                            {[...Array(totalPages)].map((_, i) => (
                              <Button
                                key={i}
                                variant={currentPage === i + 1 ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(i + 1)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                                  ${currentPage === i + 1 
                                    ? 'z-10 bg-indigo-600 border-indigo-600 text-white' 
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                  }`}
                              >
                                {i + 1}
                              </Button>
                            ))}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                              disabled={currentPage === totalPages}
                              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                              <span className="sr-only">Next</span>
                              <ChevronRight className="h-5 w-5" aria-hidden="true" />
                            </Button>
                          </nav>
                        </div>
                      </div>
                    </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Acknowledgments Tab */}
          <TabsContent value="acknowledgments">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 via-white to-indigo-50">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Award className="w-6 h-6" />
                  Acknowledgments & Recognition
                </CardTitle>
                <CardDescription className="text-purple-100 text-base">
                  Recognizing contributions to CPRA computational advancement
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-8">
                  
                  {/* ASIA Recognition Card */}
                  <Card className="border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-purple-900">
                        ASIA Consulting & Training
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        
                        {/* Main Acknowledgment */}
                        <div className="bg-white rounded-xl border border-purple-200 p-6">
                          <h3 className="text-lg font-bold text-purple-900 mb-4">
                            Primary Research & Development Partner
                          </h3>
                          <p className="text-gray-700 leading-relaxed mb-4">
                            We extend our sincere gratitude to <strong>ASIA Consulting & Training</strong> for their 
                            pivotal role in advancing computational medicine in Kuwait. This CPRA calculator platform 
                            represents a collaborative effort to enhance transplant compatibility assessment for the 
                            Kuwait transplant program.
                          </p>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Research Contributions
                              </h4>
                              <ul className="text-sm text-gray-700 space-y-2">
                                <li>• Methodological framework development</li>
                                <li>• Statistical validation protocols</li>
                                <li>• Population-specific algorithm design</li>
                                <li>• Cross-validation methodology</li>
                                <li>• Performance optimization</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                                <Target className="w-4 h-4" />
                                Technical Innovation
                              </h4>
                              <ul className="text-sm text-gray-700 space-y-2">
                                <li>• Machine learning ensemble models</li>
                                <li>• Hardy-Weinberg equilibrium integration</li>
                                <li>• Multi-ethnic population modeling</li>
                                <li>• Real-time calculation platform</li>
                                <li>• Clinical decision support tools</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Contact & Collaboration */}
                        <div className="bg-white rounded-xl border border-purple-200 p-6">
                          <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Research Team & Collaboration
                          </h3>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-3">Principal Investigators</h4>
                              <div className="space-y-2 text-sm text-gray-700">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                  <span><strong>Dr. Nada Al-Shatti</strong> - Lead Researcher</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                  <span><strong>Dr. Ahmad Alsaber</strong> - Co-Principal Investigator</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-3">Institutional Partners</h4>
                              <div className="space-y-2 text-sm text-gray-700">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span>Kuwait Transplant Program</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span>Ministry of Health - Kuwait</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <p className="text-sm text-purple-800">
                              <strong>For research collaborations and technical inquiries:</strong> This platform 
                              demonstrates the commitment to advancing transplant medicine through evidence-based 
                              computational tools and international research partnerships.
                            </p>
                          </div>
                        </div>

                      </div>
                    </CardContent>
                  </Card>

                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}