import { createTheme, type ThemeOptions } from "@mui/material/styles";

const commonThemeOptions: ThemeOptions = {
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h6: {
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    borderRadius: "0.5rem",
                    fontWeight: 500,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                },
            },
        },
    },
};

export const lightTheme = createTheme({
    ...commonThemeOptions,
    palette: {
        mode: "light",
        primary: {
            main: "#375853",
            light: "#5a7a75",
            dark: "#263c38",
        },
        secondary: {
            main: "#9991ba",
            light: "#b2abd0",
            dark: "#7c7599",
        },
        background: {
            default: "#f9fbfb",
            paper: "#ffffff",
        },
        text: {
            primary: "#0c1211",
            secondary: "#375853",
        },
    },
});

export const darkTheme = createTheme({
    ...commonThemeOptions,
    palette: {
        mode: "dark",
        primary: {
            main: "#a7c8c3",
            light: "#c5dbd8",
            dark: "#89a5a1",
        },
        secondary: {
            main: "#4d456e",
            light: "#6a638b",
            dark: "#363053",
        },
        background: {
            default: "#040606",
            paper: "#0c1211",
        },
        text: {
            primary: "#edf3f2",
            secondary: "#c5d1d0",
        },
    },
});
