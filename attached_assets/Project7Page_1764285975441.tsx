import { useState, useEffect } from 'react';
import { Users, Dna, Calculator, Shield, Award, ChevronDown, ChevronUp, BarChart3, Target, Globe, CheckCircle, Zap, BookOpen, Table, ChevronLeft, ChevronRight, TrendingUp, Brain, Lock, AlertCircle } from 'lucide-react';
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
import asiaLogo from '@assets/Avatar 2-5_1756334652891.jpg';
import drAhmadPhoto from '@assets/AUK-Faculty-KFAS-Grant-Policymaking-Landscape 2_Nero_AI_Image_Upscaler_Photo_Face-1_1756334750056.png';
import dnaBackground from '@assets/gettyimages-1372448143-640x640_1756335413602.jpg';

// ADHD Features configuration (Top 10 features based on clinical research)
const adhdFeatures = [
  {
    key: 'attention_sustaining',
    label: 'Difficulty sustaining attention in tasks',
    description: 'Has trouble keeping attention on tasks or play activities',
    importance: 0.165
  },
  {
    key: 'fidgeting',
    label: 'Fidgets with hands/feet or squirms',
    description: 'Often fidgets with or taps hands or feet, or squirms in seat',
    importance: 0.142
  },
  {
    key: 'careless_mistakes',
    label: 'Makes careless mistakes in work',
    description: 'Often makes careless mistakes in schoolwork, at work, or with other activities',
    importance: 0.138
  },
  {
    key: 'difficulty_waiting',
    label: 'Difficulty waiting turn',
    description: 'Has difficulty waiting his or her turn',
    importance: 0.129
  },
  {
    key: 'leaves_seat',
    label: 'Leaves seat inappropriately',
    description: 'Often leaves seat in situations when remaining seated is expected',
    importance: 0.125
  },
  {
    key: 'interrupts_others',
    label: 'Interrupts or intrudes on others',
    description: 'Often interrupts or intrudes on others (e.g., conversations, games)',
    importance: 0.118
  },
  {
    key: 'loses_things',
    label: 'Loses things necessary for tasks',
    description: 'Often loses things necessary for tasks/activities (e.g., school materials, pencils)',
    importance: 0.112
  },
  {
    key: 'forgetful_activities',
    label: 'Forgetful in daily activities',
    description: 'Often forgetful in daily activities',
    importance: 0.106
  },
  {
    key: 'talks_excessively',
    label: 'Talks excessively',
    description: 'Often talks excessively',
    importance: 0.098
  },
  {
    key: 'difficulty_organizing',
    label: 'Difficulty organizing tasks',
    description: 'Often has trouble organizing tasks and activities',
    importance: 0.087
  }
];

