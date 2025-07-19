
// EmailJS Configuration
// To set up email notifications:
// 1. Go to https://www.emailjs.com/
// 2. Create a free account
// 3. Create an email service (Gmail, Outlook, etc.)
// 4. Create an email template
// 5. Replace the values below with your actual values

const EMAIL_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_SERVICE_ID,
  TEMPLATE_ID: import.meta.env.VITE_TEMPLATE_ID,
  PUBLIC_KEY: import.meta.env.VITE_PUBLIC_KEY
};


// Email template should include these variables:
// {{from_name}} - Sender's name
// {{from_email}} - Sender's email
// {{phone}} - Sender's phone
// {{company}} - Sender's company
// {{service}} - Service requested
// {{budget}} - Project budget
// {{timeline}} - Project timeline
// {{message}} - Message content
// {{to_email}} - Your email (Droptechify@gmail.com)

// Instructions:
// 1. Create an email template in EmailJS dashboard
// 2. Use the variables above in your template
// 3. Set the "To Email" field to: Droptechify@gmail.com
// 4. Update the contact.html file with your actual EmailJS keys
