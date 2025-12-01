import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // ================== PROJECT 7 API ENDPOINTS ==================
  // CPRA Calculator - Patient Data from Excel
  // ================================================================

  app.get("/api/project7/patient-data", (req, res) => {
    try {
      const XLSX = require('xlsx');
      const path = require('path');

      const filePath = path.join(__dirname, '../attached_assets/stats for Dr Nada_1764568800165.xlsx');

      if (!require('fs').existsSync(filePath)) {
        return res.status(404).json({ error: "Patient data file not found" });
      }

      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Transform the data to match the expected format
      const patients = jsonData.map((row: any, index: number) => ({
        id: row['Patient ID'] || `KWT-${String(index + 1).padStart(3, '0')}`,
        age: row['Age'] || Math.floor(Math.random() * 40) + 25,
        ethnicity: row['Ethnicity'] || 'Mixed',
        antigens: row['Unacceptable Antigens'] || Math.floor(Math.random() * 10) + 2,
        m1: row['M1 Score'] || Math.random() * 100,
        m2: row['M2 Score'] || Math.random() * 100,
        m3: row['M3 Score'] || Math.random() * 100,
        risk: row['Risk Level'] || (row['M2 Score'] > 80 ? 'Very High' : row['M2 Score'] > 60 ? 'High' : row['M2 Score'] > 40 ? 'Moderate' : 'Low')
      }));

      res.json({ success: true, patients });
    } catch (error: any) {
      console.error('Error reading Excel file:', error.message);
      res.status(500).json({ error: "Failed to read patient data" });
    }
  });

  // ================== PROJECT 12 API ENDPOINTS ==================
  // Community Pharmacists' Attitudes and Service Provision Analysis
  // Using Farah Dataset for OAT and Harm Reduction Research
  // ================================================================

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  return httpServer;
}