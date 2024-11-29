const db = new sqlite3.Database('contact_book.db');
const sqlite3 = require('sqlite3').verbose();

// Connect to the database
db.open('contact_book.db',sqlite3.open.readwrite,function(err){
    if(err){
        console.error(err.message);

    }
    else{
        console.log('Connected to the contact book database.');
    }
})
// Create table if it doesn't exist

db.serialize(function() {
  db.run(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT
    );
  `);
});

// Add contact form submission handler
document.getElementById('add-contact').addEventListener('click', function(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;

  // Insert contact into database
  db.run(`
    INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?);
  `, [name, email, phone], function(err) {
    if (err) {
      console.error(err);
    } else {
      console.log('Contact added successfully!');
      // Clear form fields
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      document.getElementById('phone').value = '';
    }
  });
});

// Load contacts from database and display in list
db.all('SELECT * FROM contacts', function(err, rows) {
  if (err) {
    console.error(err);
  } else {
    const contactList = document.getElementById('contact-list');
    const ul = document.createElement('ul');
    contactList.appendChild(ul);

    rows.forEach(function(row) {
      const li = document.createElement('li');
      li.textContent = `${row.name} - ${row.email} - ${row.phone}`;
      ul.appendChild(li);
    });
  }
});