import { Timestamp } from "firebase/firestore";

export interface Course {
    id: string;
    name: string;
    platform: string;
    totalModules: number;
    modulesCompleted: number;
    estimatedHours: number;
    status: 'Not Started' | 'Ongoing' | 'Completed';
    addedAt: Timestamp;
}

export interface JournalEntry {
    id: string;
    userId: string;
    entryDate: string; // Stored as 'YYYY-MM-DD'
    topicsLearned: string;
    scheduledTasks: string;
    reflection: string;
    status: 'Pending' | 'Completed';
    createdAt: Timestamp;
}