// Full patient data - 150 patients with recalculated CPRA scores
const allPatients = [
  { id: 'KWT-001', age: 45, ethnicity: 'Kuwaiti', antigens: 8, m1: 68.2, m2: 71.4, m3: 73.8, risk: 'High' },
  { id: 'KWT-002', age: 32, ethnicity: 'Other Arab', antigens: 5, m1: 42.6, m2: 45.1, m3: 47.2, risk: 'Moderate' },
  { id: 'KWT-003', age: 58, ethnicity: 'South Asian', antigens: 12, m1: 89.3, m2: 92.1, m3: 94.5, risk: 'Very High' },
  { id: 'KWT-004', age: 28, ethnicity: 'Kuwaiti', antigens: 3, m1: 28.4, m2: 31.2, m3: 29.7, risk: 'Low' },
  { id: 'KWT-005', age: 51, ethnicity: 'Southeast Asian', antigens: 7, m1: 61.8, m2: 64.3, m3: 67.1, risk: 'High' },
  { id: 'KWT-006', age: 39, ethnicity: 'Other Arab', antigens: 4, m1: 35.2, m2: 37.8, m3: 38.9, risk: 'Moderate' },
  { id: 'KWT-007', age: 44, ethnicity: 'Kuwaiti', antigens: 9, m1: 74.1, m2: 77.6, m3: 79.3, risk: 'High' },
  { id: 'KWT-008', age: 62, ethnicity: 'South Asian', antigens: 6, m1: 55.7, m2: 58.9, m3: 61.4, risk: 'Moderate' },
  { id: 'KWT-009', age: 35, ethnicity: 'Mixed', antigens: 11, m1: 83.6, m2: 86.2, m3: 88.7, risk: 'Very High' },
  { id: 'KWT-010', age: 26, ethnicity: 'Kuwaiti', antigens: 2, m1: 18.3, m2: 20.1, m3: 19.8, risk: 'Low' },
  { id: 'KWT-011', age: 47, ethnicity: 'Other Arab', antigens: 8, m1: 66.9, m2: 69.7, m3: 72.1, risk: 'High' },
  { id: 'KWT-012', age: 53, ethnicity: 'Southeast Asian', antigens: 5, m1: 48.2, m2: 51.4, m3: 53.6, risk: 'Moderate' },
  { id: 'KWT-013', age: 41, ethnicity: 'South Asian', antigens: 10, m1: 78.5, m2: 81.3, m3: 84.2, risk: 'High' },
  { id: 'KWT-014', age: 29, ethnicity: 'Kuwaiti', antigens: 3, m1: 31.7, m2: 34.2, m3: 32.9, risk: 'Low' },
  { id: 'KWT-015', age: 56, ethnicity: 'Mixed', antigens: 7, m1: 63.4, m2: 66.8, m3: 69.5, risk: 'High' },
  { id: 'KWT-016', age: 33, ethnicity: 'Other Arab', antigens: 4, m1: 38.9, m2: 41.5, m3: 42.7, risk: 'Moderate' },
  { id: 'KWT-017', age: 49, ethnicity: 'Kuwaiti', antigens: 6, m1: 52.3, m2: 55.1, m3: 57.8, risk: 'Moderate' },
  { id: 'KWT-018', age: 37, ethnicity: 'South Asian', antigens: 9, m1: 71.6, m2: 74.8, m3: 77.4, risk: 'High' },
  { id: 'KWT-019', age: 42, ethnicity: 'Southeast Asian', antigens: 5, m1: 45.8, m2: 48.6, m3: 50.3, risk: 'Moderate' },
  { id: 'KWT-020', age: 59, ethnicity: 'Kuwaiti', antigens: 11, m1: 81.2, m2: 84.7, m3: 87.1, risk: 'Very High' },
  { id: 'KWT-021', age: 31, ethnicity: 'Mixed', antigens: 4, m1: 36.5, m2: 39.1, m3: 40.8, risk: 'Moderate' },
  { id: 'KWT-022', age: 48, ethnicity: 'Other Arab', antigens: 7, m1: 59.7, m2: 62.4, m3: 65.2, risk: 'High' },
  { id: 'KWT-023', age: 38, ethnicity: 'South Asian', antigens: 8, m1: 69.1, m2: 72.3, m3: 75.6, risk: 'High' },
  { id: 'KWT-024', age: 27, ethnicity: 'Kuwaiti', antigens: 2, m1: 21.4, m2: 23.8, m3: 22.9, risk: 'Low' },
  { id: 'KWT-025', age: 54, ethnicity: 'Southeast Asian', antigens: 9, m1: 75.8, m2: 78.9, m3: 81.4, risk: 'High' },
  { id: 'KWT-026', age: 43, ethnicity: 'Kuwaiti', antigens: 6, m1: 54.1, m2: 57.3, m3: 59.7, risk: 'Moderate' },
  { id: 'KWT-027', age: 34, ethnicity: 'Other Arab', antigens: 3, m1: 32.8, m2: 35.4, m3: 37.1, risk: 'Low' },
  { id: 'KWT-028', age: 61, ethnicity: 'South Asian', antigens: 10, m1: 79.4, m2: 82.8, m3: 85.3, risk: 'Very High' },
  { id: 'KWT-029', age: 25, ethnicity: 'Southeast Asian', antigens: 4, m1: 41.2, m2: 44.6, m3: 46.8, risk: 'Moderate' },
  { id: 'KWT-030', age: 52, ethnicity: 'Mixed', antigens: 8, m1: 70.3, m2: 73.7, m3: 76.4, risk: 'High' },
  { id: 'KWT-031', age: 36, ethnicity: 'Kuwaiti', antigens: 5, m1: 47.9, m2: 50.8, m3: 52.4, risk: 'Moderate' },
  { id: 'KWT-032', age: 46, ethnicity: 'Other Arab', antigens: 7, m1: 63.5, m2: 66.9, m3: 69.8, risk: 'High' },
  { id: 'KWT-033', age: 30, ethnicity: 'South Asian', antigens: 3, m1: 29.1, m2: 32.5, m3: 31.7, risk: 'Low' },
  { id: 'KWT-034', age: 55, ethnicity: 'Southeast Asian', antigens: 9, m1: 76.2, m2: 79.6, m3: 82.1, risk: 'High' },
  { id: 'KWT-035', age: 40, ethnicity: 'Mixed', antigens: 6, m1: 58.7, m2: 61.4, m3: 64.2, risk: 'Moderate' },
  { id: 'KWT-036', age: 24, ethnicity: 'Kuwaiti', antigens: 2, m1: 19.6, m2: 22.1, m3: 21.3, risk: 'Low' },
  { id: 'KWT-037', age: 50, ethnicity: 'Other Arab', antigens: 8, m1: 71.8, m2: 75.2, m3: 78.1, risk: 'High' },
  { id: 'KWT-038', age: 38, ethnicity: 'South Asian', antigens: 7, m1: 64.9, m2: 68.3, m3: 71.4, risk: 'High' },
  { id: 'KWT-039', age: 33, ethnicity: 'Southeast Asian', antigens: 4, m1: 39.4, m2: 42.7, m3: 44.9, risk: 'Moderate' },
  { id: 'KWT-040', age: 57, ethnicity: 'Mixed', antigens: 11, m1: 84.3, m2: 87.9, m3: 90.5, risk: 'Very High' },
  { id: 'KWT-041', age: 42, ethnicity: 'Kuwaiti', antigens: 5, m1: 46.8, m2: 49.7, m3: 52.1, risk: 'Moderate' },
  { id: 'KWT-042', age: 29, ethnicity: 'Other Arab', antigens: 6, m1: 56.3, m2: 59.8, m3: 62.4, risk: 'Moderate' },
  { id: 'KWT-043', age: 63, ethnicity: 'South Asian', antigens: 9, m1: 77.5, m2: 81.1, m3: 84.7, risk: 'High' },
  { id: 'KWT-044', age: 35, ethnicity: 'Southeast Asian', antigens: 3, m1: 33.7, m2: 36.9, m3: 38.5, risk: 'Low' },
  { id: 'KWT-045', age: 48, ethnicity: 'Mixed', antigens: 8, m1: 69.2, m2: 72.8, m3: 75.9, risk: 'High' },
  { id: 'KWT-046', age: 27, ethnicity: 'Kuwaiti', antigens: 4, m1: 37.5, m2: 40.9, m3: 42.6, risk: 'Moderate' },
  { id: 'KWT-047', age: 53, ethnicity: 'Other Arab', antigens: 7, m1: 62.1, m2: 65.7, m3: 68.3, risk: 'High' },
  { id: 'KWT-048', age: 41, ethnicity: 'South Asian', antigens: 6, m1: 53.8, m2: 57.2, m3: 59.9, risk: 'Moderate' },
  { id: 'KWT-049', age: 32, ethnicity: 'Southeast Asian', antigens: 5, m1: 44.6, m2: 47.9, m3: 50.2, risk: 'Moderate' },
  { id: 'KWT-050', age: 60, ethnicity: 'Mixed', antigens: 10, m1: 80.7, m2: 84.4, m3: 87.6, risk: 'Very High' },
  { id: 'KWT-051', age: 26, ethnicity: 'Kuwaiti', antigens: 3, m1: 30.2, m2: 33.1, m3: 34.8, risk: 'Low' },
  { id: 'KWT-052', age: 45, ethnicity: 'Other Arab', antigens: 8, m1: 67.4, m2: 70.9, m3: 73.7, risk: 'High' },
  { id: 'KWT-053', age: 39, ethnicity: 'South Asian', antigens: 7, m1: 61.7, m2: 65.2, m3: 68.1, risk: 'High' },
  { id: 'KWT-054', age: 31, ethnicity: 'Southeast Asian', antigens: 4, m1: 38.3, m2: 41.8, m3: 43.9, risk: 'Moderate' },
  { id: 'KWT-055', age: 56, ethnicity: 'Mixed', antigens: 9, m1: 75.9, m2: 79.5, m3: 82.8, risk: 'High' },
  { id: 'KWT-056', age: 28, ethnicity: 'Kuwaiti', antigens: 2, m1: 22.7, m2: 25.4, m3: 24.1, risk: 'Low' },
  { id: 'KWT-057', age: 49, ethnicity: 'Other Arab', antigens: 6, m1: 55.1, m2: 58.6, m3: 61.2, risk: 'Moderate' },
  { id: 'KWT-058', age: 44, ethnicity: 'South Asian', antigens: 8, m1: 68.8, m2: 72.4, m3: 75.3, risk: 'High' },
  { id: 'KWT-059', age: 36, ethnicity: 'Southeast Asian', antigens: 5, m1: 43.2, m2: 46.7, m3: 49.1, risk: 'Moderate' },
  { id: 'KWT-060', age: 58, ethnicity: 'Mixed', antigens: 11, m1: 82.9, m2: 86.7, m3: 89.4, risk: 'Very High' },
  { id: 'KWT-061', age: 34, ethnicity: 'Kuwaiti', antigens: 4, m1: 36.9, m2: 40.2, m3: 42.1, risk: 'Moderate' },
  { id: 'KWT-062', age: 47, ethnicity: 'Other Arab', antigens: 7, m1: 60.5, m2: 64.1, m3: 67.2, risk: 'High' },
  { id: 'KWT-063', age: 52, ethnicity: 'South Asian', antigens: 9, m1: 74.3, m2: 78.1, m3: 81.5, risk: 'High' },
  { id: 'KWT-064', age: 23, ethnicity: 'Southeast Asian', antigens: 3, m1: 27.4, m2: 30.8, m3: 32.3, risk: 'Low' },
  { id: 'KWT-065', age: 51, ethnicity: 'Mixed', antigens: 8, m1: 66.7, m2: 70.3, m3: 73.6, risk: 'High' },
  { id: 'KWT-066', age: 37, ethnicity: 'Kuwaiti', antigens: 5, m1: 45.4, m2: 48.8, m3: 51.7, risk: 'Moderate' },
  { id: 'KWT-067', age: 43, ethnicity: 'Other Arab', antigens: 6, m1: 52.9, m2: 56.4, m3: 59.3, risk: 'Moderate' },
  { id: 'KWT-068', age: 59, ethnicity: 'South Asian', antigens: 10, m1: 78.1, m2: 82.3, m3: 85.9, risk: 'Very High' },
  { id: 'KWT-069', age: 30, ethnicity: 'Southeast Asian', antigens: 4, m1: 35.8, m2: 39.3, m3: 41.7, risk: 'Moderate' },
  { id: 'KWT-070', age: 54, ethnicity: 'Mixed', antigens: 7, m1: 59.6, m2: 63.2, m3: 66.8, risk: 'High' },
  { id: 'KWT-071', age: 25, ethnicity: 'Kuwaiti', antigens: 3, m1: 26.1, m2: 29.7, m3: 28.4, risk: 'Low' },
  { id: 'KWT-072', age: 46, ethnicity: 'Other Arab', antigens: 8, m1: 65.3, m2: 68.9, m3: 72.4, risk: 'High' },
  { id: 'KWT-073', age: 40, ethnicity: 'South Asian', antigens: 6, m1: 51.7, m2: 55.3, m3: 58.1, risk: 'Moderate' },
  { id: 'KWT-074', age: 33, ethnicity: 'Southeast Asian', antigens: 5, m1: 42.1, m2: 45.6, m3: 48.3, risk: 'Moderate' },
  { id: 'KWT-075', age: 61, ethnicity: 'Mixed', antigens: 9, m1: 73.8, m2: 77.6, m3: 81.2, risk: 'High' },
  { id: 'KWT-076', age: 29, ethnicity: 'Kuwaiti', antigens: 2, m1: 20.9, m2: 23.8, m3: 22.6, risk: 'Low' },
  { id: 'KWT-077', age: 48, ethnicity: 'Other Arab', antigens: 7, m1: 58.4, m2: 62.1, m3: 65.7, risk: 'High' },
  { id: 'KWT-078', age: 35, ethnicity: 'South Asian', antigens: 8, m1: 67.2, m2: 71.1, m3: 74.8, risk: 'High' },
  { id: 'KWT-079', age: 42, ethnicity: 'Southeast Asian', antigens: 4, m1: 37.6, m2: 41.2, m3: 43.5, risk: 'Moderate' },
  { id: 'KWT-080', age: 55, ethnicity: 'Mixed', antigens: 10, m1: 79.5, m2: 83.7, m3: 87.3, risk: 'Very High' },
  { id: 'KWT-081', age: 31, ethnicity: 'Kuwaiti', antigens: 5, m1: 44.3, m2: 47.9, m3: 50.6, risk: 'Moderate' },
  { id: 'KWT-082', age: 50, ethnicity: 'Other Arab', antigens: 6, m1: 54.7, m2: 58.3, m3: 61.5, risk: 'Moderate' },
  { id: 'KWT-083', age: 38, ethnicity: 'South Asian', antigens: 9, m1: 72.6, m2: 76.4, m3: 79.9, risk: 'High' },
  { id: 'KWT-084', age: 27, ethnicity: 'Southeast Asian', antigens: 3, m1: 31.5, m2: 34.9, m3: 36.2, risk: 'Low' },
  { id: 'KWT-085', age: 53, ethnicity: 'Mixed', antigens: 8, m1: 64.1, m2: 67.8, m3: 71.3, risk: 'High' },
  { id: 'KWT-086', age: 41, ethnicity: 'Kuwaiti', antigens: 4, m1: 40.8, m2: 44.1, m3: 46.7, risk: 'Moderate' },
  { id: 'KWT-087', age: 32, ethnicity: 'Other Arab', antigens: 7, m1: 57.2, m2: 60.9, m3: 64.1, risk: 'Moderate' },
  { id: 'KWT-088', age: 62, ethnicity: 'South Asian', antigens: 11, m1: 81.4, m2: 85.8, m3: 89.1, risk: 'Very High' },
  { id: 'KWT-089', age: 26, ethnicity: 'Southeast Asian', antigens: 4, m1: 34.2, m2: 37.7, m3: 39.8, risk: 'Low' },
  { id: 'KWT-090', age: 47, ethnicity: 'Mixed', antigens: 6, m1: 56.9, m2: 60.5, m3: 63.9, risk: 'Moderate' },
  { id: 'KWT-091', age: 39, ethnicity: 'Kuwaiti', antigens: 7, m1: 61.3, m2: 64.8, m3: 68.2, risk: 'High' },
  { id: 'KWT-092', age: 45, ethnicity: 'Other Arab', antigens: 5, m1: 49.1, m2: 52.6, m3: 55.4, risk: 'Moderate' },
  { id: 'KWT-093', age: 56, ethnicity: 'South Asian', antigens: 8, m1: 70.7, m2: 74.5, m3: 78.1, risk: 'High' },
  { id: 'KWT-094', age: 28, ethnicity: 'Southeast Asian', antigens: 3, m1: 28.9, m2: 32.4, m3: 33.7, risk: 'Low' },
  { id: 'KWT-095', age: 51, ethnicity: 'Mixed', antigens: 9, m1: 76.4, m2: 80.2, m3: 83.7, risk: 'High' },
  { id: 'KWT-096', age: 34, ethnicity: 'Kuwaiti', antigens: 2, m1: 24.6, m2: 27.3, m3: 26.1, risk: 'Low' },
  { id: 'KWT-097', age: 44, ethnicity: 'Other Arab', antigens: 6, m1: 53.4, m2: 57.1, m3: 60.2, risk: 'Moderate' },
  { id: 'KWT-098', age: 37, ethnicity: 'South Asian', antigens: 10, m1: 77.8, m2: 81.9, m3: 85.6, risk: 'Very High' },
  { id: 'KWT-099', age: 49, ethnicity: 'Southeast Asian', antigens: 7, m1: 62.5, m2: 66.1, m3: 69.4, risk: 'High' },
  { id: 'KWT-100', age: 60, ethnicity: 'Mixed', antigens: 12, m1: 88.6, m2: 93.2, m3: 96.8, risk: 'Very High' },
  { id: 'KWT-101', age: 43, ethnicity: 'Kuwaiti', antigens: 5, m1: 48.7, m2: 51.9, m3: 54.3, risk: 'Moderate' },
  { id: 'KWT-102', age: 36, ethnicity: 'Other Arab', antigens: 8, m1: 70.1, m2: 73.6, m3: 76.7, risk: 'High' },
  { id: 'KWT-103', age: 52, ethnicity: 'South Asian', antigens: 6, m1: 57.3, m2: 60.8, m3: 63.4, risk: 'Moderate' },
  { id: 'KWT-104', age: 24, ethnicity: 'Southeast Asian', antigens: 3, m1: 32.1, m2: 35.6, m3: 34.2, risk: 'Low' },
  { id: 'KWT-105', age: 59, ethnicity: 'Mixed', antigens: 11, m1: 85.7, m2: 89.3, m3: 92.1, risk: 'Very High' },
  { id: 'KWT-106', age: 41, ethnicity: 'Kuwaiti', antigens: 4, m1: 39.8, m2: 43.2, m3: 45.4, risk: 'Moderate' },
  { id: 'KWT-107', age: 30, ethnicity: 'Other Arab', antigens: 7, m1: 64.2, m2: 67.7, m3: 70.6, risk: 'High' },
  { id: 'KWT-108', age: 46, ethnicity: 'South Asian', antigens: 9, m1: 75.4, m2: 79.1, m3: 82.4, risk: 'High' },
  { id: 'KWT-109', age: 33, ethnicity: 'Southeast Asian', antigens: 5, m1: 46.3, m2: 49.8, m3: 52.6, risk: 'Moderate' },
  { id: 'KWT-110', age: 57, ethnicity: 'Mixed', antigens: 10, m1: 81.8, m2: 85.6, m3: 88.9, risk: 'Very High' },
  { id: 'KWT-111', age: 29, ethnicity: 'Kuwaiti', antigens: 2, m1: 23.5, m2: 26.7, m3: 25.3, risk: 'Low' },
  { id: 'KWT-112', age: 50, ethnicity: 'Other Arab', antigens: 6, m1: 58.9, m2: 62.5, m3: 65.8, risk: 'High' },
  { id: 'KWT-113', age: 38, ethnicity: 'South Asian', antigens: 8, m1: 72.3, m2: 76.1, m3: 79.6, risk: 'High' },
  { id: 'KWT-114', age: 27, ethnicity: 'Southeast Asian', antigens: 4, m1: 40.6, m2: 44.3, m3: 46.9, risk: 'Moderate' },
  { id: 'KWT-115', age: 54, ethnicity: 'Mixed', antigens: 7, m1: 65.8, m2: 69.4, m3: 72.9, risk: 'High' },
  { id: 'KWT-116', age: 35, ethnicity: 'Kuwaiti', antigens: 3, m1: 34.2, m2: 37.8, m3: 36.1, risk: 'Low' },
  { id: 'KWT-117', age: 48, ethnicity: 'Other Arab', antigens: 9, m1: 77.9, m2: 81.7, m3: 85.2, risk: 'Very High' },
  { id: 'KWT-118', age: 42, ethnicity: 'South Asian', antigens: 5, m1: 50.4, m2: 53.9, m3: 56.7, risk: 'Moderate' },
  { id: 'KWT-119', age: 31, ethnicity: 'Southeast Asian', antigens: 6, m1: 55.6, m2: 59.2, m3: 62.3, risk: 'Moderate' },
  { id: 'KWT-120', age: 61, ethnicity: 'Mixed', antigens: 12, m1: 90.4, m2: 94.7, m3: 97.9, risk: 'Very High' },
  { id: 'KWT-121', age: 26, ethnicity: 'Kuwaiti', antigens: 4, m1: 41.7, m2: 45.1, m3: 47.8, risk: 'Moderate' },
  { id: 'KWT-122', age: 53, ethnicity: 'Other Arab', antigens: 8, m1: 73.6, m2: 77.3, m3: 80.7, risk: 'Very High' },
  { id: 'KWT-123', age: 40, ethnicity: 'South Asian', antigens: 7, m1: 66.5, m2: 70.1, m3: 73.5, risk: 'High' },
  { id: 'KWT-124', age: 34, ethnicity: 'Southeast Asian', antigens: 3, m1: 33.4, m2: 36.8, m3: 38.7, risk: 'Low' },
  { id: 'KWT-125', age: 58, ethnicity: 'Mixed', antigens: 10, m1: 83.2, m2: 87.1, m3: 90.6, risk: 'Very High' },
  { id: 'KWT-126', age: 25, ethnicity: 'Kuwaiti', antigens: 2, m1: 22.3, m2: 25.1, m3: 23.9, risk: 'Low' },
  { id: 'KWT-127', age: 47, ethnicity: 'Other Arab', antigens: 6, m1: 60.2, m2: 63.9, m3: 67.1, risk: 'High' },
  { id: 'KWT-128', age: 39, ethnicity: 'South Asian', antigens: 9, m1: 78.7, m2: 82.6, m3: 86.3, risk: 'Very High' },
  { id: 'KWT-129', age: 32, ethnicity: 'Southeast Asian', antigens: 5, m1: 47.8, m2: 51.3, m3: 54.1, risk: 'Moderate' },
  { id: 'KWT-130', age: 55, ethnicity: 'Mixed', antigens: 11, m1: 86.9, m2: 90.8, m3: 93.7, risk: 'Very High' },
  { id: 'KWT-131', age: 28, ethnicity: 'Kuwaiti', antigens: 4, m1: 38.6, m2: 42.4, m3: 44.8, risk: 'Moderate' },
  { id: 'KWT-132', age: 51, ethnicity: 'Other Arab', antigens: 7, m1: 67.8, m2: 71.5, m3: 74.9, risk: 'High' },
  { id: 'KWT-133', age: 44, ethnicity: 'South Asian', antigens: 8, m1: 74.9, m2: 78.8, m3: 82.6, risk: 'Very High' },
  { id: 'KWT-134', age: 37, ethnicity: 'Southeast Asian', antigens: 6, m1: 59.4, m2: 63.1, m3: 66.5, risk: 'High' },
  { id: 'KWT-135', age: 62, ethnicity: 'Mixed', antigens: 12, m1: 91.7, m2: 95.4, m3: 98.3, risk: 'Very High' },
  { id: 'KWT-136', age: 30, ethnicity: 'Kuwaiti', antigens: 3, m1: 31.9, m2: 35.2, m3: 33.8, risk: 'Low' },
  { id: 'KWT-137', age: 49, ethnicity: 'Other Arab', antigens: 9, m1: 79.6, m2: 83.5, m3: 87.1, risk: 'Very High' },
  { id: 'KWT-138', age: 43, ethnicity: 'South Asian', antigens: 5, m1: 52.1, m2: 55.7, m3: 58.9, risk: 'Moderate' },
  { id: 'KWT-139', age: 35, ethnicity: 'Southeast Asian', antigens: 7, m1: 68.3, m2: 72.1, m3: 75.7, risk: 'High' },
  { id: 'KWT-140', age: 56, ethnicity: 'Mixed', antigens: 10, m1: 84.6, m2: 88.7, m3: 91.9, risk: 'Very High' },
  { id: 'KWT-141', age: 27, ethnicity: 'Kuwaiti', antigens: 2, m1: 24.1, m2: 27.2, m3: 25.7, risk: 'Low' },
  { id: 'KWT-142', age: 52, ethnicity: 'Other Arab', antigens: 8, m1: 76.2, m2: 80.1, m3: 83.8, risk: 'Very High' },
  { id: 'KWT-143', age: 41, ethnicity: 'South Asian', antigens: 6, m1: 61.8, m2: 65.6, m3: 68.9, risk: 'High' },
  { id: 'KWT-144', age: 33, ethnicity: 'Southeast Asian', antigens: 4, m1: 43.9, m2: 47.6, m3: 50.4, risk: 'Moderate' },
  { id: 'KWT-145', age: 60, ethnicity: 'Mixed', antigens: 11, m1: 88.1, m2: 92.3, m3: 95.4, risk: 'Very High' },
  { id: 'KWT-146', age: 29, ethnicity: 'Kuwaiti', antigens: 3, m1: 35.7, m2: 39.4, m3: 37.6, risk: 'Moderate' },
  { id: 'KWT-147', age: 45, ethnicity: 'Other Arab', antigens: 7, m1: 69.4, m2: 73.2, m3: 76.8, risk: 'High' },
  { id: 'KWT-148', age: 36, ethnicity: 'South Asian', antigens: 9, m1: 80.9, m2: 84.9, m3: 88.7, risk: 'Very High' },
  { id: 'KWT-149', age: 48, ethnicity: 'Southeast Asian', antigens: 5, m1: 54.2, m2: 57.9, m3: 61.1, risk: 'Moderate' },
  { id: 'KWT-150', age: 63, ethnicity: 'Mixed', antigens: 12, m1: 93.5, m2: 97.1, m3: 99.2, risk: 'Very High' },
];

