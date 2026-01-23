/**
 * Security utilities for input validation and sanitization
 */

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (basic)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

// Sanitize string input
export const sanitizeString = (input: string, maxLength?: number): string => {
  if (typeof input !== 'string') return '';
  
  // Remove potentially dangerous characters
  let sanitized = input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
  
  // Limit length if specified
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
};

// Validate property data
export const validateProperty = (property: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!property.title || typeof property.title !== 'string' || property.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  }

  if (!property.price || typeof property.price !== 'number' || property.price <= 0) {
    errors.push('Price must be a positive number');
  }

  if (!property.location || typeof property.location !== 'string' || property.location.trim().length < 3) {
    errors.push('Location must be at least 3 characters');
  }

  if (!property.city || typeof property.city !== 'string' || property.city.trim().length < 2) {
    errors.push('City must be at least 2 characters');
  }

  if (typeof property.bedrooms !== 'number' || property.bedrooms < 0) {
    errors.push('Bedrooms must be a non-negative number');
  }

  if (typeof property.bathrooms !== 'number' || property.bathrooms < 0) {
    errors.push('Bathrooms must be a non-negative number');
  }

  if (!property.area || typeof property.area !== 'number' || property.area <= 0) {
    errors.push('Area must be a positive number');
  }

  if (!property.type || !['sale', 'rent', 'leasing'].includes(property.type)) {
    errors.push('Invalid property type');
  }

  if (!property.propertyType || !['Apartment', 'Villa', 'Plot', 'Commercial', 'House'].includes(property.propertyType)) {
    errors.push('Invalid property type');
  }

  if (property.coordinates && (
    typeof property.coordinates.lat !== 'number' ||
    typeof property.coordinates.lng !== 'number' ||
    property.coordinates.lat < -90 || property.coordinates.lat > 90 ||
    property.coordinates.lng < -180 || property.coordinates.lng > 180
  )) {
    errors.push('Invalid coordinates');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Validate review data
export const validateReview = (review: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!review.propertyId || typeof review.propertyId !== 'string') {
    errors.push('Property ID is required');
  }

  if (!review.userName || typeof review.userName !== 'string' || review.userName.trim().length < 2) {
    errors.push('User name must be at least 2 characters');
  }

  if (!review.rating || typeof review.rating !== 'number' || review.rating < 1 || review.rating > 5) {
    errors.push('Rating must be between 1 and 5');
  }

  if (review.comment && typeof review.comment === 'string' && review.comment.length > 1000) {
    errors.push('Comment must be less than 1000 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Validate lead data
export const validateLead = (lead: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!lead.buyerName || typeof lead.buyerName !== 'string' || lead.buyerName.trim().length < 2) {
    errors.push('Buyer name must be at least 2 characters');
  }

  if (!lead.buyerEmail || !isValidEmail(lead.buyerEmail)) {
    errors.push('Valid buyer email is required');
  }

  if (!lead.buyerPhone || !isValidPhone(lead.buyerPhone)) {
    errors.push('Valid buyer phone is required');
  }

  if (!lead.propertyId || typeof lead.propertyId !== 'string') {
    errors.push('Property ID is required');
  }

  if (lead.message && typeof lead.message === 'string' && lead.message.length > 2000) {
    errors.push('Message must be less than 2000 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Rate limiting helper (client-side, server should also implement)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (key: string, maxRequests: number = 10, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
};

// Clean up old rate limit records
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60000); // Clean up every minute

// XSS protection - escape HTML
export const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

// Validate UUID format
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

