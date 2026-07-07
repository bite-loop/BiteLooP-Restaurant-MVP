// components/sidebar/success-page/sidebar-trigger.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ClipboardList } from 'lucide-react';
import { RestaurantStatusSidebar } from './onboarding-sidebar';

interface StatusSidebarTriggerProps {
  restaurantId: string;
  onStatusChange?: (status: string) => void;
}

export function StatusSidebarTrigger({ restaurantId, onStatusChange }: StatusSidebarTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => setIsOpen(true)}
      >
        <ClipboardList className="w-4 h-4" />
        View Detailed Status
      </Button>
      
      <RestaurantStatusSidebar
        restaurantId={restaurantId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onStatusChange={onStatusChange}
      />
    </>
  );
}