// Available HLA antigens for selection (Basic calculator)
const hlaLoci = {
  'HLA-A': ['A1', 'A2', 'A3', 'A11', 'A23', 'A24', 'A25', 'A26', 'A29', 'A30', 'A31', 'A32', 'A33', 'A34', 'A36', 'A66', 'A68', 'A69', 'A74', 'A80'],
  'HLA-B': ['B7', 'B8', 'B13', 'B15', 'B17', 'B18', 'B27', 'B35', 'B37', 'B38', 'B39', 'B40', 'B41', 'B42', 'B44', 'B45', 'B46', 'B47', 'B48', 'B49', 'B50', 'B51', 'B52', 'B53', 'B54', 'B55', 'B56', 'B57', 'B58', 'B59', 'B60', 'B61', 'B62', 'B63', 'B64', 'B65', 'B67', 'B70', 'B71', 'B72', 'B73', 'B75', 'B76', 'B77', 'B78', 'B81', 'B82'],
  'HLA-C': ['Cw1', 'Cw2', 'Cw3', 'Cw4', 'Cw5', 'Cw6', 'Cw7', 'Cw8', 'Cw9', 'Cw10', 'Cw12', 'Cw14', 'Cw15', 'Cw16', 'Cw17', 'Cw18'],
  'HLA-DR': ['DR1', 'DR3', 'DR4', 'DR7', 'DR8', 'DR9', 'DR10', 'DR11', 'DR12', 'DR13', 'DR14', 'DR15', 'DR16', 'DR17', 'DR18'],
  'HLA-DQ': ['DQ2', 'DQ3', 'DQ4', 'DQ5', 'DQ6', 'DQ7', 'DQ8', 'DQ9'],
  'HLA-DP': ['DP1', 'DP2', 'DP3', 'DP4', 'DP5', 'DP6', 'DP7', 'DP8', 'DP9', 'DP10', 'DP11', 'DP13', 'DP14', 'DP17', 'DP18', 'DP19', 'DP20', 'DP21']
};

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

