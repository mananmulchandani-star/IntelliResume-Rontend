import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Main PDF download function for resumes
 * @param {string} templateType - The template type ('modern', 'irm', 'simple', etc.)
 */
export const downloadResumePDF = async (templateType) => {
  try {
    console.log('Starting PDF generation for template:', templateType);
    
    // Find the resume content element
    const resumeElement = document.getElementById('resume-content');
    if (!resumeElement) {
      throw new Error('Resume content element not found. Make sure you have an element with id="resume-content"');
    }
    
    // Create a deep clone of the resume element
    const clone = resumeElement.cloneNode(true);
    
    // Apply PDF-specific classes and styles
    clone.classList.add('pdf-export');
    clone.style.width = '210mm'; // A4 width
    clone.style.minHeight = '297mm'; // A4 height
    clone.style.margin = '0';
    clone.style.padding = '20px';
    clone.style.backgroundColor = 'white';
    clone.style.color = 'black';
    
    // Remove interactive and problematic elements
    const elementsToRemove = clone.querySelectorAll(
      'button, a, [onclick], .no-print, .interactive, .download-btn, .edit-btn'
    );
    elementsToRemove.forEach(el => el.remove());
    
    // Template-specific fixes
    if (templateType === 'modern' || templateType === 'irm') {
      console.log('Applying Modern/IRM template fixes...');
      
      // Fix container overflows
      const containers = clone.querySelectorAll('.container, .section, .resume-section, .content');
      containers.forEach(container => {
        container.style.overflow = 'visible';
        container.style.height = 'auto';
        container.style.maxHeight = 'none';
        container.classList.add('pdf-fix');
      });
      
      // Fix text rendering
      const textElements = clone.querySelectorAll('p, span, div, li, h1, h2, h3, h4, h5, h6');
      textElements.forEach(el => {
        el.style.whiteSpace = 'normal';
        el.style.wordWrap = 'break-word';
        el.style.overflow = 'visible';
        el.style.maxWidth = '100%';
      });
      
      // Remove absolute positioning that breaks PDF
      const absoluteElements = clone.querySelectorAll('[style*="absolute"], [style*="fixed"]');
      absoluteElements.forEach(el => {
        el.style.position = 'relative';
        el.style.top = 'auto';
        el.style.left = 'auto';
        el.style.right = 'auto';
        el.style.bottom = 'auto';
      });
      
      // Fix flexbox/grid issues
      const flexContainers = clone.querySelectorAll('[style*="flex"], [style*="grid"]');
      flexContainers.forEach(container => {
        container.style.display = 'block';
      });
    }
    
    // Create a temporary hidden container for PDF generation
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.zIndex = '-9999';
    tempContainer.style.visibility = 'hidden';
    tempContainer.appendChild(clone);
    document.body.appendChild(tempContainer);
    
    // Generate canvas with optimized settings
    const canvas = await html2canvas(clone, {
      scale: 2, // Higher resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 794, // A4 width in pixels at 96 DPI
      height: clone.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: clone.scrollWidth,
      windowHeight: clone.scrollHeight,
      onclone: (clonedDoc, element) => {
        // Apply additional styles to the cloned document
        const style = clonedDoc.createElement('style');
        style.textContent = `
          @media print {
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              max-width: 100% !important;
            }
            body {
              margin: 0 !important;
              padding: 0 !important;
              width: 210mm !important;
              background: white !important;
            }
            .resume-section {
              page-break-inside: avoid;
            }
          }
        `;
        clonedDoc.head.appendChild(style);
      }
    });
    
    // Clean up temporary container
    document.body.removeChild(tempContainer);
    
    // Convert canvas to PDF
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate image dimensions to fit PDF
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const scaledWidth = imgWidth * ratio;
    const scaledHeight = imgHeight * ratio;
    
    // Add image to PDF
    pdf.addImage(imgData, 'PNG', 0, 0, scaledWidth, scaledHeight, '', 'FAST');
    
    // Save the PDF
    pdf.save('resume.pdf');
    
    console.log('PDF generated successfully');
    
  } catch (error) {
    console.error('PDF download error:', error);
    
    // User-friendly error message
    let errorMessage = 'PDF generation failed. ';
    
    if (error.message.includes('element not found')) {
      errorMessage += 'Please make sure the resume is properly loaded.';
    } else if (error.message.includes('network') || error.message.includes('CORS')) {
      errorMessage += 'Network issue detected. Please check your connection.';
    } else {
      errorMessage += 'Please try the "Print to PDF" option in your browser or use the Simple template.';
    }
    
    alert(errorMessage);
    throw error;
  }
};

/**
 * Simple fallback PDF generator (text-based)
 * Use this if the main function fails
 */
export const downloadSimplePDF = async (resumeData) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    let yPosition = 20;
    const lineHeight = 7;
    const margin = 20;
    const pageWidth = pdf.internal.pageSize.getWidth() - (margin * 2);
    
    // Set default font
    pdf.setFont('helvetica');
    
    // Name
    if (resumeData.fullName) {
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(resumeData.fullName, margin, yPosition);
      yPosition += lineHeight * 2;
    }
    
    // Contact info
    const contactInfo = [];
    if (resumeData.email) contactInfo.push(resumeData.email);
    if (resumeData.phone) contactInfo.push(resumeData.phone);
    if (resumeData.location) contactInfo.push(resumeData.location);
    
    if (contactInfo.length > 0) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(contactInfo.join(' | '), margin, yPosition);
      yPosition += lineHeight * 1.5;
    }
    
    // Professional Summary
    if (resumeData.summary) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PROFESSIONAL SUMMARY', margin, yPosition);
      yPosition += lineHeight;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const summaryLines = pdf.splitTextToSize(resumeData.summary, pageWidth);
      pdf.text(summaryLines, margin, yPosition);
      yPosition += (summaryLines.length * lineHeight) + lineHeight;
    }
    
    // Check for page break
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }
    
    // Skills
    if (resumeData.skills && resumeData.skills.length > 0) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SKILLS', margin, yPosition);
      yPosition += lineHeight;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const skillsText = Array.isArray(resumeData.skills) 
        ? resumeData.skills.join(', ')
        : resumeData.skills;
      const skillsLines = pdf.splitTextToSize(skillsText, pageWidth);
      pdf.text(skillsLines, margin, yPosition);
      yPosition += (skillsLines.length * lineHeight) + lineHeight;
    }
    
    // Education
    if (resumeData.education && resumeData.education.length > 0) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('EDUCATION', margin, yPosition);
      yPosition += lineHeight;
      
      pdf.setFontSize(10);
      resumeData.education.forEach(edu => {
        const educationText = `${edu.degree} - ${edu.school} (${edu.year})`;
        const eduLines = pdf.splitTextToSize(educationText, pageWidth);
        pdf.text(eduLines, margin, yPosition);
        yPosition += (eduLines.length * lineHeight) + lineHeight;
      });
      yPosition += lineHeight;
    }
    
    // Save the PDF
    pdf.save('resume-simple.pdf');
    
  } catch (error) {
    console.error('Simple PDF generation failed:', error);
    alert('Simple PDF generation also failed. Please use browser print to PDF.');
  }
};

/**
 * Utility function to check if element exists and is visible
 */
export const validateResumeElement = () => {
  const element = document.getElementById('resume-content');
  if (!element) {
    return { isValid: false, error: 'Resume element not found' };
  }
  if (element.offsetWidth === 0 || element.offsetHeight === 0) {
    return { isValid: false, error: 'Resume element is not visible' };
  }
  return { isValid: true, error: null };
};