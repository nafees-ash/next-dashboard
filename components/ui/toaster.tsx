'use client';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { COLOR_PALETTE2 } from '../variables';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast
            key={id}
            {...props}
            style={{
              backgroundColor: COLOR_PALETTE2.lightblue,
              borderWidth: 1,
              borderColor: COLOR_PALETTE2.darkblue,
            }}
          >
            <div className="grid gap-1">
              {title && (
                <ToastTitle className="text-[18px]">{title}</ToastTitle>
              )}
              {description && (
                <ToastDescription className="text-[14px]">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
