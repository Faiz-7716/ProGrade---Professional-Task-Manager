'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import {
  Delete,
  Calendar as CalendarIcon,
  Check,
  ShoppingBag,
  Gift,
  Utensils,
  Car,
  HeartPulse,
  MoreHorizontal,
  Wallet,
  CreditCard,
  Globe,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';

const categories = [
  { name: 'Shopping', icon: ShoppingBag },
  { name: 'Gifts', icon: Gift },
  { name: 'Food', icon: Utensils },
  { name: 'Transport', icon: Car },
  { name: 'Health', icon: HeartPulse },
  { name: 'Other', icon: MoreHorizontal },
];

const paymentMethods = [
  { name: 'Cash', icon: Wallet },
  { name: 'Card', icon: CreditCard },
  { name: 'Online', icon: Globe },
];

interface AddExpenseSheetProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function AddExpenseSheet({
  isOpen,
  setIsOpen,
}: AddExpenseSheetProps) {
  const [amount, setAmount] = useState('0');
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState(categories[0].name);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].name);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
    } else if (key === '.') {
      if (!amount.includes('.')) {
        setAmount((prev) => prev + '.');
      }
    } else {
      setAmount((prev) => (prev === '0' ? key : prev + key));
    }
  };
  
  const resetForm = () => {
    setAmount('0');
    setComment('');
    setCategory(categories[0].name);
    setPaymentMethod(paymentMethods[0].name);
    setDate(new Date());
  }

  const handleSubmit = async () => {
    if (!user || !firestore || !date) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in and select a date.',
      });
      return;
    }
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Amount',
        description: 'Please enter a valid expense amount.',
      });
      return;
    }

    setIsLoading(true);
    try {
      await addDoc(collection(firestore, 'users', user.uid, 'expenses'), {
        userId: user.uid,
        amount: numericAmount,
        category,
        paymentMethod,
        comment,
        date: Timestamp.fromDate(date),
      });
      toast({
        title: 'Expense Added!',
        description: `Your expense of $${numericAmount} has been recorded.`,
      });
      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add expense. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const keypadButtons = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl flex flex-col">
        <SheetHeader>
          <SheetTitle>Add New Expense</SheetTitle>
          <SheetDescription>
            Enter the details of your transaction.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-grow flex flex-col justify-between p-4">
            <div className="text-center space-y-4">
                <div className="flex gap-4">
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger>
                            <SelectValue placeholder="Payment Method" />
                        </SelectTrigger>
                        <SelectContent>
                            {paymentMethods.map(p => <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                             {categories.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="text-5xl font-bold tracking-tighter text-foreground">
                    <span className="text-muted-foreground">$</span>{amount}
                </div>
                 <Textarea
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={2}
                 />
            </div>

            <div className="grid grid-cols-3 gap-2">
                {keypadButtons.map(key => (
                    <Button 
                        key={key} 
                        variant="outline"
                        className="h-16 text-2xl font-bold" 
                        onClick={() => handleKeyPress(key)}
                    >
                        {key === 'backspace' ? <Delete /> : key}
                    </Button>
                ))}
            </div>
             <div className="flex items-center gap-2">
                 <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'flex-1 justify-start text-left font-normal',
                        !date && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Button 
                    size="lg" 
                    className="h-16 flex-grow" 
                    onClick={handleSubmit} 
                    disabled={isLoading}
                >
                    <Check className="h-8 w-8" />
                </Button>
             </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
