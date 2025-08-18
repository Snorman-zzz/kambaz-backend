import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
console.log('🔍 Investigating production MongoDB cluster...');
console.log('Connection string configured:', CONNECTION_STRING ? 'Yes' : 'No');

if (!CONNECTION_STRING) {
    console.error('❌ MONGO_CONNECTION_STRING not found in environment variables');
    process.exit(1);
}

try {
    console.log('\n📡 Connecting to MongoDB...');
    await mongoose.connect(CONNECTION_STRING);
    console.log('✅ Connected to MongoDB cluster successfully!');
    
    const db = mongoose.connection.db;
    
    // List all databases
    console.log('\n📚 Listing all databases in cluster...');
    const admin = db.admin();
    const dbList = await admin.listDatabases();
    console.log('Databases found:', dbList.databases.map(d => `${d.name} (${(d.sizeOnDisk/1024/1024).toFixed(2)}MB)`));
    
    // Get current database name
    console.log('\n🎯 Current database:', db.databaseName);
    
    // List collections in current database
    console.log('\n📁 Collections in current database:');
    const collections = await db.listCollections().toArray();
    console.log('Collections found:', collections.map(c => c.name));
    
    if (collections.length === 0) {
        console.log('⚠️  No collections found in current database');
    }
    
    // Try to find users in different possible locations
    const possibleUserCollections = ['users', 'user', 'User', 'Users'];
    
    for (const collectionName of possibleUserCollections) {
        try {
            console.log(`\n🔍 Checking collection: ${collectionName}`);
            const collection = db.collection(collectionName);
            const count = await collection.countDocuments();
            console.log(`Documents in ${collectionName}:`, count);
            
            if (count > 0) {
                const users = await collection.find({}).limit(5).toArray();
                console.log(`Sample users from ${collectionName}:`, users.map(u => ({
                    id: u._id,
                    username: u.username,
                    firstName: u.firstName,
                    lastName: u.lastName,
                    role: u.role
                })));
            }
        } catch (error) {
            console.log(`Collection ${collectionName} not found or error:`, error.message);
        }
    }
    
    // Check other possible database names
    const possibleDatabases = ['kambaz', 'test', 'kambaz-backend', 'kambaz-app'];
    
    for (const dbName of possibleDatabases) {
        if (dbName !== db.databaseName) {
            try {
                console.log(`\n🔍 Checking database: ${dbName}`);
                const otherDb = mongoose.connection.client.db(dbName);
                const otherCollections = await otherDb.listCollections().toArray();
                console.log(`Collections in ${dbName}:`, otherCollections.map(c => c.name));
                
                // Check for users in this database
                try {
                    const usersCollection = otherDb.collection('users');
                    const userCount = await usersCollection.countDocuments();
                    if (userCount > 0) {
                        console.log(`🎉 Found ${userCount} users in ${dbName}.users!`);
                        const sampleUsers = await usersCollection.find({}).limit(3).toArray();
                        console.log('Sample users:', sampleUsers.map(u => ({
                            username: u.username,
                            firstName: u.firstName,
                            lastName: u.lastName
                        })));
                    }
                } catch (err) {
                    // Collection doesn't exist
                }
            } catch (error) {
                console.log(`Database ${dbName} not accessible:`, error.message);
            }
        }
    }
    
    await mongoose.disconnect();
    console.log('\n✅ Investigation complete!');
    
} catch (error) {
    console.error('❌ MongoDB investigation failed:', error.message);
    process.exit(1);
}