import { Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

export default function HomeButton() {
  const navigate = useNavigate();

  return (
    <Button
      variant="outlined"
      startIcon={<HomeIcon />}
      onClick={() => navigate("/")}
      sx={{
        minWidth: 120,
        textTransform: "none",
        fontWeight: "medium",
      }}
    >
      Home
    </Button>
  );
}