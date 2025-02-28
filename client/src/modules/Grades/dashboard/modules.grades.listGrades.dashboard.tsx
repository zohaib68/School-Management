"use client";
import { useFetch } from "@/library/hooks/useFetch/hooks.useFetch";
import { IGradeInfo } from "@/types/gradesModule/types.gradesModule";
import { TComponentProps } from "@/types/interfacesAndtypes/interafacesAndtypes";
import {
  Box,
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  Collapse,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import HailIcon from "@mui/icons-material/Hail";
import Person4RoundedIcon from "@mui/icons-material/Person4Rounded";
import React, { useEffect, useState } from "react";
import { useToggleState } from "@/library/hooks/useToggleState/hooks.useToggleState";
import { ExpandMoreOrLessButton } from "@/library/components/expandMorOrLessButton/componenets.expandMoreOrLessButton";
import { ListSections } from "../listSections/modules.grades.listSection";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { Modal } from "@/library/HOC/modal/HOC.modal";
import { AddSection } from "@/modules/Sections/addSection/modules.addSection";

export const GradesList = () => {
  const { fetchHandler } = useFetch();

  const [grades, setGrades] = useState<IGradeInfo[]>([]);

  const [{ inverseToggleHandler: inverseModalHandler }, isOpenedModal] =
    useToggleState();

  useEffect(() => {
    fetchHandler<IGradeInfo[], undefined>({ url: "/grades" }).then((response) =>
      setGrades(response.data?.data ?? [])
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Modal
        open={isOpenedModal}
        title="Add Section"
        onClose={inverseModalHandler}
      >
        <Box component={"div"}>
          <AddSection as="div" onSubmit={() => alert("hi")} />
        </Box>
      </Modal>
      <Grid container spacing={2} columns={12}>
        {grades.map((grade) => (
          <Grade
            as="div"
            key={grade._id}
            {...grade}
            onClickAddSectionIcon={inverseModalHandler}
          />
        ))}
      </Grid>
    </>
  );
};

type ITGradeProps = TComponentProps<"div"> &
  IGradeInfo & {
    onClickAddSectionIcon: () => void;
  };

const Grade = ({
  _id,
  name,
  grade,
  activeTeachersCount,
  activeStudentsCount,
  onClickAddSectionIcon,
}: ITGradeProps) => {
  const [{ inverseToggleHandler: inverseCollpaseHandler }, isCollapsed] =
    useToggleState();

  const theme = useTheme();

  const gridSize = {
    xs: 12,
    sm: isCollapsed ? 12 : 6,
    md: isCollapsed ? 12 : 4,
    lg: isCollapsed ? 12 : 2,
    xl: isCollapsed ? 12 : 2,
  };

  return (
    <Grid
      component={Paper}
      size={gridSize}
      key={_id}
      sx={{ position: "relative", transition: "width .5s ease" }}
    >
      {" "}
      <ExpandMoreOrLessButton
        position="bottomCenter"
        isCollapsed={isCollapsed}
        onClick={inverseCollpaseHandler}
        sx={{
          width: 15,
          height: 15,
          bottom: -8,
        }}
        iconStyles={{
          fontSize: 10,
        }}
      />
      <Stack
        direction={"column"}
        sx={{ border: `1px solid ${theme.palette.grey[100]}` }}
      >
        <Card
          sx={{
            background: theme.palette.grey[50],
            flexGrow: isCollapsed ? 0 : 1,
          }}
        >
          {" "}
          <CardHeader title={name} subheader={grade} />
          <CardMedia
            component="img"
            height="150"
            image="https://c4.wallpaperflare.com/wallpaper/297/22/531/lake-blue-moonlight-moon-wallpaper-preview.jpg"
            alt="Paella dish"
            width={"100%"}
          />
          <CardActions
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Stack direction={"row"}>
              <Stack direction={"row"}>
                <HailIcon
                  sx={{
                    fontSize: 20,
                    color: theme.palette.primary.main,
                  }}
                  color="primary"
                />
                <Box sx={{ fontSize: 15, color: theme.palette.primary.main }}>
                  {activeTeachersCount}
                </Box>
              </Stack>
              <Stack direction={"row"}>
                <Person4RoundedIcon
                  sx={{
                    fontSize: 20,
                  }}
                  color="primary"
                />
                <Box sx={{ fontSize: 15, color: theme.palette.primary.main }}>
                  {activeStudentsCount}
                </Box>
              </Stack>
            </Stack>

            <Stack gap={0.5} direction={"row"}>
              <Tooltip title="Add Section" placement="top" arrow>
                <IconButton onClick={onClickAddSectionIcon} size="small">
                  <ControlPointIcon sx={{ fontSize: 15 }} color="primary" />
                </IconButton>
              </Tooltip>
            </Stack>
          </CardActions>
        </Card>
        <Collapse
          style={{ transitionDelay: "1s" }}
          orientation="vertical"
          mountOnEnter
          unmountOnExit
          in={isCollapsed}
        >
          <ListSections as="div" gradeId={_id} />
        </Collapse>
      </Stack>
    </Grid>
  );
};
