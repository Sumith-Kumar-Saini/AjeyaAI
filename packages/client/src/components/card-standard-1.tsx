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
  onAction: (value: "accept" | "reject") => void;
}

const CardStandard1 = ({ title, description, content, onAction }: Props) => {
  const reject = () => onAction("reject");
  const accept = () => onAction("accept");
  return (
    <Card className="">
    {/* <Card className="w-87.5"> */}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={reject}>
          Reject
        </Button>
        <Button onClick={accept}>Accept</Button>
      </CardFooter>
    </Card>
  );
};

export default CardStandard1;
