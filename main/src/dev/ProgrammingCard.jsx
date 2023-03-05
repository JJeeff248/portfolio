import React from "react";
import { Paper, Slider, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { isMobile } from "react-device-detect";

const ConfidenceSlider = styled(Slider)(({ theme }) => ({
    color: theme.palette.secondary.main,
    height: 8,
    "& .MuiSlider-thumb": {
        height: isMobile ? 15 : 20,
        width: isMobile ? 15 : 20,
        backgroundColor: theme.palette.secondary.light,
        "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
            boxShadow: "inherit",
        },
    },
    "& .MuiSlider-track": {
        opacity: 1,
        backgroundColor: theme.palette.secondary.main,
        border: "none"
    },
}));

const ProgrammingCard = (props) => {
    const { title, level } = props;

    return (
        <Paper
            elevation={3}
            sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                width: isMobile ? "47%" : 250,
                p: 2,
            }}
        >
            <Typography variant="h5" textAlign="left" mb={1}>
                {title}
            </Typography>
            <ConfidenceSlider value={level} min={0} max={100} step={1} disabled />
        </Paper>
    );
};

export default ProgrammingCard;
