/**
 * Event Tracking for Personal Portfolio Website
 * Author: Rishith Sunil
 * Description: Captures and logs user interactions across the website
 */

// Log page view when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
  logEvent('view', 'page', 'Page loaded: ' + document.title);
});

// Main event tracking function
function setupEventTracking() {
  // Track all click events using event delegation
  document.addEventListener('click', function(event) {
    // Get the clicked element
    const target = event.target;
    
    // Determine the type of element clicked
    let elementType = determineElementType(target);
    
    // Get additional context about the element
    let elementContext = getElementContext(target, elementType);
    
    // Log the click event
    logEvent('click', elementType, elementContext);
  });
  
  // Track scroll events to determine section views
  let viewedSections = new Set();
  
  // Use Intersection Observer to track when sections come into view
  const sections = document.querySelectorAll('section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !viewedSections.has(entry.target.id)) {
        viewedSections.add(entry.target.id);
        logEvent('view', 'section', 'Section: ' + entry.target.id);
      }
    });
  }, { threshold: 0.3 }); // Consider section viewed when 30% is visible
  
  // Observe all sections
  sections.forEach(section => {
    observer.observe(section);
  });
}

// Helper function to determine element type
function determineElementType(element) {
  // Check for common elements based on tags or classes
  const tagName = element.tagName.toLowerCase();
  
  if (tagName === 'a') return 'link';
  if (tagName === 'button' || element.classList.contains('cv-button')) return 'button';
  if (tagName === 'img' || element.closest('figure')) return 'image';
  if (tagName === 'label' && element.classList.contains('menu-icon')) return 'menu-toggle';
  if (tagName === 'li' && element.closest('.nav-menu')) return 'nav-item';
  if (element.closest('.skill-item')) return 'skill-bar';
  if (element.closest('.education-item')) return 'education-card';
  if (element.closest('.achievement-item')) return 'achievement-card';
  
  // Default case
  return tagName;
}

// Helper function to get context about the clicked element
function getElementContext(element, elementType) {
  switch (elementType) {
    case 'link':
      return `Link: ${element.textContent || element.getAttribute('aria-label') || 'unnamed'} (${element.href})`;
    case 'button':
      return `Button: ${element.textContent || element.getAttribute('aria-label') || 'unnamed'}`;
    case 'image':
      const img = element.tagName.toLowerCase() === 'img' ? element : element.querySelector('img');
      return `Image: ${img ? img.alt || 'unnamed' : 'unnamed'}`;
    case 'menu-toggle':
      return 'Mobile navigation menu toggle';
    case 'nav-item':
      return `Navigation item: ${element.textContent}`;
    case 'skill-bar':
      const skillItem = element.closest('.skill-item');
      const skillName = skillItem ? skillItem.querySelector('.skill-name span').textContent : 'unnamed';
      return `Skill bar: ${skillName}`;
    case 'education-card':
      const educationItem = element.closest('.education-item');
      const institutionName = educationItem ? educationItem.querySelector('h3').textContent : 'unnamed';
      return `Education card: ${institutionName}`;
    case 'achievement-card':
      const achievementItem = element.closest('.achievement-item');
      const achievementName = achievementItem ? achievementItem.querySelector('h3').textContent : 'unnamed';
      return `Achievement card: ${achievementName}`;
    default:
      return `${elementType}: ${element.textContent ? element.textContent.substring(0, 30).trim() + '...' : 'unnamed'}`;
  }
}

// Log function to output events to console
function logEvent(eventType, objectType, details) {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp}, ${eventType}, ${objectType}${details ? ' - ' + details : ''}`);
}

// Initialize event tracking
setupEventTracking();

/**
 * Analytics Integration (Optional)
 * Uncomment the code below to send events to an analytics service
 */
/*
function sendToAnalytics(eventType, objectType, details) {
  // Replace with your analytics service code
  // Example: 
  // analytics.trackEvent({
  //   type: eventType,
  //   object: objectType,
  //   details: details,
  //   timestamp: new Date().toISOString()
  // });
}
*/