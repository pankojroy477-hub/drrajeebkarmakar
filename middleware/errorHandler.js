/**
 * Centralized Error Handling Middleware
 */
export function notFoundHandler(req, res, next) {
  res.status(404).render('errors/404', {
    pageTitle: 'Page Not Found - ৪MD. রাজীবশঙ্কর কর্মকার',
    currentPath: req.path,
    metaDescription: 'The requested page could not be found on drrajeebkarmakar.com'
  });
}

export function globalErrorHandler(err, req, res, next) {
  console.error('Application Error:', err);
  const statusCode = err.status || 500;
  
  if (req.xhr || req.headers.accept?.includes('application/json')) {
    return res.status(statusCode).json({
      success: false,
      message: statusCode === 500 ? 'An unexpected server error occurred.' : err.message
    });
  }

  res.status(statusCode).render('errors/500', {
    pageTitle: 'Server Error - Dr. Rajeeebshankar Karmakar',
    currentPath: req.path,
    metaDescription: 'An unexpected internal error occurred.',
    error: process.env.NODE_ENV === 'development' ? err : null
  });
}
