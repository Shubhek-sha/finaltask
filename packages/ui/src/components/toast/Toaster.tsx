import * as ToastPrimitive from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/cn";
import { useToast } from "./use-toast";

const toastVariants = cva(
  "pointer-events-auto relative flex w-full items-start justify-between gap-3 rounded-md border p-4 shadow-lg",
  {
    variants: {
      variant: {
        default: "border-border bg-surface text-text",
        success: "border-transparent bg-success-500 text-white",
        destructive: "border-transparent bg-danger-500 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {toasts.map(({ id, title, description, variant }) => (
        <ToastPrimitive.Root
          key={id}
          className={cn(toastVariants({ variant }))}
          duration={5000}
          onOpenChange={(open) => {
            if (!open) dismiss(id);
          }}
        >
          <div className="flex flex-col gap-1">
            {title && <ToastPrimitive.Title className="text-sm font-semibold">{title}</ToastPrimitive.Title>}
            {description && (
              <ToastPrimitive.Description className="text-sm opacity-90">
                {description}
              </ToastPrimitive.Description>
            )}
          </div>
          <ToastPrimitive.Close
            className="shrink-0 rounded-sm opacity-70 transition-opacity hover:opacity-100"
            aria-label="Dismiss"
          >
            ✕
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport className="fixed bottom-0 right-0 z-[100] flex w-full max-w-sm flex-col gap-2 p-6" />
    </ToastPrimitive.Provider>
  );
}
