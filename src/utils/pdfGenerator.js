import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { getTemplateComponent } from '../features/student/components/ResumeTemplates';

/**
 * Exports ONLY the resume document (never editor panels, sidebars, or controls) to an A4 PDF document.
 * @param {HTMLElement|string} target - The DOM element or query selector string
 * @param {string} fileName - Destination filename (must end in .pdf)
 */
export const exportElementToPDF = async (target, fileName = 'Resume.pdf') => {
  let tempHolder = null;
  try {
    let sourceElement = null;
    if (typeof target === 'string') {
      sourceElement = document.querySelector(target);
    } else {
      sourceElement = target;
    }

    if (!sourceElement) {
      sourceElement = document.querySelector('#resume-preview-document') || document.querySelector('#resume-content');
    }

    if (!sourceElement) {
      throw new Error('Resume element not found for PDF generation');
    }

    // Extract ONLY the pure resume paper document element, never the editor chrome/wrapper
    const resumeDoc = sourceElement.id === 'resume-preview-document'
      ? sourceElement
      : (sourceElement.querySelector('#resume-preview-document') || sourceElement);

    // Deep clone to isolate from editor DOM
    const clone = resumeDoc.cloneNode(true);

    // Remove any interactive, buttons, or editor controls from clone
    const unwanted = clone.querySelectorAll(
      'button, a[href="#"], [onclick], .no-print, input, textarea, select, .edit-btn, .action-btn'
    );
    unwanted.forEach((el) => el.remove());

    // Force strict A4 styling on the clone (no editor borders or outer margins)
    clone.style.width = '210mm';
    clone.style.minHeight = '297mm';
    clone.style.maxWidth = '210mm';
    clone.style.margin = '0';
    clone.style.boxShadow = 'none';
    clone.style.border = 'none';
    clone.style.backgroundColor = '#ffffff';

    // Mount clone in a clean offscreen wrapper
    tempHolder = document.createElement('div');
    tempHolder.style.position = 'fixed';
    tempHolder.style.top = '0';
    tempHolder.style.left = '-9999px';
    tempHolder.style.width = '210mm';
    tempHolder.style.zIndex = '-9999';
    tempHolder.style.backgroundColor = '#ffffff';
    tempHolder.appendChild(clone);
    document.body.appendChild(tempHolder);

    // High resolution canvas capture of ONLY the isolated resume clone
    const canvas = await html2canvas(clone, {
      scale: 2, // High DPI
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = 210; // A4 standard width in mm
    const pageHeight = 297; // A4 standard height in mm
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, '', 'FAST');
    heightLeft -= pageHeight;

    // Additional pages if resume exceeds single A4 page
    while (heightLeft > 5) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, '', 'FAST');
      heightLeft -= pageHeight;
    }

    const safeName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    pdf.save(safeName);
    return true;
  } catch (error) {
    console.error('Error generating PDF from element:', error);
    window.print();
    return false;
  } finally {
    if (tempHolder && tempHolder.parentNode) {
      tempHolder.parentNode.removeChild(tempHolder);
    }
  }
};

/**
 * Renders any resume data object in the background and immediately downloads ONLY the resume page as a crisp PDF.
 * Works from any page (Resume Editor, Student Dashboard) without requiring or capturing any editor UI.
 * @param {Object} resumeData - Standard resume data object
 * @param {Array} verifiedSkills - Array of verified skill names
 */
export const exportResumeDataToPDF = async (resumeData, verifiedSkills = []) => {
  if (!resumeData) return false;

  // Determine target template component
  const TemplateComponent = getTemplateComponent(resumeData.selectedTemplate || 'Professional');

  // Create temporary offscreen container
  const container = document.createElement('div');
  container.id = 'offscreen-resume-pdf-container';
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '-9999px';
  container.style.width = '210mm';
  container.style.zIndex = '-9999';
  container.style.backgroundColor = '#ffffff';
  document.body.appendChild(container);

  const root = createRoot(container);

  return new Promise((resolve) => {
    root.render(
      React.createElement(
        'div',
        { style: { width: '210mm', backgroundColor: '#ffffff', padding: '0', margin: '0' } },
        React.createElement(TemplateComponent, { data: resumeData, verifiedSkills })
      )
    );

    // Allow React to mount and fonts/styles to compute
    setTimeout(async () => {
      try {
        const targetElement = container.querySelector('#resume-preview-document') || container;
        const candidateName = resumeData.personalInfo?.fullName || resumeData.title || 'Resume';
        const fileName = `${candidateName.replace(/[^a-zA-Z0-9_\- ]/g, '').replace(/\s+/g, '_')}_InsightResume.pdf`;

        await exportElementToPDF(targetElement, fileName);
        resolve(true);
      } catch (err) {
        console.error('Failed to export resume data as PDF:', err);
        resolve(false);
      } finally {
        try {
          root.unmount();
          container.remove();
        } catch {
          // ignore cleanup issues
        }
      }
    }, 350);
  });
};

export default {
  exportElementToPDF,
  exportResumeDataToPDF,
};