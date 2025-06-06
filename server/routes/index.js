



var express = require('express');
var router = express.Router();
const db = require('../db'); // Import your MySQL connection
// const cors = require('cors');

const nodemailer = require('nodemailer');





router.get('/', (req, res, next) => {
  const search = req.query.search || '';
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const searchQuery = `%${search}%`;
console.log('Current time:', new Date().toLocaleString());

  const countSql = `
    SELECT COUNT(*) AS count FROM entries 
    WHERE name LIKE ? OR email LIKE ? OR company LIKE ?
  `;
  const dataSql = `
    SELECT * FROM entries 
    WHERE name LIKE ? OR email LIKE ? OR company LIKE ?
    ORDER BY reminderDate ASC
    LIMIT ? OFFSET ?
  `;

  db.query(countSql, [searchQuery, searchQuery, searchQuery], (err, countResult) => {
    if (err) return next(err);

    const totalCount = countResult[0].count;
    const totalPages = Math.ceil(totalCount / limit);

    db.query(dataSql, [searchQuery, searchQuery, searchQuery, limit, offset], (err, results) => {
      if (err) return next(err);

      res.render('index', {
        title: 'Entries',
        entries: results,
        currentPage: page,
        totalPages,
        search
      });
    });
  });
});

router.get('/entries', (req, res) => {
  db.query('SELECT * FROM entries', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});




router.post('/entries', (req, res) => {
  const { name, email, phone, company, description, reminderDate } = req.body;

  db.query(
    'INSERT INTO entries (name, email, phone, company, description, reminderDate) VALUES (?, ?, ?, ?, ?, ?)',
    [name, email, phone, company, description, reminderDate],
    (err, result) => {
      if (err) return res.status(500).send(err);

      // Use result.insertId to return the ID of the inserted row
      res.status(201).json({
        id: result.insertId,
        name,
        email,
        phone,
        company,
        description,
        reminderDate
      });
    }
  );
});


router.put('/entries/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, phone, company, description, reminderDate } = req.body;

  const query = `UPDATE entries SET name = ?, email = ?, phone = ?, company = ?, description = ?, reminderDate = ? WHERE id = ?`;

    db.query(
    query,
    [name, email, phone, company, description, reminderDate, id],
    (err, result) => {
    if (err) {
    console.error('Error updating entry:', err);
    return res.status(500).send('Failed to update entry.');
    }
    res.json({
    id: Number(id),
    name,
    email,
    phone,
    company,
    description,
    reminderDate,
    });
    }
    );
});

router.delete('/entries/:id', (req, res) => {
const { id } = req.params;

db.query('DELETE FROM entries WHERE id = ?', [id], (err, result) => {
if (err) return res.status(500).send(err);
res.status(204).send(); // No Content
});
});





// Manual trigger for email reminders
router.post('/send-reminders', async (req, res) => {
  const today = new Date().toISOString().split('T')[0];

  db.query(
    'SELECT * FROM entries WHERE reminderDate <= ?',
    [today],
    async (err, results) => {
      if (err) return res.status(500).send('Database error');

      if (results.length === 0) {
        return res.send('No due reminders today.');
      }

      // Setup transporter (dummy example)
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'testrahulmail@gmail.com',
          pass: 'hscvuidvpnqwrtlb'
        }
      });

      for (const entry of results) {
        await transporter.sendMail({
          from: '"Internal email from CRM website" <testrahulmail@gmail.com>',
          to:'sajiv@cloudconverge.io,ashish.kumar@cloudconverge.io',
          subject: '⏰ Task Due Today',
          // text: `Hi ${entry.name},\n\nThis is a reminder for your task:\n\n${entry.description}\n\nCompany: ${entry.company}`
          text: `Hi team,\n\n Client Name: ${entry.name},\n\n Client's Email: ${entry.email}\n\n Client's Phone: ${entry.phone}\n\n Task Detail: ${entry.description}\n\n Client's Company Name: ${entry.company}`

        });
      }

      res.send(`${results.length} reminder email(s) sent manually.<a href="/">Go back</a>`);
    }
  );
});

// module.exports = router;

module.exports = router;
