import { Textarea } from "@/components/ui/textarea";

export const title = "Required Textarea";

const TextareaFrom1 = () => (
  <div className="flex w-full max-h-46 max-w-md flex-col gap-2">
    <Textarea
      className="bg-background min-h-46"
      id="message"
      placeholder="Paste your feedback"
      required
    />
  </div>
);

export default TextareaFrom1;
