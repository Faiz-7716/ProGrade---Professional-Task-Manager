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
    reflection: string;
    createdAt: Timestamp;
    courseProgress: {
        courseId: string;
        courseName: string;
        notes: string;
    }[];
}

export interface Expense {
    id: string;
    userId: string;
    amount: number;
    category: 'Food' | 'Shopping' | 'Transport' | 'Gifts' | 'Health' | 'Other';
    paymentMethod: 'Cash' | 'Card' | 'Online';
    comment?: string;
    date: Timestamp;
}
