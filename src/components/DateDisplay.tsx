'use client';

import { useState, useEffect } from 'react';

export default function DateDisplay() {
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const year = now.getFullYear();
      setCurrentDate(`${day}/${month}/${year}`);
    };

    // Update immediately
    updateDate();

    // Update every minute to ensure the date stays current
    const interval = setInterval(updateDate, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-gray-500 text-sm font-medium">
      {currentDate}
    </span>
  );
}
