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
    reflection: string;
    createdAt: Timestamp;
}

export interface ScheduledEvent {
    id: string;
    userId: string;
    title: string;
    description?: string;
    date: string; // Stored as 'YYYY-MM-DD'
    status: 'Pending' | 'Completed';
    createdAt: Timestamp;
}
