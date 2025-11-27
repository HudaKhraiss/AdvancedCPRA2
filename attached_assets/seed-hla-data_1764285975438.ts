import * as XLSX from 'xlsx';
import { readFileSync } from 'fs';
import { join } from 'path';
import { storage } from './storage';
import type { InsertHlaFrequency } from '@shared/schema';

// HLA locus patterns for parsing Excel data
const DEFAULT_LOCUS_PATTERNS = {
  "A":    ["HLA A SET1", "HLA A SET2", "HLA A SET12"],
  "B":    ["HLA B SET1", "HLA B SET2"],
  "C":    ["HLA C SET1", "HLA C SET2"],
  "DRB1": ["HLA DRB1 SET1", "HLA DRB1 SET 2", "HLA DRB1 SET2"],
  "DRB3": ["HLA DRB3 SET1", "HLA DRB3 SET2"],
  "DRB4": ["HLA DRB4 SET1", "HLA DRB4 SET2"],
  "DRB5": ["HLA DRB5 SET1", "HLA DRB5 SET2"],
  "DQB1": ["HLA DQB1 SET1", "HLA DQB1 SET2"],
  "DQA1": ["HLA DQA1 SET1", "HLA DQA1 SET2"],
  "DPA1": ["HLA DPA1 SET1", "HLA DPA1 SET2"],
  "DPB1": ["HLA DPB1 SET1", "HLA DPB1 SET2"],
};

// Find two columns that match the patterns for a locus
function findTwoColumns(columns: string[], candidates: string[]): [string, string] | null {
  const matched: string[] = [];
  for (const candidate of candidates) {
    for (const col of columns) {
      if (col.toLowerCase().includes(candidate.toLowerCase()) || 
          candidate.toLowerCase().includes(col.toLowerCase())) {
        if (!matched.includes(col)) {
          matched.push(col);
        }
      }
    }
  }
  
  if (matched.length >= 2) {
    return [matched[0], matched[1]];
  }
  return null;
}

// Calculate allele frequencies from Excel data
function calculateAlleleFrequencies(
  workbook: XLSX.WorkBook,
  sheetName: string,
  ethnicityColumn?: string
): { [locus: string]: { [ethnicity: string]: { [allele: string]: number } } } {
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
  
  if (data.length < 2) {
    throw new Error(`Insufficient data in sheet ${sheetName}`);
  }
  
  const headers = data[0] as string[];
  const rows = data.slice(1);
  
  const frequencies: { [locus: string]: { [ethnicity: string]: { [allele: string]: number } } } = {};
  
  // Process each locus
  for (const [locus, candidates] of Object.entries(DEFAULT_LOCUS_PATTERNS)) {
    const columnPair = findTwoColumns(headers, candidates);
    if (!columnPair) {
      console.warn(`No columns found for locus ${locus}`);
      continue;
    }
    
    const [col1, col2] = columnPair;
    const col1Index = headers.indexOf(col1);
    const col2Index = headers.indexOf(col2);
    
    frequencies[locus] = {};
    
    // Group by ethnicity if specified
    const ethnicityIndex = ethnicityColumn ? headers.indexOf(ethnicityColumn) : -1;
    const ethnicGroups: { [ethnicity: string]: any[][] } = {};
    
    if (ethnicityIndex >= 0) {
      // Group rows by ethnicity
      for (const row of rows) {
        const ethnicity = row[ethnicityIndex] || 'Unknown';
        if (!ethnicGroups[ethnicity]) {
          ethnicGroups[ethnicity] = [];
        }
        ethnicGroups[ethnicity].push(row);
      }
    } else {
      // Single group for all data
      ethnicGroups['ALL'] = rows;
    }
    
    // Calculate frequencies for each ethnic group
    for (const [ethnicity, groupRows] of Object.entries(ethnicGroups)) {
      const alleleCounts: { [allele: string]: number } = {};
      let totalAlleles = 0;
      
      for (const row of groupRows) {
        const allele1 = row[col1Index];
        const allele2 = row[col2Index];
        
        if (allele1 && !isNaN(Number(allele1))) {
          const alleleStr = String(allele1);
          alleleCounts[alleleStr] = (alleleCounts[alleleStr] || 0) + 1;
          totalAlleles++;
        }
        
        if (allele2 && !isNaN(Number(allele2))) {
          const alleleStr = String(allele2);
          alleleCounts[alleleStr] = (alleleCounts[alleleStr] || 0) + 1;
          totalAlleles++;
        }
      }
      
      // Convert counts to frequencies
      frequencies[locus][ethnicity] = {};
      for (const [allele, count] of Object.entries(alleleCounts)) {
        frequencies[locus][ethnicity][allele] = count / totalAlleles;
      }
    }
  }
  
  return frequencies;
}

