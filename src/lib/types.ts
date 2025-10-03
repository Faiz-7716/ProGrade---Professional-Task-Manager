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
