// config/db-init.js
const connectToDatabase = require('./database');
const schemas = require('./db-schemas');

async function initializeCollections() {
    const { db } = await connectToDatabase();

    // Create collections with validation
    for (const [collectionName, schema] of Object.entries(schemas)) {
        try {
            // Check if collection exists
            const collections = await db.listCollections({ name: collectionName }).toArray();
            
            if (collections.length === 0) {
                // Create new collection if it doesn't exist
                await db.createCollection(collectionName, {
                    validator: { $jsonSchema: schema }
                });
                console.log(`Created collection: ${collectionName}`);
            } else {
                // Update existing collection schema
                await db.command({
                    collMod: collectionName,
                    validator: { $jsonSchema: schema }
                });
                console.log(`Updated schema for collection: ${collectionName}`);
            }
        } catch (error) {
            console.error(`Error initializing collection ${collectionName}:`, error);
        }
    }

    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('learningMaterials').createIndex({ title: "text", description: "text" });
    await db.collection('learningMaterials').createIndex({ subject: 1 });
    await db.collection('learningMaterials').createIndex({ gradeLevel: 1 });
    await db.collection('learningMaterials').createIndex({ createdBy: 1 });
    await db.collection('assignments').createIndex({ classId: 1 });
    await db.collection('assignments').createIndex({ dueDate: 1 });
    await db.collection('assignments').createIndex({ createdBy: 1 });
    await db.collection('classes').createIndex({ teacherId: 1 });
    await db.collection('classes').createIndex({ joinCode: 1 }, { unique: true, sparse: true });
    await db.collection('assessments').createIndex({ createdBy: 1 });
    await db.collection('assessments').createIndex({ subject: 1 });
    await db.collection('assessments').createIndex({ gradeLevel: 1 });
    
    console.log("Database indexes created successfully");
    // Add to initializeCollections()
    await db.collection('ml_models').createIndex({ name: 1 }, { unique: true });
    await db.collection('ml_models').createIndex({ huggingface_id: 1 });
    await db.collection('ml_models').createIndex({ type: 1 });
    await db.collection('ml_models').createIndex({ target_languages: 1 });
    await db.collection('ml_models').createIndex({ status: 1 });
    await db.collection('ml_models').createIndex({ school_access: 1 });
    await db.collection('ml_models').createIndex({ "training_metrics.bleu_score": -1 });
    await db.collection('ml_usage_logs').createIndex({ model_id: 1, timestamp: -1 });
    await db.collection('ml_usage_logs').createIndex({ user_id: 1 });

    console.log("ML Models indexes created");

    // Insert initial data if collections are empty
    await seedInitialData(db);
}

async function seedInitialData(db) {
    const usersCount = await db.collection('users').countDocuments();
    const learningMaterialsCount = await db.collection('learningMaterials').countDocuments();
    const classesCount = await db.collection('classes').countDocuments();

    // Add ml to the seedInitialData()
    const mlModelsCount = await db.collection('ml_models').countDocuments();

    if (mlModelsCount === 0) {
        const school = await db.collection('schools').findOne();
  
        await db.collection('ml_models').insertMany([
            {
                name: "Fundisa Zulu Translator",
                huggingface_id: "facebook/nllb-200-distilled-600M",
                type: "translation",
                target_languages: ["zu", "en"],
                accuracy: 0.92,
                status: "active",
                school_access: [school._id],
                training_metrics: {
                epochs: 5,
                loss: 0.15,
                bleu_score: 0.87
            },
            createdAt: new Date(),
            last_updated: new Date()
        },
        {
            name: "Shaka Zulu Chatbot",
            huggingface_id: "microsoft/DialoGPT-medium",
            type: "chatbot",
            target_languages: ["zu", "en"],
            accuracy: 0.85,
            status: "active",
            school_access: [school._id],
            training_metrics: {
                epochs: 3,
                loss: 0.22,
                bleu_score: 0.79
            },
            createdAt: new Date(),
            last_updated: new Date()
        },
        {
            name: "Curriculum Explainer",
            huggingface_id: "google/flan-t5-base",
            type: "text-generation",
            target_languages: ["en"],
            accuracy: 0.88,
            status: "training",
            school_access: [school._id],
            training_metrics: {
                epochs: 2,
                loss: 0.18
            },
            createdAt: new Date()
        }
    ]);
    console.log("Sample ML models inserted");
}

    // Add permissions metadata collection
    const permissionsCount = await db.collection('permissions').countDocuments();
    if (permissionsCount === 0) {
        await db.collection('permissions').insertMany([
            {
                role: "student",
                permissions: {
                    learningMaterials: ["read", "download"],
                    assignments: ["read", "submit"],
                    assessments: ["take"],
                    classes: ["read"]
                }
            },
            {
                role: "teacher",
                permissions: {
                    learningMaterials: ["create", "read", "update", "delete_own"],
                    assignments: ["create", "read", "update", "delete_own", "grade"],
                    assessments: ["create", "read", "update", "delete_own"],
                    classes: ["read", "join"]
                }
            },
            {
                role: "admin",
                permissions: {
                    learningMaterials: ["create", "read", "update", "delete", "approve"],
                    assignments: ["create", "read", "update", "delete"],
                    assessments: ["create", "read", "update", "delete"],
                    classes: ["create", "read", "update", "delete", "manage_members"],
                    users: ["manage"]
                }
            }
        ]);
        console.log("Permission templates created");
    }
}

    if (usersCount === 0) {
        await db.collection('users').insertMany([
            {
                name: "Admin User",
                email: "admin@fundisa.edu",
                password: "$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq4H1kMhRINJpLYZJQ9Qj7g5ZJQz6K", // "admin123" hashed
                role: "admin",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Teacher Smith",
                email: "teacher@fundisa.edu",
                password: "$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq4H1kMhRINJpLYZJQ9Qj7g5ZJQz6K", // "admin123" hashed
                role: "teacher",
                school: "Fundisa High School",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Student Johnson",
                email: "student@fundisa.edu",
                password: "$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq4H1kMhRINJpLYZJQ9Qj7g5ZJQz6K", // "admin123" hashed
                role: "student",
                grade: "10",
                school: "Fundisa High School",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
        console.log("Initial users created");
    }

    if (learningMaterialsCount === 0 && usersCount > 0) {
        const teacher = await db.collection('users').findOne({ role: "teacher" });
        
        await db.collection('learningMaterials').insertMany([
            {
                title: "Algebra Basics",
                description: "Introduction to algebraic expressions and equations",
                subject: "mathematics",
                gradeLevel: "10",
                type: "video",
                fileUrl: "/materials/algebra-basics.mp4",
                thumbnailUrl: "/thumbnails/math.jpg",
                duration: 45,
                createdBy: teacher._id,
                isApproved: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Photosynthesis Worksheet",
                description: "Practice questions about plant photosynthesis",
                subject: "life-sciences",
                gradeLevel: "11",
                type: "worksheet",
                fileUrl: "/materials/photosynthesis.pdf",
                createdBy: teacher._id,
                isApproved: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
        console.log("Initial learning materials created");
    }

    if (classesCount === 0 && usersCount > 0) {
        const teacher = await db.collection('users').findOne({ role: "teacher" });
        const student = await db.collection('users').findOne({ role: "student" });
        
        await db.collection('classes').insertOne({
            name: "Grade 10 Mathematics",
            description: "Foundation phase mathematics for grade 10",
            subject: "mathematics",
            gradeLevel: "10",
            teacherId: teacher._id,
            students: [student._id],
            joinCode: "MATH10",
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log("Initial class created");
    }

module.exports = initializeCollections;