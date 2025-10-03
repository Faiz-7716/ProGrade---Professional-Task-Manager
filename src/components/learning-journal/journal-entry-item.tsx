
'use client';
import { useState } from 'react';
import { LearningJournalEntry } from '@/lib/types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Clock, Edit, Trash2, CheckCircle, MoreVertical, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import JournalEntryForm from './journal-entry-form';
import DeleteEntryDialog from './delete-entry-dialog';
import { useUser, useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const statusStyles: { [key: string]: string } = {
  'Completed': 'bg-green-100 text-green-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Pending': 'bg-yellow-100 text-yellow-800',
};

interface JournalEntryItemProps {
  entry: LearningJournalEntry;
}

export default function JournalEntryItem({ entry }: JournalEntryItemProps) {
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { user, firestore } = useUser();
  const { toast } = useToast();

  const handleMarkAsComplete = async () => {
    if (!user || !firestore) return;
    const entryRef = doc(firestore, 'users', user.uid, 'journalEntries', entry.id);
    try {
      await updateDoc(entryRef, { status: 'Completed' });
      toast({ title: "Success", description: "Entry marked as complete." });
    } catch (error) {
      toast({ variant: 'destructive', title: "Error", description: "Failed to update entry." });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>{entry.topic}</CardTitle>
                {entry.courseName && <CardDescription>{entry.courseName}</CardDescription>}
            </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              {entry.status !== 'Completed' && (
                <DropdownMenuItem onClick={handleMarkAsComplete}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Complete
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{entry.notes}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{entry.timeSpent} minutes</span>
        </div>
        <Badge className={statusStyles[entry.status] ?? ''}>{entry.status}</Badge>
      </CardFooter>

      {/* Dialogs for editing and deleting */}
      <JournalEntryForm 
        isOpen={isEditDialogOpen} 
        setIsOpen={setEditDialogOpen} 
        entry={entry} 
      />
      <DeleteEntryDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setDeleteDialogOpen}
        entryId={entry.id}
        entryTopic={entry.topic}
      />
    </Card>
  );
}
