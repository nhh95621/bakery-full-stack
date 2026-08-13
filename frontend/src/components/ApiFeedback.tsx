import React from "react";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_RETRY_LABEL, getFeedbackToneClasses, getLoadingLabel, type ApiFeedbackTone } from "@/utils/apiFeedback";

type ApiLoadingProps = {
  label?: string;
  tone?: ApiFeedbackTone;
};

export function ApiLoading({ label, tone = "light" }: ApiLoadingProps) {
  const { icon: color } = getFeedbackToneClasses(tone);
  return (
    <div role="status" aria-live="polite" className="flex min-h-48 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <Loader2 className={`h-7 w-7 animate-spin ${color}`} aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{getLoadingLabel(label)}</p>
    </div>
  );
}

type ApiErrorProps = {
  title: string;
  description: string;
  onRetry: () => void;
  tone?: ApiFeedbackTone;
};

export function ApiError({ title, description, onRetry, tone = "light" }: ApiErrorProps) {
  const isDark = tone === "dark";
  const { icon, panel } = getFeedbackToneClasses(tone);
  return (
    <div role="alert" className={`border px-6 py-10 text-center ${panel}`}>
      <AlertCircle className={`mx-auto h-6 w-6 ${icon}`} aria-hidden="true" />
      <h3 className="mt-4 font-serif text-2xl">{title}</h3>
      <p className={`mx-auto mt-2 max-w-md text-sm leading-6 ${isDark ? "text-primary-foreground/65" : "text-muted-foreground"}`}>{description}</p>
      <Button type="button" variant={isDark ? "outline" : "default"} onClick={onRetry} className={isDark ? "mt-6 border-gold/60 text-gold hover:bg-gold hover:text-primary" : "btn-primary mt-6"}>
        <RefreshCw size={15} /> {API_RETRY_LABEL}
      </Button>
    </div>
  );
}
