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

export interface LearningJournalEntry {
    id: string;
    userId: string;
    entryDate: string; // ISO string date (e.g., "2024-10-26")
    courseName?: string;
    topic: string;
    timeSpent: number; // in minutes
    notes: string;
    status: 'Completed' | 'In Progress' | 'Pending';
    createdAt: Timestamp;
}
