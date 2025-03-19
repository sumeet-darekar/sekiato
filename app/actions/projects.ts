'use server'

import { db } from '@/lib/db'
import { projects, vulnerabilities } from '@/lib/db/schema'
import type { CreateProjectData } from '@/lib/types/project'
import crypto from 'crypto'


export async function getProjects() {
  return await db.select().from(projects)
}


export async function getVulnerabilities() {
  return await db.select().from(vulnerabilities)
}

export async function saveProject(data: CreateProjectData) {
  const id = crypto.randomUUID()
  
  // Determine file type
  const fileType = data.repository.split('.').pop()
console.log(fileType)
  // Insert project
  await db.insert(projects).values({
    id,
    name: data.name,
    repository: data.repository,
    code: data.code,
    status: 'pending',
    issues: 0,
    lastScan: new Date(),

  })
  var url = ""
  if (fileType == 'php') {
    url = "http://127.0.0.1:8000/predict"
  }
  else if (fileType == 'js') {
    url = "http://127.0.0.1:8001/predict"
  }
  

  // Analyze code php
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: data.code })
  })

  const result = await response.json()
  
  // Parse analysis results
  const vulnId = crypto.randomUUID()


//explanation function
function parseExplanation(analysisResults: string): string {
  // Extract content between "Explanation:" and the next section
  const explanationMatch = analysisResults.match(/\*\*Explanation:\*\*([\s\S]*?)(?=\*\*[A-Za-z]|$)/);
  
  if (!explanationMatch) {
    return 'No explanation available';
  }

  // Clean up the extracted explanation
  const explanation = explanationMatch[1]
    .trim()
    .replace(/\n+/g, '\n') // Normalize line breaks
    .replace(/^\s+/gm, ''); // Remove leading spaces from each line

  return explanation;
}

if (fileType == 'php') {
  // Parse the analysis results
  const analysisResults = result.llm_response	
  const description = parseExplanation(analysisResults)
  const severity = analysisResults.includes('Severity: High') ? 'high' : 
                  analysisResults.includes('Severity: Medium') ? 'medium' : 'low'
  const status = result.predicted_label	
  
  await db.insert(vulnerabilities).values({
    id: vulnId,
    projectId: id,
    title: status === 'Vulnerable' ? 'Security Vulnerability Detected' : 'No Vulnerability Found',
    severity,
    description,
    code: data.code,
    location: data.repository,
    status,
    createdAt: new Date()
  })
}
else if (fileType == 'js') {

  function parsejs(analysisResults: string): string {
    // Extract content after "Answer:" until the next section
    const answerMatch = analysisResults.match(/Answer:(.*?)(?=\n\n|$)/s);

    if (!answerMatch) {
        return 'No answer available';
    }

    return answerMatch[1].trim(); // Return the full answer text, trimmed of whitespace
}
  const analysisResults = result.Explanation	
  const description = parsejs(analysisResults)
  const severity = analysisResults.includes('Severity: High') ? 'high' : 
                  analysisResults.includes('Severity: Medium') ? 'medium' : 'low'
  const status = result.vulnerability_status	
  
  await db.insert(vulnerabilities).values({
    id: vulnId,
    projectId: id,
    title: status === 'Vulnerable' ? 'Security Vulnerability Detected' : 'No Vulnerability Found',
    severity,
    description,
    code: data.code,
    location: data.repository,
    status,
    createdAt: new Date()
  })

}
  return { id }
}