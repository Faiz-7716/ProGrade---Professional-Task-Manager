{
  "entities": {
    "JournalEntry": {
      "title": "Journal Entry",
      "type": "object",
      "description": "Represents a daily journal entry for a user to track learning and reflections.",
      "properties": {
        "userId": {
          "type": "string",
          "description": "The ID of the user who owns this journal entry."
        },
        "entryDate": {
          "type": "string",
          "description": "The date for the journal entry in YYYY-MM-DD format."
        },
        "courseProgress": {
          "type": "array",
          "description": "An array of objects detailing progress made in specific courses.",
          "items": {
            "type": "object",
            "properties": {
              "courseId": {
                "type": "string"
              },
              "courseName": {
                "type": "string"
              },
              "notes": {
                "type": "string"
              }
            },
            "required": ["courseId", "courseName", "notes"]
          }
        },
        "reflection": {
          "type": "string",
          "description": "The user's overall reflection or thoughts for the day."
        },
        "createdAt": {
          "type": "string",
          "description": "The timestamp when the entry was created.",
          "format": "date-time"
        }
      },
      "required": ["userId", "entryDate", "courseProgress", "reflection", "createdAt"]
    },
    "Course": {
      "title": "Course",
      "type": "object",
      "description": "Represents an online course a user is tracking.",
      "properties": {
        "userId": {
          "type": "string",
          "description": "The ID of the user who owns this course."
        },
        "name": {
          "type": "string",
          "description": "The name of the course."
        },
        "platform": {
          "type": "string",
          "description": "The platform where the course is hosted (e.g., Udemy, Coursera)."
        },
        "totalModules": {
          "type": "number",
          "description": "The total number of modules or lessons in the course."
        },
        "modulesCompleted": {
          "type": "number",
          "description": "The number of modules the user has completed."
        },
        "estimatedHours": {
          "type": "number",
          "description": "The estimated total hours to complete the course."
        },
        "status": {
          "type": "string",
          "description": "The current status of the course.",
          "enum": [
            "Not Started",
            "Ongoing",
            "Completed"
          ]
        },
        "addedAt": {
          "type": "string",
          "description": "The timestamp when the course was added.",
          "format": "date-time"
        }
      },
      "required": [
        "userId",
        "name",
        "platform",
        "totalModules",
        "modulesCompleted",
        "status",
        "addedAt"
      ]
    },
    "QuizHistory": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "QuizHistory",
      "type": "object",
      "description": "Stores the history of quizzes taken by users, including points, and answer statistics.",
      "properties": {
        "userId": {
          "type": "string",
          "description": "The unique identifier of the user who took the quiz."
        },
        "quizName": {
          "type": "string",
          "description": "The name or title of the quiz."
        },
        "points": {
          "type": "number",
          "description": "The total points earned by the user on the quiz."
        },
        "correctAnswers": {
          "type": "number",
          "description": "The number of questions answered correctly."
        },
        "wrongAnswers": {
          "type": "number",
          "description": "The number of questions answered incorrectly."
        },
        "completionDate": {
          "type": "string",
          "description": "The date and time when the quiz was completed.",
          "format": "date-time"
        }
      },
      "required": [
        "userId",
        "quizName",
        "points",
        "correctAnswers",
        "wrongAnswers",
        "completionDate"
      ]
    },
    "User": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "User",
      "type": "object",
      "description": "Represents a user of the Prograde application.",
      "properties": {
        "id": {
          "type": "string",
          "description": "Unique identifier for the user."
        },
        "linkedInProfileId": {
          "type": "string",
          "description": "The LinkedIn profile ID of the user."
        },
        "email": {
          "type": "string",
          "description": "The email address of the user.",
          "format": "email"
        },
        "firstName": {
          "type": "string",
          "description": "The first name of the user."
        },
        "lastName": {
          "type": "string",
          "description": "The last name of the user."
        }
      },
      "required": [
        "id",
        "linkedInProfileId",
        "email",
        "firstName",
        "lastName"
      ]
    }
  },
  "auth": {
    "providers": [
      "password",
      "anonymous",
      "google.com",
      "github.com"
    ]
  },
  "firestore": {
    "structure": [
      {
        "path": "/users/{userId}/quiz_history/{quizHistoryId}",
        "definition": {
          "entityName": "QuizHistory",
          "schema": {
            "$ref": "#/backend/entities/QuizHistory"
          },
          "description": "Stores the quiz history for each user, including points, and answer statistics. Path-based ownership ensures that only the user can access their own quiz history. No denormalized authorization fields are required.",
          "params": [
            {
              "name": "userId",
              "description": "The unique identifier of the user."
            },
            {
              "name": "quizHistoryId",
              "description": "The unique identifier of the quiz history entry."
            }
          ]
        }
      },
      {
        "path": "/users/{userId}/courses/{courseId}",
        "definition": {
          "entityName": "Course",
          "schema": {
            "$ref": "#/backend/entities/Course"
          },
          "description": "Stores the courses for each user. Path-based ownership ensures that only the user can access their own courses.",
          "params": [
            {
              "name": "userId",
              "description": "The unique identifier of the user."
            },
            {
              "name": "courseId",
              "description": "The unique identifier of the course entry."
            }
          ]
        }
      },
       {
        "path": "/users/{userId}/journalEntries/{entryId}",
        "definition": {
          "entityName": "JournalEntry",
          "schema": {
            "$ref": "#/backend/entities/JournalEntry"
          },
          "description": "Stores daily journal entries for each user.",
          "params": [
            {
              "name": "userId",
              "description": "The unique identifier of the user."
            },
            {
              "name": "entryId",
              "description": "The unique identifier of the journal entry."
            }
          ]
        }
      }
    ],
    "reasoning": "The Firestore structure is designed to store user-related data for the Prograde application. The structure implements path-based ownership for all user-specific data to ensure security and query efficiency.\n\nThe structure is as follows:\n\n*   `/users/{userId}/quiz_history/{quizHistoryId}`: Stores the quiz history for each user.\n*   `/users/{userId}/courses/{courseId}`: Stores the courses for each user.\n*   `/users/{userId}/journalEntries/{entryId}`: Stores daily journal entries for each user."
  }
}