'use client';

import React from 'react';
import { Button } from '../components/ui/button';

interface Props {
  request: any;
  onDetailsClick: () => void;
  onChatClick: () => void;
  onDataSharedClick: () => void;
}

const RequestCard = ({ request, onDetailsClick, onChatClick, onDataSharedClick }: Props) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-4 border border-purple-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-purple-700">{request.companyName}</h2>
          <p className="text-sm text-gray-500">{request.useCase}</p>
          <p className="text-xs text-gray-400">Website: <a href={request.website} target="_blank" className="text-blue-400 underline">{request.website}</a></p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onDetailsClick}>Details</Button>
          <Button variant="outline" onClick={onChatClick}>Chat</Button>
          <Button variant="outline" onClick={onDataSharedClick}>Data Shared</Button>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
