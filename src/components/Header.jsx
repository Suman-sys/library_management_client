import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";

import {
  Menu,
  MenuItem,
} from "@mui/material";

export default function Header() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const role = localStorage.getItem("role");

  const [logOutAnchorEl, setLogOutAnchorEl] = useState(null);

  const openLogout = Boolean(logOutAnchorEl);

  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ bgcolor: "#000" }}>
        <Toolbar>
          <IconButton
            onClick={() => navigate("/")}
            disableRipple
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ ml: 2 }}
          >
            <Box
              component="img"
              sx={{
                height: 20,
              }}
              alt="Park Me"
              src="https://see.fontimg.com/api/renderfont4/rgqzA/eyJyIjoiZnMiLCJoIjo1NiwidyI6MTUwMCwiZnMiOjM3LCJmZ2MiOiIjQ0U0MTM1IiwiYmdjIjoiI0YyRTZFNiIsInQiOjF9/TGlicmFyeU1hbmFnZW1lbnRTeXN0ZW0/dinasty-personal-use-bold.png"
            />
          </IconButton>
          <Box sx={{flexGrow: 1}}></Box>

          <Box sx={{ flexGrow: 0, marginTop: -5, float: "right" }}>
            {loggedInUser ? (
              <Box
                onClick={(event) => setLogOutAnchorEl(event.currentTarget)}
                title="Profile"
                sx={{
                  background: "red",
                  paddingRight: 1,
                  paddingLeft: 1,
                  borderRadius: 3,
                  marginLeft: 4,
                  cursor: "pointer"
                }}
              >
                {" "}
                <Typography
                  variant="h6"
                  sx={{ color: "ThreeDFace", marginTop: 5 }}
                >
                  {" "}
                  {loggedInUser}
                </Typography>
              </Box>
            ) : (
              <Button
                onClick={() => navigate("/login-register")}
                sx={{ color: "blue", marginTop: 5 }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        id="basic-menu"
        anchorEl={logOutAnchorEl}
        open={openLogout}
        onClose={() => setLogOutAnchorEl(null)}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {role==="USER" && <MenuItem
          onClick={() => {
            navigate("/transaction-history");
          }}
        >
          My Transactions
        </MenuItem>}
        <MenuItem
          onClick={() => {
            localStorage.clear();
            setLogOutAnchorEl(null);
            navigate("/login-register");
          }}
        >
          Log Out
        </MenuItem>

      </Menu>
    </Box>
  );
}
