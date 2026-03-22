import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { NavLink } from "react-router-dom";

export const ThemeToggleButton = styled(IconButton)(({ theme }) => ({
    position: "fixed",
    top: theme.spacing(2),
    right: theme.spacing(2),
    backgroundColor:
        theme.palette.mode === "light"
            ? theme.palette.primary.main
            : theme.palette.background.paper,
    color:
        theme.palette.mode === "light"
            ? theme.palette.common.white
            : theme.palette.text.primary,
    boxShadow:
        theme.palette.mode === "light"
            ? "0 2px 8px rgba(0, 0, 0, 0.2)"
            : "none",
    "&:hover": {
        backgroundColor:
            theme.palette.mode === "dark"
                ? theme.palette.grey[800]
                : theme.palette.primary.dark,
    },
}));

export const StyledNavLink = styled(NavLink)(({ theme }) => ({
    color:
        theme.palette.mode === "light"
            ? theme.palette.primary.dark
            : theme.palette.text.primary,
    textDecoration: "none",
    padding: theme.spacing(1.5),
    fontWeight: 500,
    borderRadius: theme.spacing(1),
    transition: "background-color 0.2s",
    "&:hover": {
        backgroundColor:
            theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.04)",
    },
    "&.active": {
        color:
            theme.palette.mode === "light"
                ? theme.palette.primary.dark
                : theme.palette.primary.main,
        fontWeight: 600,
        backgroundColor:
            theme.palette.mode === "dark"
                ? "rgba(167, 200, 195, 0.15)"
                : "rgba(55, 88, 83, 0.1)",
    },
}));
