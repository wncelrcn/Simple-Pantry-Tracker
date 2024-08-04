// components/NavBar.js
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

export default function NavBar() {
  return (
    <AppBar position="static" sx={{ bgcolor: "#192841" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Pantry Tracker
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

