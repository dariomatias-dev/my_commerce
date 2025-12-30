import { useState } from "react";

export type FeedbackType = "success" | "error";

export const useProfileFeedback = () => {
  const [feedback, setFeedback] = useState<{
    message: string;
    type: FeedbackType;
  } | null>(null);

  const showFeedback = (message: string, type: FeedbackType) => {
    setFeedback({ message, type });

    setTimeout(() => setFeedback(null), 3000);
  };

  return { feedback, showFeedback, clearFeedback: () => setFeedback(null) };
};