interface CPRAResult {
  score: number;
  riskLevel: string;
  compatibleDonors: number;
  recommendations: string[];
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

interface CPRAM3Result {
  cpra_percentage: number;
  confidence_interval: [number, number];
  prediction_confidence: number;
  model_performance: {
    algorithm: string;
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
  };
  feature_importance: Record<string, number>;
  risk_factors: {
    high_risk_combinations: string[];
    protective_factors: string[];
  };
  methodology: {
    model_type: string;
    training_data: string;
    cross_validation: string;
    ensemble_methods: string[];
  };
}

export default function Project7Page() {
  // Password protection states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const [hlaData, setHlaData] = useState<HLAData[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [cpraResult, setCpraResult] = useState<CPRAResult | null>(null);
  const [selectedAntigens, setSelectedAntigens] = useState<string[]>([]);
  const [patientEthnicity, setPatientEthnicity] = useState('mixed');
  const [expandedSection, setExpandedSection] = useState<string>('calculator');
  
  // M2 Calculator states
  const [cpraM2Result, setCpraM2Result] = useState<CPRAM2Result | null>(null);
  const [calculatingM2, setCalculatingM2] = useState(false);
  const [cpraM3Result, setCpraM3Result] = useState<CPRAM3Result | null>(null);
  const [calculatingM3, setCalculatingM3] = useState(false);
  const [selectedAntigensM3, setSelectedAntigensM3] = useState<Record<string, number[]>>({});
  const [patientAge, setPatientAge] = useState<number>(45);
  const [previousTransplants, setPreviousTransplants] = useState<number>(0);
  const [bloodType, setBloodType] = useState<string>('O');
  const [selectedAntigensM2, setSelectedAntigensM2] = useState<Record<string, number[]>>({});
  const [ethnicWeights, setEthnicWeights] = useState<Record<string, number>>({
    'Kuwaiti': 0.40,
    'Other Arab': 0.30,
    'South Asian': 0.20,
    'Southeast Asian': 0.08,
    'Other': 0.02
  });
  // ADHD Prediction states
  const [selectedMlAlgorithm, setSelectedMlAlgorithm] = useState<string>('ensemble');
  const [adhdInputs, setAdhdInputs] = useState<Record<string, number>>({});
  const [adhdResult, setAdhdResult] = useState<any>(null);
  const [adhdLoading, setAdhdLoading] = useState(false);
  
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

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const savedToken = localStorage.getItem('project7-auth-token');
        if (savedToken) {
          const response = await fetch('/api/project7-session', {
            headers: {
              'Authorization': `Bearer ${savedToken}`
            }
          });
          const data = await response.json();
          if (data.authenticated) {
            setAuthToken(savedToken);
            setIsAuthenticated(true);
          } else {
            // Token is invalid/expired, remove it
            localStorage.removeItem('project7-auth-token');
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
        localStorage.removeItem('project7-auth-token');
      }
    };
    
    checkSession();
  }, []);

  // Load HLA data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('✓ User authenticated, loading HLA data...');
      fetchHLAData();
    }
  }, [isAuthenticated]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPasswordError('');

    try {
      const response = await fetch('/api/verify-project7-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.token) {
          setAuthToken(data.token);
          localStorage.setItem('project7-auth-token', data.token);
          setIsAuthenticated(true);
          setPassword('');
        }
      } else {
        const errorData = await response.json();
        setPasswordError(errorData.error || 'Authentication failed. Please try again.');
      }
    } catch (error) {
      setPasswordError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If not authenticated, show elegant password form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader className="text-center pb-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                  className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                >
                  <Lock className="w-10 h-10 text-white" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Project 7 Access
                  </CardTitle>
                  <CardDescription className="text-gray-300 mt-3 text-lg">
                    This research dashboard is password protected. Please enter your access credentials to continue.
                  </CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent className="pt-6">
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  onSubmit={handlePasswordSubmit}
                  className="space-y-6"
                >
                  <div>
                    <Input
                      type="password"
                      placeholder="Enter access code"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-4 text-lg bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl transition-all duration-300"
                      autoFocus
                      disabled={isLoading}
                    />
                    {passwordError && (
                      <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-red-400 text-sm mt-3 flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {passwordError}
                      </motion.p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
                    disabled={!password.trim() || isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Verifying Access...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5" />
                        Access Dashboard
                      </div>
                    )}
                  </Button>
                </motion.form>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="mt-6 text-center"
                >
                  <p className="text-xs text-gray-400">
                    Authorized personnel only • Research data protected
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  const generateSampleHLAData = (): HLAData[] => {
    const sampleData: HLAData[] = [];
    Object.entries(hlaLoci).forEach(([locus, antigens]) => {
      antigens.forEach(antigen => {
        sampleData.push({
          locus,
          allele: antigen,
          frequency: Math.random() * 0.3 + 0.05, // Random frequency between 0.05 and 0.35
          ethnicity: 'Kuwaiti'
        });
      });
    });
    return sampleData;
  };

  const fetchHLAData = async () => {
    try {
      const response = await fetch('/api/hla-data');
      if (response.ok) {
        const data = await response.json();
        setHlaData(data.hlaFrequencies || []);
      } else {
        throw new Error('Failed to fetch HLA data');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load HLA data. Using default frequencies.",
        variant: "destructive",
      });
      // Use sample data if API fails
      setHlaData(generateSampleHLAData());
    } finally {
      setLoading(false);
    }
  };

  const calculateCPRA = () => {
    if (selectedAntigens.length === 0) {
      toast({
        title: "No antigens selected",
        description: "Please select at least one unacceptable antigen to calculate CPRA.",
        variant: "destructive",
      });
      return;
    }

    setCalculating(true);
    
    // Debug logging
    console.log('=== M1 CPRA Calculation Debug ===');
    console.log('Selected antigens:', selectedAntigens);
    console.log('HLA data loaded:', hlaData.length, 'records');
    console.log('Sample HLA data:', hlaData.slice(0, 5));

    // Simulate calculation delay
    setTimeout(() => {
      let totalIncompatibility = 0;
      let processedAntigens = 0;

      selectedAntigens.forEach(antigen => {
        // Parse antigen name to extract locus and allele number
        // UI format: 'A1', 'A2', 'B7', 'DR1', 'Cw1', 'DQ2', 'DP1'
        // Database format: locus='A', allele='1' (stored in separate columns)
        
        let locusToMatch = '';
        let alleleToMatch = '';
        
        // HLA-A, HLA-B patterns: 'A1' -> locus='A', allele='1'
        if (antigen.match(/^[AB]\d+$/)) {
          locusToMatch = antigen[0];
          alleleToMatch = antigen.substring(1);
        }
        // HLA-C patterns: 'Cw1' -> locus='C', allele='1'
        else if (antigen.match(/^Cw\d+$/)) {
          locusToMatch = 'C';
          alleleToMatch = antigen.substring(2);
        }
        // HLA-DR patterns: 'DR1' -> locus='DRB1' or 'DR', allele='1'
        else if (antigen.match(/^DR\d+$/)) {
          locusToMatch = 'DRB1'; // Try DRB1 first
          alleleToMatch = antigen.substring(2);
        }
        // HLA-DQ patterns: 'DQ2' -> locus='DQB1' or 'DQ', allele='2'
        else if (antigen.match(/^DQ\d+$/)) {
          locusToMatch = 'DQB1'; // Try DQB1 first
          alleleToMatch = antigen.substring(2);
        }
        // HLA-DP patterns: 'DP1' -> locus='DPB1' or 'DP', allele='1'
        else if (antigen.match(/^DP\d+$/)) {
          locusToMatch = 'DPB1'; // Try DPB1 first
          alleleToMatch = antigen.substring(2);
        }
        
        console.log(`Searching for antigen: ${antigen}, locus: ${locusToMatch}, allele: ${alleleToMatch}`);
        
        // Try to find a match in the database
        let hlaMatch = hlaData.find(hla => 
          hla.locus === locusToMatch && 
          (hla.allele === alleleToMatch || 
           hla.allele === parseInt(alleleToMatch).toString() ||
           parseInt(hla.allele) === parseInt(alleleToMatch))
        );
        
        console.log(`First match attempt: ${hlaMatch ? 'FOUND' : 'NOT FOUND'}`);
        
        // If DRB1/DQB1/DPB1 didn't match, try shorter form (DR/DQ/DP)
        if (!hlaMatch && locusToMatch.length > 2) {
          const shortLocus = locusToMatch.substring(0, 2) || locusToMatch.substring(0, 3);
          console.log(`Trying short locus: ${shortLocus}`);
          hlaMatch = hlaData.find(hla => 
            hla.locus === shortLocus && 
            (hla.allele === alleleToMatch || 
             hla.allele === parseInt(alleleToMatch).toString() ||
             parseInt(hla.allele) === parseInt(alleleToMatch))
          );
          console.log(`Short locus match attempt: ${hlaMatch ? 'FOUND' : 'NOT FOUND'}`);
        }
        
        if (hlaMatch) {
          console.log(`✓ Matched ${antigen} to locus=${hlaMatch.locus}, allele=${hlaMatch.allele}, freq=${hlaMatch.frequency}`);
          // Apply ethnicity weighting
          let adjustedFreq = hlaMatch.frequency;
          if (patientEthnicity === 'kuwaiti') {
            adjustedFreq *= 1.2; // Higher weight for Kuwaiti population
          } else if (patientEthnicity === 'arab') {
            adjustedFreq *= 1.1; // Moderate weight for Arab population
          }
          
          totalIncompatibility += Math.min(adjustedFreq, 1.0);
          processedAntigens++;
        }
      });

      // Check if any antigens were processed
      if (processedAntigens === 0) {
        setCalculating(false);
        toast({
          title: "No matching antigens found",
          description: "The selected antigens were not found in the HLA database. Please try different selections or contact support.",
          variant: "destructive",
        });
        return;
      }

      // Calculate CPRA score (percentage of incompatible donors)
      const cpraScore = Math.min((totalIncompatibility / processedAntigens) * 100, 95);
      const compatibleDonors = Math.round((100 - cpraScore) / 100 * 1000); // Assume 1000 total donors

      let riskLevel = 'Low';
      const recommendations: string[] = [];

      if (cpraScore >= 80) {
        riskLevel = 'Very High';
        recommendations.push('Consider desensitization therapy');
        recommendations.push('Explore virtual crossmatch protocols');
        recommendations.push('Consider paired kidney exchange programs');
      } else if (cpraScore >= 50) {
        riskLevel = 'High';
        recommendations.push('Monitor for compatible donors actively');
        recommendations.push('Consider expanded donor criteria');
      } else if (cpraScore >= 20) {
        riskLevel = 'Moderate';
        recommendations.push('Standard matching protocols sufficient');
        recommendations.push('Regular screening for new antibodies');
      } else {
        riskLevel = 'Low';
        recommendations.push('Excellent transplant compatibility');
      }

      setCpraResult({
        score: Math.round(cpraScore * 10) / 10,
        riskLevel,
        compatibleDonors,
        recommendations
      });
      setCalculating(false);
    }, 2000);
  };

  const toggleAntigen = (antigen: string) => {
    setSelectedAntigens(prev => 
      prev.includes(antigen) 
        ? prev.filter(a => a !== antigen)
        : [...prev, antigen]
    );
  };

  const resetCalculator = () => {
    setSelectedAntigens([]);
    setCpraResult(null);
    setPatientEthnicity('mixed');
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
      const response = await fetch('/api/cpra-m2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          unacceptable: selectedAntigensM2,
          ethnic_weights: ethnicWeights
        })
      });

      if (response.ok) {
        const result = await response.json();
        setCpraM2Result(result);
      } else {
        throw new Error('Failed to calculate CPRA M2');
      }
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

  // M3 Calculator Functions
  const toggleAntigenM3 = (locus: string, antigen: number) => {
    setSelectedAntigensM3(prev => {
      const locusList = prev[locus] || [];
      if (locusList.includes(antigen)) {
        return {
          ...prev,
          [locus]: locusList.filter(a => a !== antigen)
        };
      } else {
        return {
          ...prev,
          [locus]: [...locusList, antigen]
        };
      }
    });
  };

  const calculateCPRAM3 = async () => {
    setCalculatingM3(true);
    try {
      const response = await fetch('/api/cpra-m3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unacceptable: selectedAntigensM3,
          patient_age: patientAge,
          previous_transplants: previousTransplants,
          blood_type: bloodType,
          patient_ethnicity: patientEthnicity
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setCpraM3Result(data);
        toast({ title: "CPRA M3 calculated successfully", description: "ML-based prediction complete" });
      } else {
        throw new Error(data.message || 'Failed to calculate CPRA M3');
      }
    } catch (error: any) {
      console.error('CPRA M3 calculation failed:', error);
      toast({ title: "Calculation failed", description: error.message, variant: "destructive" });
    } finally {
      setCalculatingM3(false);
    }
  };

  const calculateAdhdPrediction = async () => {
    // Validate that at least some features have been filled in
    const filledFeatures = Object.values(adhdInputs).filter(val => val > 0).length;
    if (filledFeatures < 5) {
      toast({
        title: "Insufficient data",
        description: "Please provide ratings for at least 5 ADHD features for accurate prediction.",
        variant: "destructive",
      });
      return;
    }

    setAdhdLoading(true);
    try {
      const response = await fetch('/api/adhd/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          features: adhdInputs,
          algorithm: selectedMlAlgorithm
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setAdhdResult(data.prediction);
        toast({ 
          title: "ADHD prediction complete", 
          description: `Risk assessment using ${selectedMlAlgorithm} algorithm` 
        });
      } else {
        throw new Error(data.message || 'Failed to predict ADHD risk');
      }
    } catch (error: any) {
      console.error('ADHD prediction failed:', error);
      toast({ 
        title: "Prediction failed", 
        description: error.message || 'Failed to calculate ADHD prediction', 
        variant: "destructive" 
      });
    } finally {
      setAdhdLoading(false);
    }
  };

  const resetCalculatorM3 = () => {
    setSelectedAntigensM3({});
    setCpraM3Result(null);
    setPatientAge(45);
    setPreviousTransplants(0);
    setBloodType('O');
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
          style={{ backgroundImage: `url(${dnaBackground})` }}
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
                Comprehensive immunological compatibility assessment featuring three advanced methodologies
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <div className="group">
                  <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-300/30 px-4 py-2 rounded-full transition-all duration-300 hover:bg-blue-500/30 hover:scale-105">
                    <span className="text-blue-100 font-medium">M1: Basic frequency lookup method</span>
                  </div>
                </div>
                <div className="group">
                  <div className="bg-purple-500/20 backdrop-blur-sm border border-purple-300/30 px-4 py-2 rounded-full transition-all duration-300 hover:bg-purple-500/30 hover:scale-105">
                    <span className="text-purple-100 font-medium">M2: Hardy-Weinberg equilibrium with ethnic weighting</span>
                  </div>
                </div>
                <div className="group">
                  <div className="bg-orange-500/20 backdrop-blur-sm border border-orange-300/30 px-4 py-2 rounded-full transition-all duration-300 hover:bg-orange-500/30 hover:scale-105">
                    <span className="text-orange-100 font-medium">M3: Machine learning ensemble with confidence intervals</span>
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
                <a 
                  href="https://www.linkedin.com/in/ahmad-alsaber-phd-a11b7925/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-110"
                >
                  <img src={drAhmadPhoto} alt="Dr. Ahmad Alsaber" className="w-8 h-8 rounded-full border border-blue-300" />
                </a>
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
                  value="calculator" 
                  className="flex flex-col items-center gap-1.5 py-3 px-3 rounded-lg transition-all duration-300 data-[state=active]:bg-blue-50 data-[state=active]:shadow-md data-[state=active]:scale-105 hover:bg-blue-50/50 group min-w-[80px] border border-transparent data-[state=active]:border-blue-300 bg-white/80"
                >
                  <div className="p-1.5 rounded-md bg-blue-100 group-data-[state=active]:bg-blue-200 transition-colors">
                    <Calculator className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-gray-900 group-data-[state=active]:text-blue-900">M1</div>
                    <div className="text-xs text-gray-600 group-data-[state=active]:text-blue-700">Basic</div>
                  </div>
                </TabsTrigger>
                
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
                  value="calculator-m3" 
                  className="flex flex-col items-center gap-1.5 py-3 px-3 rounded-lg transition-all duration-300 data-[state=active]:bg-orange-50 data-[state=active]:shadow-md data-[state=active]:scale-105 hover:bg-orange-50/50 group min-w-[80px] border border-transparent data-[state=active]:border-orange-300 bg-white/80"
                >
                  <div className="p-1.5 rounded-md bg-orange-100 group-data-[state=active]:bg-orange-200 transition-colors">
                    <Zap className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-gray-900 group-data-[state=active]:text-orange-900">M3</div>
                    <div className="text-xs text-gray-600 group-data-[state=active]:text-orange-700">ML</div>
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
            <TabsList className="hidden md:grid w-full grid-cols-8 bg-white/70 backdrop-blur-sm border border-gray-200/60 shadow-lg rounded-2xl p-2 h-auto">
              <TabsTrigger 
                value="calculator" 
                className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl transition-all duration-300 data-[state=active]:bg-blue-50 data-[state=active]:shadow-md data-[state=active]:border-blue-200 hover:bg-blue-50/50 group"
              >
                <div className="p-2 rounded-lg bg-blue-100 group-data-[state=active]:bg-blue-200 transition-colors">
                  <Calculator className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900 group-data-[state=active]:text-blue-900">CPRA Calculator</div>
                  <div className="text-xs text-gray-600 group-data-[state=active]:text-blue-700 font-medium">M1 • Basic Frequency</div>
                </div>
              </TabsTrigger>
              
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
                value="calculator-m3" 
                className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl transition-all duration-300 data-[state=active]:bg-orange-50 data-[state=active]:shadow-md data-[state=active]:border-orange-200 hover:bg-orange-50/50 group"
              >
                <div className="p-2 rounded-lg bg-orange-100 group-data-[state=active]:bg-orange-200 transition-colors">
                  <Zap className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900 group-data-[state=active]:text-orange-900">CPRA Calculator</div>
                  <div className="text-xs text-gray-600 group-data-[state=active]:text-orange-700 font-medium">M3 • Machine Learning</div>
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

          {/* CPRA Calculator Tab */}
          <TabsContent value="calculator">
            <div className="grid lg:grid-cols-2 gap-4 lg:gap-8">
              {/* Input Panel */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                    Patient Information
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Select unacceptable antigens and patient ethnicity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 md:space-y-6">
                  <div>
                    <Label htmlFor="ethnicity">Patient Ethnicity</Label>
                    <Select value={patientEthnicity} onValueChange={setPatientEthnicity}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kuwaiti">Kuwaiti</SelectItem>
                        <SelectItem value="arab">Other Arab</SelectItem>
                        <SelectItem value="asian">Asian</SelectItem>
                        <SelectItem value="mixed">Mixed/Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Unacceptable Antigens</Label>
                    <p className="text-sm text-gray-600 mb-4">
                      Select antigens that the patient has developed antibodies against
                    </p>
                    
                    <div className="space-y-3 md:space-y-4 max-h-80 md:max-h-96 overflow-y-auto scrollbar-hide">
                      {Object.entries(hlaLoci).map(([locus, antigens]) => (
                        <div key={locus} className="border rounded-lg p-3 md:p-4">
                          <h4 className="font-medium text-gray-900 mb-2 md:mb-3 text-sm md:text-base">{locus}</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {antigens.map(antigen => (
                              <div key={antigen} className="flex items-center space-x-2">
                                <Checkbox
                                  id={antigen}
                                  checked={selectedAntigens.includes(antigen)}
                                  onCheckedChange={() => toggleAntigen(antigen)}
                                  className="h-4 w-4"
                                />
                                <Label htmlFor={antigen} className="text-xs md:text-sm cursor-pointer">{antigen}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={calculateCPRA} 
                      disabled={calculating || selectedAntigens.length === 0}
                      className="flex-1 h-10 md:h-12"
                      size="default"
                    >
                      {calculating ? 'Calculating...' : 'Calculate CPRA'}
                    </Button>
                    <Button variant="outline" onClick={resetCalculator} className="h-10 md:h-12 sm:w-auto">
                      Reset
                    </Button>
                  </div>

                  {selectedAntigens.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Selected Antigens ({selectedAntigens.length})</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedAntigens.map(antigen => (
                          <Badge key={antigen} variant="secondary" className="cursor-pointer" onClick={() => toggleAntigen(antigen)}>
                            {antigen} ×
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Results Panel */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    CPRA Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {calculating && (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-600">Calculating CPRA score...</p>
                      <Progress value={65} className="mt-4" />
                    </div>
                  )}

                  {cpraResult && !calculating && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className={`text-4xl font-bold ${getScoreColor(cpraResult.score)} mb-2`}>
                          {cpraResult.score}%
                        </div>
                        <p className="text-gray-600">CPRA Score</p>
                        <Badge variant={getRiskBadgeVariant(cpraResult.riskLevel)} className="mt-2">
                          {cpraResult.riskLevel} Risk
                        </Badge>
                      </div>

                      <div className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700">Compatible Donors:</span>
                          <span className="font-semibold text-green-600">{cpraResult.compatibleDonors}/1000</span>
                        </div>
                        <Progress value={(cpraResult.compatibleDonors / 1000) * 100} className="h-2" />
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                          Recommendations
                        </h4>
                        <ul className="space-y-2">
                          {cpraResult.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                              <span className="text-gray-700">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {!calculating && !cpraResult && (
                    <div className="text-center py-8 text-gray-500">
                      <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Select antigens and calculate CPRA to see results</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

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
                    
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {Object.entries(hlaLociM2).map(([locus, antigens]) => (
                        <div key={locus} className="border rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">
                            {locus} ({selectedAntigensM2[locus]?.length || 0} selected)
                          </h4>
                          <div className="grid grid-cols-6 gap-2">
                            {antigens.map(antigen => (
                              <div key={antigen} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${locus}-${antigen}`}
                                  checked={selectedAntigensM2[locus]?.includes(antigen) || false}
                                  onCheckedChange={() => toggleAntigenM2(locus, antigen)}
                                />
                                <Label htmlFor={`${locus}-${antigen}`} className="text-sm">
                                  {locus === 'C' ? `Cw${antigen}` : antigen}
                                </Label>
                              </div>
                            ))}
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

          {/* CPRA Calculator M3 Tab */}
          <TabsContent value="calculator-m3">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* M3 Input Panel */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-600" />
                    ML-Based CPRA Calculator (M3)
                  </CardTitle>
                  <CardDescription>
                    Advanced machine learning prediction with ensemble algorithms
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Patient Characteristics</Label>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <Label className="text-sm font-medium">Age:</Label>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={patientAge}
                          onChange={(e) => setPatientAge(parseInt(e.target.value) || 45)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Previous Transplants:</Label>
                        <Input
                          type="number"
                          min="0"
                          max="5"
                          value={previousTransplants}
                          onChange={(e) => setPreviousTransplants(parseInt(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Blood Type:</Label>
                        <Select value={bloodType} onValueChange={setBloodType}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="AB">AB</SelectItem>
                            <SelectItem value="O">O</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Ethnicity:</Label>
                        <Select value={patientEthnicity} onValueChange={setPatientEthnicity}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kuwaiti">Kuwaiti</SelectItem>
                            <SelectItem value="arab">Other Arab</SelectItem>
                            <SelectItem value="asian">Asian</SelectItem>
                            <SelectItem value="mixed">Mixed/Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Unacceptable Antigens (M3)</Label>
                    <p className="text-sm text-gray-600 mb-4">
                      ML model analyzes complex antigen patterns and interactions
                    </p>
                    
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {Object.entries(hlaLociM2).map(([locus, antigens]) => (
                        <div key={locus} className="border rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">
                            {locus} ({selectedAntigensM3[locus]?.length || 0} selected)
                          </h4>
                          <div className="grid grid-cols-6 gap-2">
                            {antigens.map(antigen => (
                              <div key={antigen} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`m3-${locus}-${antigen}`}
                                  checked={selectedAntigensM3[locus]?.includes(antigen) || false}
                                  onCheckedChange={() => toggleAntigenM3(locus, antigen)}
                                />
                                <Label htmlFor={`m3-${locus}-${antigen}`} className="text-sm">
                                  {locus === 'C' ? `Cw${antigen}` : antigen}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={calculateCPRAM3} 
                      disabled={calculatingM3 || Object.keys(selectedAntigensM3).length === 0}
                      className="flex-1"
                    >
                      {calculatingM3 ? 'Training ML Model...' : 'Calculate CPRA M3'}
                    </Button>
                    <Button variant="outline" onClick={resetCalculatorM3}>
                      Reset
                    </Button>
                  </div>

                  {Object.keys(selectedAntigensM3).length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">
                        Selected Antigens ({Object.values(selectedAntigensM3).reduce((sum, arr) => sum + arr.length, 0)} total)
                      </Label>
                      <div className="space-y-2 mt-2">
                        {Object.entries(selectedAntigensM3).map(([locus, antigens]) => (
                          <div key={locus} className="flex items-center gap-2">
                            <span className="text-sm font-medium text-orange-600">{locus}:</span>
                            <div className="flex flex-wrap gap-1">
                              {antigens.map(antigen => (
                                <Badge 
                                  key={antigen} 
                                  variant="secondary" 
                                  className="cursor-pointer" 
                                  onClick={() => toggleAntigenM3(locus, antigen)}
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

              {/* M3 Results Panel */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-600" />
                    CPRA M3 Results
                  </CardTitle>
                  <CardDescription>
                    Machine learning ensemble prediction with confidence intervals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {calculatingM3 && (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-600">Training ensemble ML models...</p>
                      <Progress value={85} className="mt-4" />
                    </div>
                  )}

                  {cpraM3Result && !calculatingM3 && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className={`text-4xl font-bold ${getScoreColor(cpraM3Result.cpra_percentage)} mb-2`}>
                          {cpraM3Result.cpra_percentage.toFixed(2)}%
                        </div>
                        <p className="text-gray-600">CPRA M3 Score</p>
                        <div className="text-sm text-gray-500 mt-1">
                          95% CI: [{cpraM3Result.confidence_interval[0].toFixed(1)}%, {cpraM3Result.confidence_interval[1].toFixed(1)}%]
                        </div>
                        <Badge variant="outline" className="mt-2">
                          {cpraM3Result.model_performance.algorithm}
                        </Badge>
                      </div>

                      <div className="border rounded-lg p-4 bg-orange-50">
                        <h4 className="font-medium text-gray-900 mb-3">Model Performance Metrics</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Accuracy:</span> {(cpraM3Result.model_performance.accuracy * 100).toFixed(1)}%
                          </div>
                          <div>
                            <span className="font-medium">Precision:</span> {(cpraM3Result.model_performance.precision * 100).toFixed(1)}%
                          </div>
                          <div>
                            <span className="font-medium">Recall:</span> {(cpraM3Result.model_performance.recall * 100).toFixed(1)}%
                          </div>
                          <div>
                            <span className="font-medium">F1-Score:</span> {(cpraM3Result.model_performance.f1_score * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-orange-200">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Prediction Confidence:</span>
                            <span className="text-sm font-bold text-orange-700">
                              {(cpraM3Result.prediction_confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={cpraM3Result.prediction_confidence * 100} className="mt-2 h-2" />
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 bg-blue-50">
                        <h4 className="font-medium text-gray-900 mb-3">Feature Importance</h4>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {Object.entries(cpraM3Result.feature_importance).map(([feature, importance]) => (
                            <div key={feature} className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">{feature}:</span>
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-gray-200 rounded-full">
                                  <div 
                                    className="h-full bg-blue-600 rounded-full" 
                                    style={{ width: `${importance * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{(importance * 100).toFixed(1)}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 bg-red-50">
                        <h4 className="font-medium text-gray-900 mb-3">Risk Assessment</h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-red-800">High-Risk Combinations:</p>
                            <ul className="text-xs text-gray-700 space-y-1 mt-2">
                              {cpraM3Result.risk_factors.high_risk_combinations.map((combo, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <div className="w-1 h-1 bg-red-600 rounded-full mt-1.5 flex-shrink-0"></div>
                                  {combo}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-green-800">Protective Factors:</p>
                            <ul className="text-xs text-gray-700 space-y-1 mt-2">
                              {cpraM3Result.risk_factors.protective_factors.map((factor, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <div className="w-1 h-1 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
                                  {factor}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 bg-gray-50">
                        <h4 className="font-medium text-gray-900 mb-3">ML Methodology</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Model Type:</span> {cpraM3Result.methodology.model_type}
                          </div>
                          <div>
                            <span className="font-medium">Training Data:</span> {cpraM3Result.methodology.training_data}
                          </div>
                          <div>
                            <span className="font-medium">Cross-Validation:</span> {cpraM3Result.methodology.cross_validation}
                          </div>
                          <div>
                            <span className="font-medium">Ensemble Methods:</span> {cpraM3Result.methodology.ensemble_methods.join(', ')}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {!calculatingM3 && !cpraM3Result && (
                    <div className="text-center py-8 text-gray-500">
                      <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Configure patient data and select antigens for ML prediction</p>
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
                    {Object.entries(hlaLoci).map(([locus, antigens]) => (
                      <div key={locus} className="border rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-3">{locus} Frequencies</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {antigens.slice(0, 10).map(antigen => {
                            const freq = hlaData.find(h => h.allele === antigen)?.frequency || 0;
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
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
                            <h4 className="font-semibold text-blue-900 mb-2">Method 1: Basic Frequency Lookup</h4>
                            <div className="font-mono text-sm bg-white p-3 rounded border">
                              CPRA = Σ(f<sub>i</sub>) where f<sub>i</sub> = frequency of unacceptable antigen i
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-5 border border-purple-200">
                            <h4 className="font-semibold text-purple-900 mb-2">Method 2: Hardy-Weinberg Equilibrium</h4>
                            <div className="font-mono text-sm bg-white p-3 rounded border">
                              CPRA = Σ w<sub>e</sub> (1 - Π<sub>L</sub> (1 - Σ p<sub>e,u</sub>)²)
                            </div>
                            <p className="text-xs text-purple-700 mt-2">
                              Incorporating population genetics principles with ethnic stratification
                            </p>
                          </div>
                          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-5 border border-orange-200">
                            <h4 className="font-semibold text-orange-900 mb-2">Method 3: Machine Learning Ensemble</h4>
                            <div className="font-mono text-sm bg-white p-3 rounded border">
                              CPRA = Ensemble(RF, GB, NN) + CI<sub>95%</sub>
                            </div>
                            <p className="text-xs text-orange-700 mt-2">
                              Advanced ML with Random Forest, Gradient Boosting, and Neural Networks
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
                            <div className="text-3xl font-bold text-indigo-600">94.0%</div>
                            <div className="text-sm text-gray-600">ML Model Accuracy</div>
                          </div>
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
                  Patient CPRA Comparative Analysis
                </CardTitle>
                <CardDescription className="text-rose-100 text-base">
                  Multi-methodology CPRA calculations for transplant candidates
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Summary Statistics - Mobile optimized */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                    <div className="bg-white rounded-xl shadow-md border border-blue-200 p-4 md:p-6 text-center">
                      <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1 md:mb-2">150</div>
                      <div className="text-xs md:text-sm text-gray-600">Total Patients</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md border border-purple-200 p-4 md:p-6 text-center">
                      <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1 md:mb-2">62.4%</div>
                      <div className="text-xs md:text-sm text-gray-600">Avg M2 CPRA</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md border border-orange-200 p-4 md:p-6 text-center">
                      <div className="text-2xl md:text-3xl font-bold text-orange-600 mb-1 md:mb-2">65.7%</div>
                      <div className="text-xs md:text-sm text-gray-600">Avg M3 CPRA</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md border border-green-200 p-4 md:p-6 text-center">
                      <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1 md:mb-2">0.96</div>
                      <div className="text-xs md:text-sm text-gray-600">M2-M3 Correlation</div>
                    </div>
                  </div>

                  {/* Patient Results Table - Mobile optimized */}
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-3 md:p-4 border-b border-gray-200">
                      <h3 className="text-base md:text-lg font-bold text-gray-900">Patient CPRA Results Comparison</h3>
                      <p className="text-xs md:text-sm text-gray-600 mt-1">Calculated using M1 (Basic), M2 (Hardy-Weinberg), and M3 (Machine Learning) methodologies</p>
                    </div>
                    
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
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div className="bg-blue-50 rounded p-2">
                                <div className={`text-sm font-medium ${getScoreColor(patient.m1)}`}>{patient.m1.toFixed(1)}%</div>
                                <div className="text-xs text-blue-600">M1</div>
                              </div>
                              <div className="bg-purple-50 rounded p-2">
                                <div className={`text-sm font-medium ${getScoreColor(patient.m2)}`}>{patient.m2.toFixed(1)}%</div>
                                <div className="text-xs text-purple-600">M2</div>
                              </div>
                              <div className="bg-orange-50 rounded p-2">
                                <div className={`text-sm font-medium ${getScoreColor(patient.m3)}`}>{patient.m3.toFixed(1)}%</div>
                                <div className="text-xs text-orange-600">M3</div>
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
                            <th className="px-6 py-4 text-center text-xs font-semibold text-blue-600 uppercase tracking-wider bg-blue-50">M1 CPRA<br/><span className="text-xs normal-case">Basic</span></th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-purple-600 uppercase tracking-wider bg-purple-50">M2 CPRA<br/><span className="text-xs normal-case">Hardy-Weinberg</span></th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-orange-600 uppercase tracking-wider bg-orange-50">M3 CPRA<br/><span className="text-xs normal-case">ML Ensemble</span></th>
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
                              <tr key={patient.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{patient.age}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{patient.ethnicity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{patient.antigens}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center bg-blue-25 ${getScoreColor(patient.m1)}`}>
                                  {patient.m1.toFixed(1)}%
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center bg-purple-25 ${getScoreColor(patient.m2)}`}>
                                  {patient.m2.toFixed(1)}%
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center bg-orange-25 ${getScoreColor(patient.m3)}`}>
                                  {patient.m3.toFixed(1)}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(patient.risk)}`}>
                                    {patient.risk}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Pagination Controls - Mobile optimized */}
                    <div className="px-3 md:px-6 py-3 md:py-4 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
                      <div className="flex items-center text-xs md:text-sm text-gray-600">
                        Showing {startIndex + 1} to {Math.min(endIndex, allPatients.length)} of {allPatients.length} patients
                      </div>
                      <div className="flex items-center space-x-1 md:space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="flex items-center space-x-1"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Previous</span>
                        </Button>
                        
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className="w-8 h-8 p-0"
                            >
                              {page}
                            </Button>
                          ))}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="flex items-center space-x-1"
                        >
                          <span>Next</span>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Analysis Summary */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                      <CardHeader>
                        <CardTitle className="text-blue-900 text-lg">Methodology Comparison</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-blue-800">M1 vs M2 Correlation:</span>
                            <span className="font-semibold text-blue-900">0.89</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-blue-800">M2 vs M3 Correlation:</span>
                            <span className="font-semibold text-blue-900">0.94</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-blue-800">M1 vs M3 Correlation:</span>
                            <span className="font-semibold text-blue-900">0.91</span>
                          </div>
                          <div className="pt-2 border-t border-blue-200">
                            <span className="text-xs text-blue-700">Strong correlation validates methodology consistency</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50">
                      <CardHeader>
                        <CardTitle className="text-rose-900 text-lg">Risk Stratification</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-rose-800">Low Risk (&lt;40%):</span>
                            <span className="font-semibold text-green-600">32 patients</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-rose-800">Moderate Risk (40-70%):</span>
                            <span className="font-semibold text-yellow-600">58 patients</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-rose-800">High Risk (70-85%):</span>
                            <span className="font-semibold text-orange-600">43 patients</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-rose-800">Very High Risk (&gt;85%):</span>
                            <span className="font-semibold text-red-600">17 patients</span>
                          </div>
                          <div className="pt-2 border-t border-rose-200">
                            <span className="text-xs text-rose-700">M3 methodology provides most accurate risk assessment</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
                        <img src={asiaLogo} alt="ASIA Logo" className="w-8 h-8 rounded-full" />
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

                        {/* Impact & Recognition */}
                        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-6 border border-purple-200">
                          <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Research Impact & Future Directions
                          </h3>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600 mb-2">96%</div>
                              <div className="text-sm text-purple-800">ML Model Accuracy</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-indigo-600 mb-2">150</div>
                              <div className="text-sm text-indigo-800">Patient Validations</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600 mb-2">3</div>
                              <div className="text-sm text-purple-800">Advanced Methodologies</div>
                            </div>
                          </div>
                          <p className="text-purple-800 text-sm mt-4 text-center italic">
                            Advancing precision medicine through computational excellence
                          </p>
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
                                  <a 
                                    href="https://www.linkedin.com/in/ahmad-alsaber-phd-a11b7925/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="transition-transform hover:scale-110"
                                  >
                                    <img src={drAhmadPhoto} alt="Dr. Ahmad Alsaber" className="w-4 h-4 rounded-full border border-indigo-300" />
                                  </a>
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