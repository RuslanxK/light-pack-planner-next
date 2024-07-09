"use client";

import {
  Stack,
  Typography,
  IconButton,
  Box,
  TextField,
  Button,
  Container,
  Tooltip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Switch,
  Link,
  Alert,
  Grid,
} from "@mui/material";
import Category from "../components/Category";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, Fragment } from "react";
import { useTheme } from "@emotion/react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import MuiPopup from "./custom/MuiPopup";
import CloseIcon from "@mui/icons-material/Close";
import NordicWalkingIcon from "@mui/icons-material/NordicWalking";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import SideItem from "../components/SideItem";
import FlipCameraIosOutlinedIcon from "@mui/icons-material/FlipCameraIosOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import FileCopyIcon from "@mui/icons-material/FileCopy";

import {
  DndContext,
  closestCorners,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ShareIcon from "@mui/icons-material/Share";
import BackpackOutlinedIcon from "@mui/icons-material/BackpackOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import useRefresh from "./hooks/useRefresh";

const InnerBag = ({
  bagData,
  items,
  session,
  itemsTotal,
  categoryPieChartData,
  categoryWeightsArr,
}) => {
  const router = useRouter();
  const theme = useTheme();

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [editedBag, setEditedBag] = useState({
    tripId: bagData?.bag?.tripId,
    name: bagData?.bag?.name,
    goal: bagData?.bag?.goal,
    description: bagData?.bag?.description,
  });
  const [showSideBarMobile, setShowSideBarMobile] = useState(false);
  const [showSideBarDesktop, setShowSideBarDesktop] = useState(true);
  const [categoriesData, setCategoriesData] = useState(bagData?.categories);
  const [confirmPopupOpen, setConfirmPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popupLoading, setPopupLoading] = useState(false);
  const [showSwitchMessage, setShowSwitchMessage] = useState(false);
  const [shareLinkOpen, setShareLinkOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [copied, setCopied] = useState("");
  const [switchChecked, setSwitchChecked] = useState(
    bagData?.bag?.exploreBags || false
  );

  const { refresh } = useRefresh();

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(`${currentUrl}/share?id=${bagData.bag._id}`)
      .then(() => {
        setCopied("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  useEffect(() => {
    setCurrentUrl(window.location.origin);
  }, []);

  useEffect(() => {
    if (bagData?.totalBagWeight === 0 && switchChecked) {
      const switchOff = async () => {
        try {
          await axios.put(`/bags/${bagData.bag._id}/${session?.user.id}`, {
            exploreBags: false,
          });
          setSwitchChecked(false);
          await refresh();
        } catch (error) {
          console.log(error);
        }
      };
      switchOff();
    }
  }, [
    bagData?.totalBagWeight,
    switchChecked,
    bagData?.bag?._id,
    session?.user.id,
    refresh,
  ]);

  useEffect(() => {
    setCategoriesData(bagData.categories || []);
  }, [bagData.categories]);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedBag((prev) => ({ ...prev, [name]: value }));
  };

  const allBagsItems = items.map((item) => (
    <SideItem
      key={item._id}
      itemData={item}
      color="white"
      categoryData={bagData?.categories}
      update={refresh}
    />
  ));

  const TOTAL =
    categoryWeightsArr?.categoriesTotalWeight?.reduce(
      (a, b) => a + b.totalWeight,
      0
    ) || 1;

  const getArcLabel = (params) => {
    const percent = params.value / TOTAL;
    return `${(percent * 100).toFixed(1)}%`;
  };

  const categoryTableData = categoryPieChartData.map((category) => ({
    id: category.id,
    value: category.value,
    label: category.label,
    color: category.color,
  }));

  function getRandomDarkColor() {
    let color;
    const existingColors = categoriesData.map((category) => category.color);

    do {
      color = "#";
      for (let i = 0; i < 3; i++) {
        const part = Math.floor(Math.random() * 256 * 0.6);
        color += ("0" + part.toString(16)).slice(-2);
      }
    } while (existingColors.includes(color));

    return color;
  }

  const addCategory = async () => {
    const newCategory = {
      userId: session?.user?.id,
      bagId: bagData?.bag?._id,
      tripId: bagData?.bag?.tripId,
      name: "new category",
      color: getRandomDarkColor(),
    };
    setLoading(true);
    try {
      await axios.post("/categories/new", newCategory);
      await refresh();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchChange = (e) => {
    if (bagData?.totalBagWeight === 0) {
      setShowSwitchMessage(true);
      return;
    }

    if (e.target.checked) {
      setConfirmPopupOpen(true);
      setShowSwitchMessage(false);
    } else {
      const switchOff = async () => {
        try {
          setLoading(true);
          await axios.put(`/bags/${bagData.bag._id}/${session?.user.id}`, {
            exploreBags: false,
          });
          setSwitchChecked(false);
          await refresh();
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
      switchOff();
    }
  };

  const confirmSwitchChange = async () => {
    try {
      setPopupLoading(true);
      await axios.put(`/bags/${bagData.bag._id}/${session?.user.id}`, {
        exploreBags: true,
      });
      setSwitchChecked(true);
      await refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setPopupLoading(false);
      setConfirmPopupOpen(false);
    }
  };

  const openPopup = () => setPopupOpen(true);

  const closePopup = () => {
    setPopupOpen(false);
    setDeletePopupOpen(false);
    setConfirmPopupOpen(false);
    setPopupLoading(false);
    setShareLinkOpen(false);
  };

  const openRemovePopup = () => setDeletePopupOpen(true);

  const updateBag = async (e) => {
    e.preventDefault();
    try {
      setPopupLoading(true);
      await axios.put(
        `/bags/${bagData.bag._id}/${session?.user?.id}`,
        editedBag
      );
      await refresh();
      closePopup();
    } catch (error) {
      console.log(error);
    } finally {
      setPopupLoading(false);
    }
  };

  const removeBag = async () => {
    try {
      setPopupLoading(true);
      await axios.delete(`/bags/${bagData.bag._id}/${session?.user?.id}`);
      router.push(`/trips?id=${bagData.bag.tripId}`);
      await refresh();
      closePopup();
    } catch (error) {
      console.log(error);
    } finally {
      setPopupLoading(false);
    }
  };

  const showHideSideBar = () => {
    setShowSideBarMobile((prev) => !prev);
  };

  const moveCategory = async (fromIndex, toIndex) => {
    try {
      const updatedCategories = [...categoriesData];
      const [movedCategory] = updatedCategories.splice(fromIndex, 1);
      updatedCategories.splice(toIndex, 0, movedCategory);

      const reorderedCategories = updatedCategories.map((category, index) => ({
        ...category,
        order: index + 1,
      }));

      setCategoriesData(reorderedCategories);
      await saveCategoriesOrder(reorderedCategories);
    } catch (error) {
      console.error("Failed to move category:", error);
    }
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const fromIndex = categoriesData.findIndex(
        (category) => category.order === active.id
      );
      const toIndex = categoriesData.findIndex(
        (category) => category.order === over.id
      );
      moveCategory(fromIndex, toIndex);
    }
  };

  const saveCategoriesOrder = async (categories) => {
    const orderData = categories.map((category) => ({
      _id: category._id,
      order: category.order,
    }));

    try {
      await axios.put(`/categories/${bagData.bag._id}/order`, orderData);
    } catch (error) {
      console.error("Failed to save categories order:", error);
    }
  };

  return (
    <Fragment>
      {loading ? (
        <div
          className="loading-overlay"
          style={{
            background:
              theme.palette.mode === "dark"
                ? "rgba(0, 0, 0, 0.5)"
                : "rgba(0, 0, 0, 0.15)",
          }}
        >
          {" "}
          {<CircularProgress color="success" />}
        </div>
      ) : null}

      <Container sx={{ display: "flex" }} maxWidth={false} disableGutters>
        {items?.length ? (
          <div className="side-bar-icon-mobile">
            <IconButton
              onClick={showHideSideBar}
              sx={{
                width: "25%",
                height: "40px",
                zIndex: "99",
                borderRadius: "0px",
                position: "fixed",
                bottom: "0px",
                left: "0px",
                backgroundColor: theme.palette.success.dark,
                color: "white",
                "&:hover": {
                  backgroundColor: theme.palette.success.main,
                },
                "&:active": {
                  backgroundColor: theme.palette.success.main,
                },
              }}
            >
              {showSideBarMobile ? (
                <CloseIcon />
              ) : (
                <FlipCameraIosOutlinedIcon sx={{ fontSize: "20px" }} />
              )}
            </IconButton>
          </div>
        ) : null}

        <div className="share-icon-mobile">
          {/* <Link
            href={`/share?id=${bagData.bag._id}`}
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
          > */}
          <IconButton
            onClick={() => setShareLinkOpen(true)}
            sx={{
              width: items?.length ? "25%" : "40%",
              height: "40px",
              zIndex: "99",
              borderRadius: "0px",
              position: "fixed",
              bottom: "0px",
              left: items?.length ? "25%" : "0%",
              backgroundColor: theme.palette.primary.dark,
              color: "white",
              "&:hover": {
                backgroundColor: theme.palette.primary.main,
              },
              "&:active": {
                backgroundColor: theme.palette.primary.light,
              },
            }}
          >
            <ShareIcon sx={{ fontSize: "20px" }} />
          </IconButton>
          {/* </Link> */}
        </div>

        <div className="switch-icon-mobile">
          <IconButton
            sx={{
              width: items?.length ? "60%" : "60%",
              height: "40px",
              zIndex: "99",
              borderRadius: "0px",
              position: "fixed",
              bottom: "0px",
              left: items?.length ? "50%" : "40%",
              backgroundColor: theme.palette.secondary.dark,
              color: "white",
              "&:hover": {
                backgroundColor: theme.palette.secondary.main,
              },
              "&:active": {
                backgroundColor: theme.palette.secondary.light,
              },
            }}
          >
            <Typography variant="span" component="span" fontSize="15px" mr={1}>
              Share to explore
            </Typography>
            <Switch
              onChange={handleSwitchChange}
              sx={{ transform: "scale(0.9)" }}
              checked={bagData.bag.exploreBags}
            />
          </IconButton>
        </div>

        <Box
          display="flex"
          flexDirection="row"
          width={theme.fullWidth}
          minHeight="100vh"
          height="100%"
        >
          <Stack
            display={theme.flexBox}
            justifyContent={theme.start}
            width={theme.fullWidth}
            pb={3}
          >
            <div className="main-info">
              <Stack
                display={theme.flexBox}
                width="100%"
                flexDirection={theme.row}
                alignItems={theme.between}
                justifyContent={theme.between}
                backgroundColor={
                  theme.palette.mode === "dark"
                    ? theme.main.darkColor
                    : "#f2f2f2"
                }
                pt={1.5}
                pb={1.5}
                mb={3}
                borderRadius="7px"
              >
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                >
                  <Grid item xs={8}>
                    <Stack direction="row" alignItems="center">
                      <IconButton
                        sx={{
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? theme.main.darkColor
                              : "#f2f0f0",
                          marginRight: "5px",
                        }}
                        onClick={() =>
                          router.push(`/trips?id=${bagData.bag.tripId}`)
                        }
                      >
                        <ArrowBackIcon sx={{ fontSize: "20px" }} />
                      </IconButton>
                      <Typography
                        component="h3"
                        variant="span"
                        fontWeight="600"
                        mr={1}
                      >
                        {bagData?.bag?.name}
                      </Typography>
                    </Stack>
                  </Grid>

                  <Grid item xs={4}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-end"
                    >
                      <div className="switch-icon-desktop">
                        <Tooltip
                          title={
                            bagData.bag.exploreBags
                              ? "Remove this bag from 'Explore'"
                              : "Share this bag to 'Explore'"
                          }
                        >
                          <Switch
                            onChange={handleSwitchChange}
                            checked={bagData.bag.exploreBags}
                          />
                        </Tooltip>

                        <Typography mr={5}>Share to explore</Typography>
                      </div>

                      <div className="share-icon-desktop">
                        <Link
                          href={`/share?id=${bagData.bag._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="none"
                        >
                          <Tooltip title="Share Link">
                            <IconButton>
                              <ShareIcon sx={{ fontSize: "20px" }} />
                            </IconButton>
                          </Tooltip>
                        </Link>
                      </div>
                      <Tooltip title="Edit">
                        <IconButton onClick={openPopup}>
                          <EditIcon
                            sx={{
                              fontSize: "20px",
                              cursor: "pointer",
                              "&:hover": { color: theme.orange },
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={openRemovePopup}>
                          <DeleteOutlineOutlinedIcon
                            sx={{
                              fontSize: "20px",
                              cursor: "pointer",
                              "&:hover": { color: "red" },
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>

              {showSwitchMessage ? (
                <Stack mb={2}>
                  <Alert severity="info">
                    You must add categories and items to publish the bag.
                  </Alert>
                </Stack>
              ) : null}

              <Typography component="p" variant="p">
                {bagData?.bag?.description}
              </Typography>

              {itemsTotal ? (
                <div className="pieChart-table">
                  <PieChart
                    margin={{ top: 0, left: 5, right: 0, bottom: 0 }}
                    series={[
                      {
                        data: categoryPieChartData,
                        faded: {
                          innerRadius: 30,
                          additionalRadius: -15,
                          color: "gray",
                        },
                        highlightScope: {
                          faded: "global",
                          highlighted: "item",
                        },
                        arcLabel: getArcLabel,
                        innerRadius: 35,
                        outerRadius: 120,
                        paddingAngle: 2,
                        cornerRadius: 2,
                        startAngle: -180,
                        endAngle: 180,
                        cx: 150,
                        cy: 150,
                        colorAccessor: (datum) => datum.color,
                      },
                    ]}
                    sx={{
                      [`& .${pieArcLabelClasses.root}`]: {
                        fill: "white",
                        fontSize: 14,
                        fontWeight: "300",
                      },
                      visibility: itemsTotal ? "visible" : "hidden",
                    }}
                    height={300}
                    slotProps={{ legend: { hidden: true } }}
                    tooltip={{ hidden: true }}
                  />

                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Category</TableCell>
                          <TableCell align="right">
                            Weight ({session.user.weightOption})
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {categoryTableData.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell component="th" scope="row">
                              <Stack direction="row" alignItems="center">
                                <Stack
                                  backgroundColor={row.color}
                                  width="15px"
                                  height="15px"
                                  mr={1}
                                  sx={{ borderRadius: "50%" }}
                                ></Stack>
                                {row.label}
                              </Stack>
                            </TableCell>
                            <TableCell align="right">
                              {row.value.toFixed(2)}{" "}
                              {session?.user?.weightOption}
                            </TableCell>
                          </TableRow>
                        ))}

                        <TableRow>
                          <TableCell component="th" scope="row">
                            <Stack direction="row" alignItems="center">
                              <BackpackOutlinedIcon
                                sx={{ fontSize: "18px", marginRight: "4px" }}
                              />{" "}
                              Total
                            </Stack>
                          </TableCell>

                          <TableCell component="th" scope="row" align="right">
                            {bagData?.totalBagWeight > bagData?.bag?.goal ? (
                              <Typography
                                variant="span"
                                component="span"
                                sx={{ fontWeight: "bold", color: "red" }}
                              >
                                {bagData?.totalBagWeight?.toFixed(2)} /{" "}
                                {bagData?.bag?.goal}{" "}
                                {session?.user?.weightOption}{" "}
                              </Typography>
                            ) : (
                              <Typography
                                variant="span"
                                component="span"
                                sx={{
                                  color:
                                    bagData?.totalBagWeight > 0.0
                                      ? theme.green
                                      : null,
                                }}
                              >
                                {" "}
                                {bagData?.totalBagWeight?.toFixed(2)} /{" "}
                                {bagData?.bag?.goal}{" "}
                                {session?.user?.weightOption}{" "}
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell component="th" scope="row">
                            <Stack direction="row" alignItems="center">
                              <NordicWalkingIcon
                                sx={{ fontSize: "18px", marginRight: "4px" }}
                              />{" "}
                              Worn
                            </Stack>
                          </TableCell>

                          <TableCell component="th" scope="row" align="right">
                            <Typography variant="span" component="span">
                              {" "}
                              {bagData?.worn
                                ? bagData?.worn?.toFixed(2) +
                                  "  " +
                                  session?.user?.weightOption
                                : "0.0 " + session?.user?.weightOption}
                            </Typography>
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell component="th" scope="row">
                            <Stack direction="row" alignItems="center">
                              <InventoryOutlinedIcon
                                sx={{ fontSize: "18px", marginRight: "4px" }}
                              />{" "}
                              Items
                            </Stack>
                          </TableCell>

                          <TableCell component="th" scope="row" align="right">
                            {itemsTotal}
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell component="th" scope="row">
                            <Stack direction="row" alignItems="center">
                              <FavoriteIcon
                                sx={{ fontSize: "18px", marginRight: "4px" }}
                              />{" "}
                              Likes
                            </Stack>
                          </TableCell>

                          <TableCell component="th" scope="row" align="right">
                            {bagData.bag.likes}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              ) : null}
            </div>

            <div className="categories">
              <Stack
                border="2px dashed gray"
                display={theme.flexBox}
                direction="row"
                justifyContent={theme.center}
                alignItems={theme.center}
                height={theme.category.height}
                backgroundColor={
                  theme.palette.mode === "dark" ? null : "#FAFAFA"
                }
                mb={2}
                sx={{ cursor: "pointer" }}
                onClick={addCategory}
              >
                <Tooltip title="Add category" placement="top">
                  <IconButton>
                    <AddOutlinedIcon sx={{ fontSize: "20px", color: "gray" }} />
                  </IconButton>
                </Tooltip>
              </Stack>

              {categoriesData.length ? null : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Get started with your first Category!
                </Alert>
              )}

              <DndContext
                collisionDetection={closestCorners}
                onDragEnd={onDragEnd}
                sensors={sensors}
                id="builder-dnd"
              >
                <SortableContext
                  items={categoriesData.map((category) => category.order)}
                  strategy={verticalListSortingStrategy}
                >
                  {categoriesData
                    .sort((a, b) => a.order - b.order)
                    .map((category, index) => (
                      <Category
                        key={category._id}
                        categoryData={category}
                        items={bagData?.items}
                        session={session}
                        loading={(value) => setLoading(value)}
                      />
                    ))}
                </SortableContext>
              </DndContext>
            </div>
          </Stack>

          {items?.length && bagData?.categories.length && showSideBarDesktop ? (
            <div className="recent-desktop">
              <Stack width={theme.nav.width} height={theme.nav.height}>
                <Stack
                  pt={1}
                  display={theme.flexBox}
                  alignItems={theme.left}
                  position={theme.nav.fixed}
                  height={theme.nav.height}
                  width={theme.nav.width}
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? theme.main.darkColor
                        : theme.green,
                  }}
                >
                  <Stack pb={1} alignItems="center">
                    <Tooltip title="Close sidebar">
                      <IconButton
                        sx={{
                          background: "white",
                          color: theme.green,
                          "&:hover": { background: "#e0e0e0" },
                        }}
                        onClick={() =>
                          setShowSideBarDesktop(!showSideBarDesktop)
                        }
                      >
                        <ArrowForwardOutlinedIcon sx={{ fontSize: "20px" }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <Typography
                    component="h3"
                    variant="span"
                    textAlign="center"
                    color="white"
                  >
                    Recent Items
                  </Typography>
                  <Typography
                    component="span"
                    variant="span"
                    textAlign="center"
                    mb={3}
                    color={theme.main.lightGray}
                  >
                    added to your plans
                  </Typography>
                  <Stack sx={{ overflowY: "scroll" }} height="80vh" pl={3}>
                    {allBagsItems}
                  </Stack>
                </Stack>
              </Stack>
            </div>
          ) : items?.length && bagData?.categories.length ? (
            <div className="recent-desktop">
              <Stack width={"36px"} height={theme.nav.height}>
                <Stack
                  pt={2}
                  position={theme.nav.fixed}
                  height={theme.nav.height}
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? theme.main.darkColor
                        : theme.green,
                  }}
                >
                  <Stack alignItems="center">
                    <Tooltip title="Open sidebar">
                      <IconButton
                        sx={{
                          background:
                            theme.palette.mode === "dark" ? "#404040" : "white",
                          color: theme.green,
                          "&:hover": { background: "#e0e0e0" },
                        }}
                        onClick={() =>
                          setShowSideBarDesktop(!showSideBarDesktop)
                        }
                      >
                        <ArrowBackOutlinedIcon sx={{ fontSize: "20px" }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Stack>
            </div>
          ) : null}

          {items?.length && showSideBarMobile ? (
            <div className="recent-mobile">
              <Stack width="185px" height={theme.nav.height}>
                <Stack
                  pt={2}
                  display={theme.flexBox}
                  alignItems={theme.left}
                  position={theme.nav.fixed}
                  height={theme.nav.height}
                  width="185px"
                  sx={{
                    backgroundColor: theme.green,
                    borderTopLeftRadius: "25px",
                  }}
                >
                  <Typography
                    component="h3"
                    variant="span"
                    textAlign="center"
                    color="white"
                  >
                    Recent Items
                  </Typography>
                  <Typography
                    component="span"
                    variant="span"
                    textAlign="center"
                    mb={3}
                    color={theme.main.lightGray}
                  >
                    added to your plans
                  </Typography>
                  <Stack sx={{ overflowY: "scroll" }} height="70vh" pl={3}>
                    {allBagsItems}
                  </Stack>
                </Stack>
              </Stack>
            </div>
          ) : null}

          <MuiPopup isOpen={isPopupOpen} onClose={closePopup}>
            <form onSubmit={updateBag}>
              <Grid container spacing={2}>
                <Grid item xs={11}>
                  <Typography variant="h6" component="h2" mb={0.5}>
                    Update Bag Details
                  </Typography>
                  <Typography variant="span" component="span" mb={3}>
                    Modify the fields below to update your bag information
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <CloseIcon onClick={closePopup} sx={{ cursor: "pointer" }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Bag name"
                    name="name"
                    required
                    onChange={handleChange}
                    sx={{ width: "100%" }}
                    value={editedBag.name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={`Weight goal (${session?.user?.weightOption})`}
                    type="number"
                    required
                    name="goal"
                    onChange={handleChange}
                    sx={{ width: "100%" }}
                    value={editedBag.goal}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    multiline
                    label="Description"
                    name="description"
                    onChange={handleChange}
                    sx={{ width: "100%" }}
                    value={editedBag.description}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    sx={{
                      color: theme.palette.mode === "dark" ? "white" : null,
                      width: "100%",
                      fontWeight: "500",
                      backgroundColor: theme.green,
                    }}
                    variant="contained"
                    disableElevation
                  >
                    Update{" "}
                    {popupLoading && (
                      <CircularProgress
                        color="inherit"
                        size={16}
                        sx={{ marginLeft: "10px" }}
                      />
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </MuiPopup>

          <MuiPopup isOpen={isDeletePopupOpen} onClose={closePopup}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              flexWrap="wrap"
            >
              <Stack
                direction="row"
                width="100%"
                alignItems="center"
                mb={1}
                justifyContent="space-between"
              >
                <Typography variant="h6" component="h2">
                  Delete Bag
                </Typography>
                <CloseIcon onClick={closePopup} sx={{ cursor: "pointer" }} />
              </Stack>
              <Typography variant="span" component="span">
                Are you sure you want to delete <b>{bagData.bag.name} ?</b> This
                action cannot be undone. Deleting this bag will permanently
                remove it from the system, and any associated data will be lost.
              </Typography>

              <Button
                sx={{
                  marginTop: "20px",
                  width: "100%",
                  fontWeight: "500",
                  color: theme.palette.mode === "dark" ? "white" : null,
                  backgroundColor: theme.red,
                  "&:hover": { backgroundColor: theme.redHover },
                }}
                variant="contained"
                onClick={removeBag}
                disableElevation
              >
                Delete{" "}
                {popupLoading ? (
                  <CircularProgress
                    color="inherit"
                    size={16}
                    sx={{ marginLeft: "10px" }}
                  />
                ) : null}
              </Button>
            </Stack>
          </MuiPopup>

          <MuiPopup isOpen={confirmPopupOpen} onClose={closePopup}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              flexWrap="wrap"
            >
              <Stack
                direction="row"
                width="100%"
                alignItems="center"
                mb={1}
                justifyContent="space-between"
              >
                <Typography variant="h6" component="h2">
                  Notice
                </Typography>
                <CloseIcon onClick={closePopup} sx={{ cursor: "pointer" }} />
              </Stack>
              <Typography variant="body1" component="span">
                You are about to publish{" "}
                <b style={{ color: theme.green }}>{bagData.bag.name}</b> to the
                "Explore Bags". Please note that confirming this action will
                make your bag details visible to everyone and allow them to
                react to it.
              </Typography>

              <Button
                sx={{
                  marginTop: "20px",
                  width: "100%",
                  fontWeight: "500",
                  color: theme.palette.mode === "dark" ? "white" : null,
                  backgroundColor: theme.green,
                }}
                variant="contained"
                onClick={confirmSwitchChange}
                disableElevation
              >
                Publish{" "}
                {popupLoading ? (
                  <CircularProgress
                    color="inherit"
                    size={16}
                    sx={{ marginLeft: "10px" }}
                  />
                ) : null}
              </Button>
            </Stack>
          </MuiPopup>

          <MuiPopup isOpen={shareLinkOpen} onClose={closePopup}>
            <Stack direction="column" alignItems="flex-start">
              <Stack
                direction="row"
                width="100%"
                alignItems="center"
                justifyContent="space-between"
                marginBottom={1}
              >
                <Typography variant="h6" component="h2">
                  Share Bag Link
                </Typography>
                <CloseIcon onClick={closePopup} sx={{ cursor: "pointer" }} />
              </Stack>
              <Typography variant="body1" component="span">
                Copy the following URL to share{" "}
                <b style={{ color: theme.green }}>{bagData.bag.name}</b> with
                others:
              </Typography>

              <Stack
                direction="column"
                alignItems="center"
                width="100%"
                marginTop={1}
              >
                <Stack direction="row" alignItems='center' width="100%">
                  <IconButton onClick={copyToClipboard} color="primary">
                    <FileCopyIcon />
                  </IconButton>

                  <TextField
                    value={`${currentUrl}/share?id=${bagData.bag._id}`}
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    sx={{ width: "100%", marginLeft: "5px" }}
                    inputProps={{ readOnly: true }}
                  />
                </Stack>

                {copied ? (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    {copied}
                  </Alert>
                ) : null}
              </Stack>

              <Typography
                variant="body1"
                component="span"
                sx={{ marginTop: "10px" }}
              >
                Share this URL with your friends or colleagues to let them view
                and react to the bag.
              </Typography>

              <Button
                sx={{
                  marginTop: "20px",
                  width: "100%",
                  fontWeight: "500",
                  color: theme.palette.mode === "dark" ? "white" : null,
                  backgroundColor: theme.green,
                }}
                variant="contained"
                onClick={closePopup}
                disableElevation
              >
                Close
              </Button>
            </Stack>
          </MuiPopup>
        </Box>
      </Container>
    </Fragment>
  );
};

export default InnerBag;
