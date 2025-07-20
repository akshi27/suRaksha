import React from 'react';
import { fieldAccessMatrix } from '../../lib/fieldAccessMatrix';

interface RequestedFieldsBannerProps {
  requestedFields: string[];
  useCase: UseCaseType;
}

export type UseCaseType = keyof typeof fieldAccessMatrix;

const getFieldStatus = (field: string, useCase: UseCaseType) => {
  const access = fieldAccessMatrix[useCase as keyof typeof fieldAccessMatrix];
  if (!access) return { label: 'Unknown', color: 'gray' };

  if (access.explicitlyShare.includes(field)) {
    return { label: 'Bank Approved', color: 'green' };
  } else if (access.maskShare.includes(field)) {
    return { label: 'Mask Share', color: 'blue' };
  } else if (access.withConsent.includes(field)) {
    return { label: 'Capsulized', color: 'orange' };
  } else {
    return { label: 'Confidential', color: 'red' };
  }
};

export default function RequestedFieldsBanner({ requestedFields, useCase }: RequestedFieldsBannerProps) {
  return (
    <div className="bg-gray-50 border-b px-4 pt-4 pb-3 rounded-t-md">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Requested Fields & Access Status</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {requestedFields.map((field, idx) => {
          const status = getFieldStatus(field, useCase);
          return (
            <div
              key={idx}
              className="bg-white border px-3 py-1.5 rounded flex items-center justify-between shadow-sm"
            >
              <span className="text-sm text-gray-800">{field}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-${status.color}-100 text-${status.color}-800`}>
                {status.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
