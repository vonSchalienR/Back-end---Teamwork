/*
Simple script to promote a user to admin role.
Usage:
  node scripts/grant-admin.js user@example.com
Or set environment variable MONGO_URI (optional) and run the command above.

This script connects to the same MongoDB used by the app and updates the user's `role` field to 'admin'.
*/

const mongoose = require('mongoose');
const User = require('../src/app/models/User');

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node scripts/grant-admin.js <email-or-userId>');
    process.exit(1);
  }

  const identifier = args[0];
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/baokim_dev';

  try {
    // Mongoose v6+ uses the new driver defaults; explicit options like
    // useNewUrlParser/useUnifiedTopology are deprecated and unnecessary.
    await mongoose.connect(mongoUri);

    // Try find by email first, then by _id
    let user = await User.findOne({ email: identifier });
    if (!user) {
      // try by id
      try {
        user = await User.findById(identifier);
      } catch (err) {
        // ignore
      }
    }

    if (!user) {
      console.error('User not found with email or id:', identifier);
      process.exit(2);
    }

    user.role = 'admin';
    await user.save();

    console.log(`User ${user.email || user._id} promoted to admin.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(3);
  }
}

main();
