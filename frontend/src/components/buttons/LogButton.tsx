import { Button } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import { useNavigate } from "react-router-dom";

export default function LogButton() {
  const navigate = useNavigate();

  return (
    <Button
      variant="outlined"
      startIcon={<HistoryIcon />}
      onClick={() => navigate("/taskprofilelog")}
      sx={{
        minWidth: 120,
        textTransform: "none",
        fontWeight: "medium",
      }}
    >
      View Logs
    </Button>
  );
}