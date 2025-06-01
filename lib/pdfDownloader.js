import jsPDF from "jspdf";

const cleanMarkdown = (text) => {
  if (!text) return "";

  if (Array.isArray(text)) {
    return text.map((item) => cleanMarkdown(item)).join("\n\n");
  }

  if (typeof text === "object" && text !== null) {
    return JSON.stringify(text, null, 2);
  }

  return text
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
    .replace(/\*(.*?)\*/g, "$1") // Remove italic
    .replace(/#{1,6}\s/g, "") // Remove headers
    .replace(/```[\s\S]*?```/g, "[Code Block]") // Replace code blocks
    .replace(/`([^`]*)`/g, "$1") // Remove inline code
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // Remove links, keep text
    .replace(/^\s*[-*+]\s/gm, "• ") // Convert bullets
    .replace(/^\s*\d+\.\s/gm, "• ") // Convert numbered lists
    .trim();
};

// Helper function to add text with word wrapping
const addWrappedText = (doc, text, x, y, maxWidth, lineHeight = 6) => {
  const lines = doc.splitTextToSize(text, maxWidth);
  let currentY = y;

  lines.forEach((line) => {
    if (currentY > 270) {
      // Near bottom of page, add new page
      doc.addPage();
      currentY = 20;
    }
    doc.text(line, x, currentY);
    currentY += lineHeight;
  });

  return currentY + 3; // Return next Y position with some spacing
};

// Helper function to format tech stack data
const formatTechStack = (techStack) => {
  if (!techStack) return "No tech stack data available";

  if (typeof techStack === "string") {
    return cleanMarkdown(techStack);
  }

  if (typeof techStack === "object" && !Array.isArray(techStack)) {
    let formatted = "";
    Object.entries(techStack).forEach(([category, technology]) => {
      const formattedCategory = category
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())
        .replace(/\b(Ci|Cd)\b/g, (match) => match.toUpperCase())
        .trim();

      formatted += `${formattedCategory}:\n`;
      formatted += `${cleanMarkdown(technology)}\n\n`;
    });
    return formatted;
  }

  return cleanMarkdown(techStack);
};

// Helper function to format landing page data
const formatLandingPage = (landingPage) => {
  if (!landingPage) return "No landing page data available";

  let formatted = "";

  if (landingPage.headline) {
    formatted += `HEADLINE:\n${landingPage.headline}\n\n`;
  }

  if (landingPage.subheading) {
    formatted += `SUBHEADING:\n${landingPage.subheading}\n\n`;
  }

  if (landingPage.cta) {
    formatted += `CALL TO ACTION:\n${landingPage.cta}\n\n`;
  }

  if (landingPage.benefits && Array.isArray(landingPage.benefits)) {
    formatted += `KEY BENEFITS:\n`;
    landingPage.benefits.forEach((benefit, index) => {
      formatted += `${index + 1}. ${cleanMarkdown(benefit)}\n`;
    });
    formatted += "\n";
  }

  return formatted;
};

const formatUserPersonas = (userPersonas) => {
  if (!userPersonas || !Array.isArray(userPersonas)) {
    return "No user persona data available";
  }

  let formatted = "";

  userPersonas.forEach((persona, index) => {
    const cleanName =
      typeof persona.name === "string"
        ? persona.name.replace(/^\*\*|\*\*$/g, "")
        : persona.name || `Persona ${index + 1}`;

    formatted += `PERSONA ${index + 1}: ${cleanName}\n\n`;

    if (persona.painPoints) {
      formatted += `PAIN POINTS:\n${cleanMarkdown(persona.painPoints)}\n\n`;
    }

    if (persona.goals) {
      formatted += `GOALS:\n${cleanMarkdown(persona.goals)}\n\n`;
    }

    if (persona.solution) {
      formatted += `SOLUTION:\n${cleanMarkdown(persona.solution)}\n\n`;
    }

    formatted += "\n";
  });

  return formatted;
};

export const handleDownloadPDF = (results) => {
  if (!results) {
    alert("No data available to download");
    return;
  }

  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let yPosition = 20;

    // Set font
    doc.setFont("helvetica");

    // MAIN TITLE - Larger and bold
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Enhanced Idea Report", margin, yPosition);
    yPosition += 20;

    // Add generation date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      margin,
      yPosition
    );
    yPosition += 20;

    // Enhanced Idea Section
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("ENHANCED IDEA", margin, yPosition);
    yPosition += 12;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    if (results.enhancedIdea) {
      yPosition = addWrappedText(
        doc,
        cleanMarkdown(results.enhancedIdea),
        margin,
        yPosition,
        maxWidth
      );
    }
    yPosition += 10;

    // Market Validation Section
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("MARKET VALIDATION", margin, yPosition);
    yPosition += 12;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    if (results.marketValidation) {
      yPosition = addWrappedText(
        doc,
        cleanMarkdown(results.marketValidation),
        margin,
        yPosition,
        maxWidth
      );
    } else {
      yPosition = addWrappedText(
        doc,
        "Premium feature - upgrade to access market validation insights",
        margin,
        yPosition,
        maxWidth
      );
    }
    yPosition += 10;

    // MVP Features Section
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("MVP FEATURES", margin, yPosition);
    yPosition += 12;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    if (results.mvpFeatures) {
      yPosition = addWrappedText(
        doc,
        cleanMarkdown(results.mvpFeatures),
        margin,
        yPosition,
        maxWidth
      );
    } else {
      yPosition = addWrappedText(
        doc,
        "Premium feature - upgrade to access MVP feature recommendations",
        margin,
        yPosition,
        maxWidth
      );
    }
    yPosition += 10;

    // Tech Stack Section
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("TECH STACK", margin, yPosition);
    yPosition += 12;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    if (results.techStack) {
      yPosition = addWrappedText(
        doc,
        formatTechStack(results.techStack),
        margin,
        yPosition,
        maxWidth
      );
    } else {
      yPosition = addWrappedText(
        doc,
        "Premium feature - upgrade to access tech stack recommendations",
        margin,
        yPosition,
        maxWidth
      );
    }
    yPosition += 10;

    // Monetization Section
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("MONETIZATION STRATEGY", margin, yPosition);
    yPosition += 12;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    if (results.monetization) {
      yPosition = addWrappedText(
        doc,
        cleanMarkdown(results.monetization),
        margin,
        yPosition,
        maxWidth
      );
    } else {
      yPosition = addWrappedText(
        doc,
        "Premium feature - upgrade to access monetization strategy recommendations",
        margin,
        yPosition,
        maxWidth
      );
    }
    yPosition += 10;

    // Landing Page Section
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("LANDING PAGE CONTENT", margin, yPosition);
    yPosition += 12;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    if (results.landingPage) {
      yPosition = addWrappedText(
        doc,
        formatLandingPage(results.landingPage),
        margin,
        yPosition,
        maxWidth
      );
    } else {
      yPosition = addWrappedText(
        doc,
        "Premium feature - upgrade to access landing page content suggestions",
        margin,
        yPosition,
        maxWidth
      );
    }
    yPosition += 10;

    // User Personas Section
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("USER PERSONAS", margin, yPosition);
    yPosition += 12;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    if (results.userPersonas) {
      yPosition = addWrappedText(
        doc,
        formatUserPersonas(results.userPersonas),
        margin,
        yPosition,
        maxWidth
      );
    } else {
      yPosition = addWrappedText(
        doc,
        "Premium feature - upgrade to access user persona analysis",
        margin,
        yPosition,
        maxWidth
      );
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `Enhanced-Idea-report-${timestamp}.pdf`;

    // Save the PDF
    doc.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Error generating PDF. Please try again.");
  }
};
