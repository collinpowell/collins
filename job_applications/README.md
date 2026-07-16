# Job Application Master Guide

This directory contains the central repository for Collins' job applications, resumes, cover letters, and application history.

## User Profile & Assets

When generating resumes or cover letters for Collins, strictly adhere to the following profile details:

### Target Roles
1. **Ausbildung (Vocational Training):** Specifically targeting "Fachinformatiker Anwendungsentwicklung" (IT Specialist in Application Development).
   - **Language:** Applications must be in **German** (B1/B2 level focus).
   - **Strategy:** Highlight Collins' fast-learning capability, current intense study of German (aiming for B1/B2), and the massive advantage of already having 2 years of verified coding experience.
2. **IT Specialist (Direct Employment - Germany / Finland / EU):** 
   - **Language:** English.
   - **Strategy:** Highlight 2+ years of *verified* work history to bypass degree requirements under the German Skilled Immigration Act or similar EU tech visa schemes (e.g., Finland's Specialist Residence Permit). Focus on the ability to ship production-ready code immediately and architect scalable platforms.

### File Formats
- **PDF Requirement:** Always ensure the final Resume and Cover Letter are delivered in **PDF format** (or as a beautifully formatted Markdown/Word document accompanied by instructions to explicitly save as PDF) because German and Finnish employers expect standard, unalterable PDF attachments.

### Key Details to Include
- **Experience:** Diverse background including Blockchain, App (Flutter/React Native), Web (Frontend/Backend), and Embedded Systems/IoT.
- **Verification:** Emphasize **2 years of verified work experience** (vital for the IT Specialist Visa).
- **Language:** English (Native/Fluent), German (currently A1 basic, actively learning).
- **Education:** BSc in Computer Science (Note: No transcript or certificate is currently available, so focus heavily on the verified work experience instead).

### Proof of Work & Technical Emphases
German employers heavily value concrete, undeniable proof of technical competence. When referencing past roles or projects:
- **Lupply Deployments:** Always explicitly mention that Lupply is a live, production-grade application and that **Collins solely handled all deployments, maintenance, and CI/CD pipelines (e.g., Fastlane for mobile apps).** Highlight that it has active users, an admin dashboard, and is live across multiple app stores. **Always include the direct live links** as undeniable proof of full-stack competence.
- **Personal/Other Projects:** Treat all portfolio projects similarly. Ensure every project mentioned on the CV or Cover Letter includes a direct hyperlink to the live site, the Play Store, or the public GitHub repository. Do not list a project without its corresponding undeniable proof.
- **Embedded Systems Proof:** If an application heavily involves embedded systems, hardware, or IoT, **explicitly ask Collins to provide pictures or video proof of his hardware builds** so they can be bundled with the application. He has them ready.

## Tactical Application Tips (From Gemini Consult)
When writing application materials or advising Collins, strictly adhere to the following playbook:
- **CV Structure (Direct Jobs):** Lead with the GitHub and Portfolio links at the *very top* of the CV. Without a formal degree, German hiring managers must immediately see the code structure and deployed apps.
- **CV Structure (Language wording):** Always add a dedicated "Languages" section that explicitly states: *"English (Native), German (A1 - Actively accelerating via intensive daily study to reach B1/B2)."* This shows proactive effort.
- **Ausbildung Employer Targets:** Avoid small local businesses for Ausbildung. Target large, international German enterprises (e.g., Siemens, SAP, Deutsche Telekom). They have dedicated HR teams equipped to handle visa sponsorships for international trainees.
- **Reference Letters (Arbeitszeugnis):** German corporate culture heavily relies on written proof. Remind Collins to gather reference letters for his 2 years of work, explicitly stating job titles, dates, and technical performance.
- **Legal Work Restrictions:** Ensure Collins knows that **freelancing is strictly illegal** on an Ausbildung visa ("Selbständige Tätigkeit nicht erlaubt"). However, a standard part-time "Minijob" (up to 20 hours/week, earning ~€556 tax-free) is perfectly legal and encouraged.
- **The 3rd Path (Chancenkarte):** Keep in mind the "Opportunity Card" (Chancenkarte)—a points-based job-seeker visa that could allow Collins to move to Germany for up to a year to network and find a job locally if applying from abroad becomes too slow.

## Instructions for AI Agents

Whenever you are asked to create a new resume, cover letter, or start a job application process:

1. **Check for Proof:** If the application requires verifying his 2 years of experience or co-foundership, immediately **notify Collins** to ensure he attaches or uploads the relevant proof from the `proof_documents/` folder.
2. **Create a New Folder:** Inside `collins/job_applications/applications/`, create a new folder named after the company or role (e.g., `company_name_role/`).
2. **Generate Documents:** Create the tailored resume and/or cover letter inside this new folder.
3. **Create a README:** Inside the new folder, create a `README.md` that explains the strategy used for that specific application, which template was used, and any specific notes (e.g., "Tailored for IT Specialist emphasizing 2 years experience").
4. **Update Tracker:** Add an entry to the `application_tracker.txt` file in the root of this directory.

### The "Wiki Technique" for Writing
When generating any application materials (cover letters, resumes, emails), you MUST use the **Wiki Technique**:
- Actively avoid common patterns that make text look AI-generated.
- **Do not use** cliché AI transition phrases (e.g., "It's important to note," "Furthermore," "In conclusion").
- **Do not use** overused AI vocabulary (e.g., "Delve," "Leverage," "Tapestry," "Testament").
- Keep the writing clear, concise, direct, and human-sounding. Emulate a professional yet straightforward tone.

## Directory Structure
- `archive/`: Contains old resumes, cover letters, and reports.
- `applications/`: Contains new, tailored applications (each in their own subfolder).
- `application_tracker.txt`: Log of all sent applications and their status.