// Main seeding function
export async function seedHlaData(): Promise<void> {
  try {
    console.log('🔄 Starting HLA data seeding...');
    
    // Check if data already exists
    const existingFrequencies = await storage.getHlaFrequencies();
    if (existingFrequencies.length > 0) {
      console.log(`✓ HLA data already exists (${existingFrequencies.length} records). Skipping seed.`);
      return;
    }
    
    // Load Excel file
    const excelPath = join(process.cwd(), 'attached_assets', 'HLA Data_1756313608654.xlsx');
    const fileBuffer = readFileSync(excelPath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    
    console.log('📊 Available sheets:', workbook.SheetNames);
    
    // Use the first sheet
    const sheetName = workbook.SheetNames[0];
    console.log(`📋 Processing sheet: ${sheetName}`);
    
    // Calculate frequencies
    const frequencies = calculateAlleleFrequencies(workbook, sheetName);
    
    // Convert to database format
    const hlaFrequencyRecords: InsertHlaFrequency[] = [];
    
    for (const [locus, ethnicGroups] of Object.entries(frequencies)) {
      for (const [ethnicity, alleles] of Object.entries(ethnicGroups)) {
        for (const [allele, frequency] of Object.entries(alleles)) {
          hlaFrequencyRecords.push({
            locus,
            allele,
            frequency,
            ethnicity,
            populationGroup: 'Kuwait'
          });
        }
      }
    }
    
    console.log(`💾 Saving ${hlaFrequencyRecords.length} HLA frequency records...`);
    
    // Bulk insert to database
    if (hlaFrequencyRecords.length > 0) {
      await storage.bulkCreateHlaFrequencies(hlaFrequencyRecords);
      
      // Create data source record
      await storage.createHlaDataSource({
        fileName: 'HLA Data_1756313608654.xlsx',
        recordCount: hlaFrequencyRecords.length,
        lociProcessed: Object.keys(frequencies),
        ethnicGroups: Object.keys(frequencies).reduce((acc, locus) => {
          const groups = Object.keys(frequencies[locus]);
          groups.forEach(group => {
            if (!acc.includes(group)) acc.push(group);
          });
          return acc;
        }, [] as string[]),
        processingNotes: `Processed ${Object.keys(frequencies).length} loci with ${hlaFrequencyRecords.length} total frequencies`
      });
    }
    
    console.log('✅ HLA data seeding completed successfully!');
    console.log(`📈 Processed loci: ${Object.keys(frequencies).join(', ')}`);
    
    // Log summary statistics
    for (const [locus, ethnicGroups] of Object.entries(frequencies)) {
      const totalAlleles = Object.values(ethnicGroups).reduce((sum, alleles) => 
        sum + Object.keys(alleles).length, 0
      );
      console.log(`   ${locus}: ${totalAlleles} unique alleles across ${Object.keys(ethnicGroups).length} ethnic groups`);
    }
    
  } catch (error: any) {
    console.error('❌ HLA data seeding failed:', error.message);
    throw error;
  }
}

// Export individual functions for testing
export { calculateAlleleFrequencies, findTwoColumns };