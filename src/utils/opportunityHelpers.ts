// Utility functions for opportunity management

export const isDeadlinePassed = (deadline: string): boolean => {
  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(23, 59, 59, 999); // Set to end of deadline day
  const today = new Date();
  return today > deadlineDate; // Only close AFTER the deadline day has fully passed
};

export const formatDeadline = (deadline: string): string => {
  const deadlineDate = new Date(deadline);
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return deadlineDate.toLocaleDateString('en-US', options);
};

export const getOpportunityStatus = (deadline: string, manuallyDisabled: boolean): 'open' | 'closed' => {
  if (manuallyDisabled) return 'closed';
  return isDeadlinePassed(deadline) ? 'closed' : 'open';
};

export const getDaysUntilDeadline = (deadline: string): number => {
  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(23, 59, 59, 999); // End of deadline day
  const today = new Date();
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getDeadlineStatus = (deadline: string): {
  status: 'expired' | 'urgent' | 'normal';
  message: string;
} => {
  const days = getDaysUntilDeadline(deadline);
  
  if (days < 0) {
    return { status: 'expired', message: 'Expired' };
  } else if (days === 0) {
    return { status: 'urgent', message: 'Closes Today!' };
  } else if (days <= 7) {
    return { status: 'urgent', message: `${days} day${days > 1 ? 's' : ''} left` };
  } else {
    return { status: 'normal', message: formatDeadline(deadline) };
  }
};
