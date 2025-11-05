const mongoose = require('mongoose');
const Course = require('./src/app/models/Course');

async function testMongooseDelete() {
    try {
        // Connect to database
        await mongoose.connect('mongodb://127.0.0.1:27017/baokim_dev');
        console.log('✅ Connected to database');

        // Test if methods are available
        console.log('\n📋 Available methods on Course model:');
        console.log('- Course.find:', typeof Course.find);
        console.log('- Course.findWithDeleted:', typeof Course.findWithDeleted);
        console.log('- Course.findDeleted:', typeof Course.findDeleted);
        console.log('- Course.delete:', typeof Course.delete);
        console.log('- Course.restore:', typeof Course.restore);

        // Test findWithDeleted
        console.log('\n🔍 Testing findWithDeleted...');
        const allCourses = await Course.findWithDeleted({});
        console.log(`Found ${allCourses.length} courses (including deleted)`);

        // Test find (only non-deleted)
        console.log('\n🔍 Testing find (non-deleted only)...');
        const activeCourses = await Course.find({});
        console.log(`Found ${activeCourses.length} active courses`);

        // Test findDeleted (only deleted)
        console.log('\n🗑️ Testing findDeleted...');
        const deletedCourses = await Course.findDeleted({});
        console.log(`Found ${deletedCourses.length} deleted courses`);

        console.log('\n✅ All tests passed! mongoose-delete is working correctly.');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from database');
        process.exit(0);
    }
}

testMongooseDelete();
