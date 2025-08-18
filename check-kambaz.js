import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Change the database name to Kambaz (capital K)
const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING.replace('/kambaz?', '/Kambaz?');
console.log('🔍 Checking the Kambaz database (capital K)...');
console.log('Modified connection string database:', CONNECTION_STRING.split('/')[3].split('?')[0]);

try {
    await mongoose.connect(CONNECTION_STRING);
    console.log('✅ Connected to Kambaz database successfully!');
    
    const db = mongoose.connection.db;
    console.log('🎯 Current database:', db.databaseName);
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log('📁 Collections found:', collections.map(c => c.name));
    
    // Check users collection
    if (collections.some(c => c.name === 'users')) {
        const usersCollection = db.collection('users');
        const userCount = await usersCollection.countDocuments();
        console.log(`👥 Users found: ${userCount}`);
        
        if (userCount > 0) {
            const users = await usersCollection.find({}).limit(5).toArray();
            console.log('🎉 Sample users:');
            users.forEach(user => {
                console.log(`  - ${user.username} (${user.firstName} ${user.lastName}) - ${user.role}`);
            });
            
            // Check specifically for iron_man
            const ironMan = await usersCollection.findOne({username: 'iron_man'});
            if (ironMan) {
                console.log('🦾 iron_man user found!', {
                    username: ironMan.username,
                    firstName: ironMan.firstName,
                    lastName: ironMan.lastName,
                    role: ironMan.role
                });
            } else {
                console.log('❌ iron_man user not found');
            }
        }
    }
    
    // Check other collections
    for (const collection of collections) {
        const count = await db.collection(collection.name).countDocuments();
        console.log(`📊 ${collection.name}: ${count} documents`);
    }
    
    await mongoose.disconnect();
    console.log('✅ Investigation complete!');
    
} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}