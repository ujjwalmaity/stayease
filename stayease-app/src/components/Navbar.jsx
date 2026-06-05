import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CONSTANTS from "../utils/constants";

export default function Navbar() {
  const { role, logout, isAuthenticated } = useAuth();
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: "bold", textDecoration: "none", color: "#fff" }}
          component={Link}
          to="/"
        >
          StayEase
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        {isAuthenticated && (
          <Button color="inherit" component={Link} to="/my-stays">
            My Stays
          </Button>
        )}
        {role === CONSTANTS.ROLES.MANAGER && (
          <Button color="inherit" component={Link} to="/manager">
            Manager
          </Button>
        )}
        {role === CONSTANTS.ROLES.ADMIN && (
          <Button color="inherit" component={Link} to="/admin/hotels">
            Admin
          </Button>
        )}
        {isAuthenticated ? (
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        ) : (
          <Box>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
