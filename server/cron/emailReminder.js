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
        from: 'testrahulmail@gmail.com',
        // to: entry.email,
        to: 'abhishek.tripathi@cloudconverge.io, rsingh@cloudconverge.io',
        subject: 'Reminder: Task Due',
        text: `Hi ${entry.name},\n\nYour task is due:\n\n${entry.description}\n\nReminder Date: ${entry.reminderDate}\n\nThanks!`
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
