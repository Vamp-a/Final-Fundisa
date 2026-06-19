// config/db-schemas.js
module.exports = {
    users: {
        bsonType: "object",
        required: ["email", "password", "name", "role", "createdAt"],
        properties: {
            email: {
                bsonType: "string",
                description: "must be a valid email address and is required",
                pattern: "^\\S+@\\S+\\.\\S+$"
            },
            password: {
                bsonType: "string",
                description: "must be a string and is required",
                minLength: 8
            },
            name: {
                bsonType: "string",
                description: "must be a string and is required",
                minLength: 2
            },
            role: {
                bsonType: "string",
                description: "must be a string and is required",
                enum: ["student", "teacher", "admin", "parent"],
                default: "student"
            },
            grade: {
                bsonType: "string",
                description: "must be a string if the field exists",
                enum: ["8", "9", "10", "11", "12", "university", null]
            },
            school: {
                bsonType: "string",
                description: "must be a string if the field exists"
            },
            createdAt: {
                bsonType: "date",
                description: "must be a date and is required"
            },
            updatedAt: {
                bsonType: "date",
                description: "must be a date if the field exists"
            },
            permissions: {
                bsonType: "array",
                description: "specific permissions beyond role",
            items: {
                bsonType: "string",
                enum: ["material_approval", "class_management"]
            }
            }
        }
    },
    learningMaterials: {
        bsonType: "object",
        required: ["title", "subject", "gradeLevel", "type", "createdAt"],
        properties: {
            title: {
                bsonType: "string",
                description: "must be a string and is required"
            },
            description: {
                bsonType: "string",
                description: "must be a string if the field exists"
            },
            subject: {
                bsonType: "string",
                description: "must be a string and is required",
                enum: ["mathematics", "physical-sciences", "life-sciences", "english", "afrikaans", "history", "geography", "economics", "accounting"]
            },
            accessLevel: {
                bsonType: "string",
                enum: ["public", "school", "class"],
                default: "class"
            },
            allowedClasses: {
                bsonType: "array",
                items: { bsonType: "objectId" }
            },
            gradeLevel: {
                bsonType: "string",
                description: "must be a string and is required",
                enum: ["8", "9", "10", "11", "12", "university"]
            },
            type: {
                bsonType: "string",
                description: "must be a string and is required",
                enum: ["video", "pdf", "quiz", "worksheet", "presentation", "other"]
            },
            fileUrl: {
                bsonType: "string",
                description: "must be a string if the field exists"
            },
            thumbnailUrl: {
                bsonType: "string",
                description: "must be a string if the field exists"
            },
            duration: {
                bsonType: "int",
                description: "must be an integer in minutes if the field exists"
            },
            createdBy: {
                bsonType: "objectId",
                description: "must be an objectId and is required"
            },
            isApproved: {
                bsonType: "bool",
                description: "must be a boolean if the field exists",
                default: false
            },
            createdAt: {
                bsonType: "date",
                description: "must be a date and is required"
            },
            updatedAt: {
                bsonType: "date",
                description: "must be a date if the field exists"
            }
        }
    },
    assignments: {
        bsonType: "object",
        required: ["title", "description", "dueDate", "createdBy", "classId", "createdAt"],
        properties: {
            title: {
                bsonType: "string",
                description: "must be a string and is required"
            },
            description: {
                bsonType: "string",
                description: "must be a string and is required"
            },
            dueDate: {
                bsonType: "date",
                description: "must be a date and is required"
            },
            attachments: {
                bsonType: "array",
                description: "must be an array if the field exists",
                items: {
                    bsonType: "object",
                    required: ["url", "type"],
                    properties: {
                        url: { bsonType: "string" },
                        type: { bsonType: "string" },
                        name: { bsonType: "string" }
                    }
                }
            },
            createdBy: {
                bsonType: "objectId",
                description: "must be an objectId and is required"
            },
            classId: {
                bsonType: "objectId",
                description: "must be an objectId and is required"
            },
            submissions: {
                bsonType: "array",
                description: "must be an array if the field exists",
                items: {
                    bsonType: "object",
                    required: ["studentId", "submittedAt"],
                    properties: {
                        studentId: { bsonType: "objectId" },
                        submittedAt: { bsonType: "date" },
                        files: { bsonType: "array" },
                        grade: { bsonType: "number" },
                        feedback: { bsonType: "string" }
                    }
                }
            },
            submissionPolicy: {
              bsonType: "object",
              properties: {
                  allowLate: { bsonType: "bool" },
                  maxAttempts: { bsonType: "int" }
                    }
            }, 
            createdAt: {
                bsonType: "date",
                description: "must be a date and is required"
            },
            updatedAt: {
                bsonType: "date",
                description: "must be a date if the field exists"
            }
        }
    },
    classes: {
        bsonType: "object",
        required: ["name", "subject", "gradeLevel", "teacherId", "createdAt"],
        properties: {
            name: {
                bsonType: "string",
                description: "must be a string and is required"
            },
            description: {
                bsonType: "string",
                description: "must be a string if the field exists"
            },
            subject: {
                bsonType: "string",
                description: "must be a string and is required",
                enum: ["mathematics", "physical-sciences", "life-sciences", "english", "afrikaans", "history", "geography", "economics", "accounting"]
            },
            gradeLevel: {
                bsonType: "string",
                description: "must be a string and is required",
                enum: ["8", "9", "10", "11", "12", "university"]
            },
            teacherId: {
                bsonType: "objectId",
                description: "must be an objectId and is required"
            },
            students: {
                bsonType: "array",
                description: "must be an array if the field exists",
                items: {
                    bsonType: "objectId"
                }
            },
            joinCode: {
                bsonType: "string",
                description: "must be a string if the field exists",
                minLength: 6,
                maxLength: 6
            },
            createdAt: {
                bsonType: "date",
                description: "must be a date and is required"
            },
            updatedAt: {
                bsonType: "date",
                description: "must be a date if the field exists"
            }
        }
    },
    assessments: {
        bsonType: "object",
        required: ["title", "questions", "createdBy", "subject", "gradeLevel", "createdAt"],
        properties: {
            title: {
                bsonType: "string",
                description: "must be a string and is required"
            },
            description: {
                bsonType: "string",
                description: "must be a string if the field exists"
            },
            subject: {
                bsonType: "string",
                description: "must be a string and is required",
                enum: ["mathematics", "physical-sciences", "life-sciences", "english", "afrikaans", "history", "geography", "economics", "accounting"]
            },
            gradeLevel: {
                bsonType: "string",
                description: "must be a string and is required",
                enum: ["8", "9", "10", "11", "12", "university"]
            },
            questions: {
                bsonType: "array",
                description: "must be an array and is required",
                minItems: 1,
                items: {
                    bsonType: "object",
                    required: ["text", "type"],
                    properties: {
                        text: { bsonType: "string" },
                        type: { 
                            bsonType: "string",
                            enum: ["multiple-choice", "true-false", "short-answer", "essay"]
                        },
                        options: { bsonType: "array" },
                        correctAnswer: { bsonType: "string" },
                        marks: { bsonType: "number" }
                    }
                }
            },
            timeLimit: {
                bsonType: "int",
                description: "must be an integer in minutes if the field exists"
            },
            createdBy: {
                bsonType: "objectId",
                description: "must be an objectId and is required"
            },
            assignedTo: {
                bsonType: "array",
                description: "must be an array if the field exists",
                items: {
                    bsonType: "objectId"
                }
            },
            createdAt: {
                bsonType: "date",
                description: "must be a date and is required"
            },
            updatedAt: {
                bsonType: "date",
                description: "must be a date if the field exists"
            }
        }
    },
   ml_models: {
    bsonType: "object",
    required: ["name", "type", "huggingface_id", "status", "createdAt"],
    properties: {
        name: {
            bsonType: "string",
            description: "must be a string and is required",
            minLength: 3
    },
        huggingface_id: {
            bsonType: "string",
            description: "must be a valid Hugging Face model ID",
            pattern: "^[a-zA-Z0-9-_.]+/[a-zA-Z0-9-_.]+$"
    },
        type: {
            enum: ["translation", "chatbot", "text-generation", "image-processing"],
            description: "must be a valid model type"
    },
        target_languages: {
            bsonType: "array",
            items: {
            enum: ["zu", "xh", "af", "en"]
      }
    },
        accuracy: {
            bsonType: "number",
            minimum: 0,
            maximum: 1,
            description: "must be a float between 0-1"
    },
        status: {
            enum: ["active", "training", "disabled"],
            default: "active"
    },
        school_access: {
            bsonType: "array",
            items: {
            bsonType: "objectId"
        }
    },
        createdAt: {
            bsonType: "date",
            description: "must be a date and is required"
    },
        last_updated: {
            bsonType: "date"
    },
        training_metrics: {
            bsonType: "object",
            properties: {
            epochs: { bsonType: "int" },
            loss: { bsonType: "number" },
            bleu_score: { bsonType: "number" }
                }
            }
        }
    },

    ml_usage_logs: {
        bsonType: "object",
        required: ["model_id", "user_id", "timestamp"],
        properties: {
            model_id: {
                bsonType: "objectId",
                description: "must reference ml_models collection"
            },
            user_id: {
                bsonType: "objectId",
                description: "must reference users collection"
            },
            input_text: {
                bsonType: "string"
            },
            output_text: {
                bsonType: "string"
            },
            processing_time_ms: {
                bsonType: "int",
                minimum: 0
            },
            timestamp: {
                bsonType: "date",
                description: "must be a date and is required"
            },
            feedback_score: {
                bsonType: "int",
                minimum: 1,
                maximum: 5
            }
        }
    }

};