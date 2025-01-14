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
  
  // Insert project
  await db.insert(projects).values({
    id,
    name: data.name,
    repository: data.repository,
    code: data.code,
    status: 'pending',
    issues: 0,
    lastScan: new Date()
  })

  // Analyze code
  const response = await fetch('http://127.0.0.1:8000/analyze-php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: data.code })
  })

  const result = await response.json()
  
  // Parse analysis results
  const vulnId = crypto.randomUUID()

  // Parse the analysis results
  const analysisResults = result.analysis_results
  const description = analysisResults.split('Description:')[1].split('\n')[0].trim()
  const severity = analysisResults.includes('Severity: High') ? 'high' : 
                  analysisResults.includes('Severity: Medium') ? 'medium' : 'low'
  const status = analysisResults.includes('Non-vulnerable') ? 'closed' : 'open'
  
  await db.insert(vulnerabilities).values({
    id: vulnId,
    projectId: id,
    title: status === 'open' ? 'Security Vulnerability Detected' : 'No Vulnerability Found',
    severity,
    description,
    code: data.code,
    location: data.repository,
    status,
    createdAt: new Date()
  })
  
  return { id }
}