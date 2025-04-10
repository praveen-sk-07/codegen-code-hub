
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  to?: string;
  label?: string;
}

const BackButton = ({ to, label = "Back" }: BackButtonProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };
  
  return (
    <Button
      variant="ghost"
      size="sm"
      className="mb-4 flex items-center gap-1 text-muted-foreground hover:text-foreground"
      onClick={handleClick}
    >
      <ArrowLeft className="h-4 w-4" /> {label}
    </Button>
  );
};

export default BackButton;
