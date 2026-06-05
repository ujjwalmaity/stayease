import { Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 2,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "4rem", md: "6rem" },
          }}
        >
          404
        </Typography>
        <Typography variant="h4" fontWeight={600}>
          Page Not Found
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 500 }}
        >
          The page you are looking for may have been moved, deleted, or the URL
          might be incorrect.
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
          onClick={() => navigate("/")}
        >
          Go to Home
        </Button>
      </Box>
    </Container>
  );
}
