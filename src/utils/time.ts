/**
 * Returns a Date set to the local end-of-day (23:59:59.999).
 */
export function localEndOfDay(): Date {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d;
} 
