import { useState } from "react";

export type FeedbackType = "success" | "error";

export const useFeedback = () => {
  const [feedback, setFeedback] = useState<{
    type: FeedbackType;
    message: string;
  } | null>(null);

  const showFeedback = (type: FeedbackType, message: string) => {
    setFeedback({ type, message });

    setTimeout(() => setFeedback(null), 3000);
  };

  return { feedback, showFeedback, clearFeedback: () => setFeedback(null) };
};
