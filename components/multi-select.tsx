'use client';

import { JSX, SVGProps, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from './ui/label';

export default function Component({
  label,
  options,
  onChange,
  selectedOptions,
}: {
  label: string;
  options: string[];
  selectedOptions: string[];
  onChange: (selectedOptions: string[]) => void;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  //   const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const handleOptionSelect = (option: string) => {
    if (selectedOptions.includes(option)) {
      onChange(selectedOptions.filter((item) => item !== option));
    } else {
      onChange([...selectedOptions, option]);
    }
  };
  const handleRemoveOption = (option: string) => {
    onChange(selectedOptions.filter((item) => item !== option));
  };

  return (
    <div className="relative space-y-2">
      <Label>{label}</Label>
      <div
        className="border-input relative flex cursor-pointer items-center justify-between gap-x-2 rounded-md border bg-white py-2 pr-3"
        onClick={() => setOpen(!open)}
      >
        {selectedOptions.length > 0 ? (
          <div className=" flex flex-wrap gap-2 ">
            {selectedOptions.map((option) => (
              <div
                key={option}
                className=" flex items-center gap-2 rounded-full px-3 py-1"
              >
                <p className="rounded-md border border-gray-100 px-2 text-[14px] text-gray-800">
                  {options.find((opt) => opt === option)}
                </p>
                <button
                  className=" hover:text-red-500"
                  onClick={() => handleRemoveOption(option)}
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="pl-3 text-[14px] text-gray-800">Select {label}</p>
        )}
        <ChevronDownIcon className="aboslute text-muted-foreground right-5 h-4 w-4 opacity-60" />
      </div>
      {open && (
        <div className="border-input absolute left-0 top-full z-20 mt-2 w-full rounded-md border bg-white shadow-lg">
          <ul className="max-h-[300px] overflow-auto">
            {filteredOptions.map((option) => (
              <li
                key={option}
                className={`hover:bg-muted cursor-pointer px-4 py-2 ${
                  selectedOptions.includes(option)
                    ? 'bg-primary text-primary-foreground'
                    : ''
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ChevronDownIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function XIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
