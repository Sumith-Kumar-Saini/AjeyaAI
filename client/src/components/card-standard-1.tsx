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
import { useNavigate } from "@tanstack/react-router";

export const title = "Standard Card";

interface Props {
  title: string;
  description: string;
  content: string;
  feedback: "neutral" | "accepted" | "rejected";
  onAction: (value: "accept" | "reject") => void;
  ids: { project: string; feature: string };
}

const CardStandard1 = ({
  ids,
  title,
  description,
  content,
  feedback,
  onAction,
}: Props) => {
  const isAccepted = feedback === "accepted";
  const isRejected = feedback === "rejected";

  const navigate = useNavigate();

  const handleReject = () => {
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

      <CardContent className="mt-auto">
        <p>{content}</p>
      </CardContent>

      <CardFooter className="flex justify-between ">
        {isAccepted && !isRejected ? (
          <Button
            type="button"
            className="cursor-pointer"
            onClick={() =>
              navigate({
                to: "/dashboard/$projectId/feature/$featureId",
                params: { projectId: ids.project, featureId: ids.feature },
              })
            }
          >
            View Feature
          </Button>
        ) : isRejected ? (
          <Button
            type="button"
            variant="outline"
            className="cursor-not-allowed"
            disabled
          >
            Rejected
          </Button>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={handleReject}
              className="cursor-pointer"
            >
              Reject
            </Button>

            <Button
              type="button"
              onClick={handleAccept}
              className="cursor-pointer"
            >
              Accept
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default CardStandard1;
