const cron = require('node-cron');
const transporter = require('../mailer');
const db = require('../db'); // Adjust if db.js is located differently

function sendReminders() {
  const today = new Date().toISOString().split('T')[0];
  const query = `SELECT * FROM entries WHERE reminderDate IS NOT NULL AND reminderDate <= ?`;

  db.query(query, [today], (err, results) => {
    if (err) return console.error('Error fetching due reminders:', err);

    results.forEach(entry => {
      const mailOptions = {
        from: '"Internal email from CRM website" <testrahulmail@gmail.com>',
        // to: entry.email,
        // to: 'abhishek.tripathi@cloudconverge.io, rsingh@cloudconverge.io',
        // subject: 'Reminder: Task Due',
        // text: `Hi ${entry.name},\n\nYour task is due:\n\n${entry.description}\n\nReminder Date: ${entry.reminderDate}\n\nThanks!`

        from: '"Internal email from CRM website" <testrahulmail@gmail.com>',
          to:'sajiv@cloudconverge.io,ashish.kumar@cloudconverge.io',
          subject: '⏰ Task Due Today',
          // text: `Hi ${entry.name},\n\nThis is a reminder for your task:\n\n${entry.description}\n\nCompany: ${entry.company}`
          text: `Hi team,\n\n Client Name: ${entry.name},\n\n Client's Email: ${entry.email}\n\n Client's Phone: ${entry.phone}\n\n Task Detail: ${entry.description}\n\n Client's Company Name: ${entry.company}`
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) return console.error(`Failed to send email to ${entry.email}:`, err);
        console.log(`✅ Reminder sent to ${entry.email}:`, info.response);
      });
    });
  });
}

// Run every day at 9 AM
cron.schedule('35 12 * * *', () => {
  console.log('📬 Running daily reminder cron job...');
  sendReminders();
});
