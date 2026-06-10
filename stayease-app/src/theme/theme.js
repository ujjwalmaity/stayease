import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#2e7d32",
    },
    background: {
      default: "#f8f8f8" /* ensures CssBaseline uses same background */,
      paper: "#f8f8f8" /* keep paper components white if desired */,
    },
  },
});

export default theme;
