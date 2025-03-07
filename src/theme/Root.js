import React, { useEffect } from 'react';

// Map of Pascal tokens that should be linkable with their URLs
const LINKABLE_TOKENS = {
  // Integer types
  'Integer': '/docs/data-types/numeric-types#integer-types',
  'ShortInt': '/docs/data-types/numeric-types#signed-integer-types',
  'SmallInt': '/docs/data-types/numeric-types#signed-integer-types', 
  'LongInt': '/docs/data-types/numeric-types#signed-integer-types',
  'Int64': '/docs/data-types/numeric-types#signed-integer-types',
  'NativeInt': '/docs/data-types/numeric-types#signed-integer-types',
  
  // Unsigned integer types
  'Byte': '/docs/data-types/numeric-types#unsigned-integer-types',
  'Word': '/docs/data-types/numeric-types#unsigned-integer-types',
  'Cardinal': '/docs/data-types/numeric-types#unsigned-integer-types',
  'DWord': '/docs/data-types/numeric-types#unsigned-integer-types',
  'QWord': '/docs/data-types/numeric-types#unsigned-integer-types',
  'NativeUInt': '/docs/data-types/numeric-types#unsigned-integer-types',
  
  // Floating-point types
  'Single': '/docs/data-types/numeric-types#floating-point-types',
  'Double': '/docs/data-types/numeric-types#floating-point-types',
  'Extended': '/docs/data-types/numeric-types#floating-point-types',
  'Real': '/docs/data-types/numeric-types#floating-point-types',
  
  // Fixed-point types
  'Currency': '/docs/data-types/numeric-types#fixed-point-types',
  'Comp': '/docs/data-types/numeric-types#fixed-point-types',
  
  // Platform-specific types
  'PtrInt': '/docs/data-types/numeric-types#integer-types',
  'PtrUInt': '/docs/data-types/numeric-types#integer-types',
  'SizeInt': '/docs/data-types/numeric-types#integer-types',
  'SizeUInt': '/docs/data-types/numeric-types#integer-types',
  
  // Other types
  'String': '/docs/string',
  'Boolean': '/docs/boolean',
  'Char': '/docs/char',
  // Add more tokens as needed
};

// Function to process all Pascal tokens on the page
function processPascalTokens() {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    // First, look for all spans within code blocks
    const spans = document.querySelectorAll('pre code span');
    
    spans.forEach(span => {
      const content = span.textContent.trim();
      
      // Check if this content matches one of our linkable types
      if (LINKABLE_TOKENS[content]) {
        // Add data attributes for CSS targeting
        span.setAttribute('data-type', content);
        span.setAttribute('data-content', content);
        
        // Add click event listener if not already added
        if (!span.getAttribute('data-clickable')) {
          span.addEventListener('click', () => {
            // Remove any spaces from the URL before navigation
            const url = LINKABLE_TOKENS[content].replace(/\s+/g, '');
            window.location.href = url;
          });
          span.setAttribute('data-clickable', 'true');
        }
        
        // Add a tooltip
        span.setAttribute('title', `Go to ${content} documentation`);
        
        // Add styling
        span.style.cursor = 'pointer';
        span.style.textDecoration = 'none';
        span.style.color = '#0077cc';
      }
    });
    
    // Also check direct tokens from prism
    const tokens = document.querySelectorAll('pre .token');
    
    tokens.forEach(token => {
      const content = token.textContent.trim();
      
      if (LINKABLE_TOKENS[content]) {
        // Add data attributes for CSS targeting
        token.setAttribute('data-type', content);
        token.setAttribute('data-content', content);
        
        // Add click event listener if not already added
        if (!token.getAttribute('data-clickable')) {
          token.addEventListener('click', () => {
            // Remove any spaces from the URL before navigation
            const url = LINKABLE_TOKENS[content].replace(/\s+/g, '');
            window.location.href = url;
          });
          token.setAttribute('data-clickable', 'true');
        }
        
        // Add a tooltip
        token.setAttribute('title', `Go to ${content} documentation`);
        
        // Add styling
        token.style.cursor = 'pointer';
        token.style.textDecoration = 'none';
        token.style.color = '#0077cc';
      }
    });
  } catch (error) {
    console.error('Error processing Pascal tokens:', error);
  }
}

// Function to initialize token highlighting
function initPascalTokenLinks() {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    // Process existing tokens after page loads
    setTimeout(processPascalTokens, 1000);
    
    // Process again after a longer delay for any lazy-loaded content
    setTimeout(processPascalTokens, 3000);
    
    // Use MutationObserver to detect when code blocks are added to the page
    const observer = new MutationObserver(() => {
      setTimeout(processPascalTokens, 100);
    });
    
    // Store observer reference for cleanup
    window.pascalObserver = observer;
    
    // Start observing the document
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  } catch (error) {
    console.error('Error initializing Pascal token links:', error);
  }
}

// Default implementation, you can customize it with your own logic
export default function Root({children}) {
  useEffect(() => {
    // Initialize the Pascal token links
    initPascalTokenLinks();
    
    return () => {
      // Clean up if needed
      if (typeof window !== 'undefined' && window.pascalObserver) {
        window.pascalObserver.disconnect();
      }
    };
  }, []);

  return <>{children}</>;
}