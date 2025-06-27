const { MongoClient } = require("mongodb")

const uri =
  "mongodb+srv://puppyhappy344:01234567890@cluster0.blrig.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

async function testConnection() {
  console.log("🔍 Testing MongoDB Connection...")
  console.log("📡 URI:", uri.replace(/\/\/.*@/, "//***:***@"))

  const client = new MongoClient(uri)

  try {
    console.log("⏳ Attempting to connect...")

    // Connect to MongoDB
    await client.connect()
    console.log("✅ Successfully connected to MongoDB Atlas!")

    // Test database access
    const db = client.db("ecochain")
    console.log("📊 Database 'ecochain' accessed successfully")

    // List existing collections
    const collections = await db.listCollections().toArray()
    console.log(`📁 Found ${collections.length} existing collections:`)
    collections.forEach((col) => {
      console.log(`   - ${col.name}`)
    })

    // Test a simple operation
    const testCollection = db.collection("connection_test")
    const testDoc = {
      timestamp: new Date(),
      test: "Connection successful",
      platform: "EcoChain",
    }

    const insertResult = await testCollection.insertOne(testDoc)
    console.log("✅ Test document inserted with ID:", insertResult.insertedId)

    // Read the test document back
    const retrievedDoc = await testCollection.findOne({ _id: insertResult.insertedId })
    console.log("✅ Test document retrieved:", retrievedDoc.test)

    // Clean up test document
    await testCollection.deleteOne({ _id: insertResult.insertedId })
    console.log("🧹 Test document cleaned up")

    // Get database stats
    const stats = await db.stats()
    console.log("📈 Database Statistics:")
    console.log(`   - Database: ${stats.db}`)
    console.log(`   - Collections: ${stats.collections}`)
    console.log(`   - Data Size: ${(stats.dataSize / 1024).toFixed(2)} KB`)
    console.log(`   - Storage Size: ${(stats.storageSize / 1024).toFixed(2)} KB`)

    console.log("\n🎉 MongoDB Connection Test PASSED!")
    console.log("✅ Your database is ready for EcoChain platform")
  } catch (error) {
    console.error("❌ MongoDB Connection Test FAILED!")
    console.error("🔍 Error Details:")

    if (error.code) {
      console.error(`   - Error Code: ${error.code}`)
    }

    if (error.message) {
      console.error(`   - Error Message: ${error.message}`)
    }

    // Common error troubleshooting
    if (error.message.includes("authentication failed")) {
      console.error("🔐 Authentication Issue:")
      console.error("   - Check username and password")
      console.error("   - Verify database user permissions")
    }

    if (error.message.includes("network")) {
      console.error("🌐 Network Issue:")
      console.error("   - Check internet connection")
      console.error("   - Verify MongoDB Atlas IP whitelist")
    }

    if (error.message.includes("timeout")) {
      console.error("⏰ Timeout Issue:")
      console.error("   - Network may be slow")
      console.error("   - Try again in a moment")
    }

    console.error("\n🛠️  Troubleshooting Steps:")
    console.error("1. Verify credentials in MongoDB Atlas")
    console.error("2. Check IP whitelist (add 0.0.0.0/0 for testing)")
    console.error("3. Ensure cluster is running")
    console.error("4. Test connection from MongoDB Compass")
  } finally {
    await client.close()
    console.log("🔌 Connection closed")
  }
}

// Run the connection test
testConnection().catch(console.error)
