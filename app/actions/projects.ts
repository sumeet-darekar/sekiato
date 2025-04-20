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
  if (fileType == 'c++' || fileType == 'cpp') {
    url = "http://127.0.0.1:8000/predict"
  }
  else if (fileType == 'js') {
    url = "http://127.0.0.1:8001/predict"
  }
  else if (fileType == 'php') {
    url = "http://127.0.0.1:8003/predict"
  }
  

  // Analyze code php
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: data.code })
  })


  const result = await response.json()
  console.log(result);
  // Parse analysis results
  const vulnId = crypto.randomUUID()




if (fileType == 'c++' || fileType == 'cpp') {
  // Parse the analysis results
  
  const analysisResults = result.SekiAto_Analysis;
//const parsedResults = parseAnalysisResults(analysisResults);
const description = analysisResults.explanation;
const severity = "high";
const status = analysisResults.vulnerability_status;

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

  const description = result.description		
  const severity = result.severity		
  const status = result.status	
  
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
else if (fileType == 'php') {

  console.log(result);
  
  const description = result.description + result.vulnerable_code	;
  const severity = result.severity;
  const title = result.name ;	
  const status = result.status;	

  await db.insert(vulnerabilities).values({
    id: vulnId,
    projectId: id,
    title,
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