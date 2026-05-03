import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const title = "Standard Card";

interface Props {
  title: string;
  description: string;
  content: string;
  feedback: "neutral" | "accepted" | "rejected";
  onAction: (value: "accept" | "reject") => void;
}

const CardStandard1 = ({
  title,
  description,
  content,
  feedback,
  onAction,
}: Props) => {
  const isAccepted = feedback === "accepted";
  const isRejected = feedback === "rejected";

  const handleReject = () => {
    console.log(isRejected)
    if (isRejected) return; // extra safety
    onAction("reject");
  };

  const handleAccept = () => {
    if (isAccepted) return; // extra safety
    onAction("accept");
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-start">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>

        {feedback !== "neutral" && (
          <Badge variant={isAccepted ? "default" : "destructive"}>
            {feedback}
          </Badge>
        )}
      </CardHeader>

      <CardContent>
        <p>{content}</p>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handleReject}
          disabled={isRejected}
        >
          Reject
        </Button>

        <Button
          type="button"
          onClick={handleAccept}
          disabled={isAccepted}
        >
          Accept
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardStandard1;
