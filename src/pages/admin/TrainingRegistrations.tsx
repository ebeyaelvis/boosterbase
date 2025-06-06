
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FetchError } from '@/components/admin/FetchError';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

interface TrainingRegistration {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  education: string;
  experience: string;
  additional_info?: string;
  is_reviewed: boolean;
  created_at: string;
}

const TrainingRegistrations = () => {
  const { toast } = useToast();
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const { data: registrations, isLoading, error, refetch } = useQuery({
    queryKey: ['trainingRegistrations'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('training_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TrainingRegistration[];
    }
  });

  const markAsReviewed = async (id: string) => {
    setReviewingId(id);
    try {
      const { error } = await (supabase as any)
        .from('training_registrations')
        .update({ is_reviewed: true })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Registration marked as reviewed',
      });
      
      refetch();
    } catch (error) {
      console.error('Error marking registration as reviewed:', error);
      toast({
        title: 'Error',
        description: 'Could not update registration status',
        variant: 'destructive',
      });
    } finally {
      setReviewingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <FetchError message="Could not load training registrations" onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Training Registrations</h1>
        <Button variant="outline" onClick={() => window.open('/', '_blank')}>
          View Website
        </Button>
      </div>
      
      {registrations && registrations.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Education</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((registration) => (
                <TableRow key={registration.id}>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(registration.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>{registration.name}</TableCell>
                  <TableCell>
                    <div>{registration.email}</div>
                    <div className="text-xs text-muted-foreground">{registration.phone}</div>
                  </TableCell>
                  <TableCell>
                    {registration.course.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </TableCell>
                  <TableCell>
                    {registration.education.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </TableCell>
                  <TableCell>{registration.experience}</TableCell>
                  <TableCell>
                    {registration.is_reviewed ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span>Reviewed</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-amber-600">
                        <XCircle className="h-4 w-4 mr-1" />
                        <span>Pending</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={registration.is_reviewed || reviewingId === registration.id}
                      onClick={() => markAsReviewed(registration.id)}
                    >
                      {reviewingId === registration.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Mark as Reviewed'
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center p-12 border rounded-lg bg-muted/10">
          <h3 className="text-lg font-medium">No training registrations yet</h3>
          <p className="text-muted-foreground mt-1">
            Registrations will appear here once users submit the form on the training page.
          </p>
        </div>
      )}
    </div>
  );
};

export default TrainingRegistrations;
