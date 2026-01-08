import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
  Divider,
  Chip,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import BackendService from "../../service/BackendService";

function StudentManagement({ sortItem, sortOrder }) {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [learners, setLearners] = useState([]);

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedRowId(null);
  };

  const tableHeaders = [
    { id: "name", label: "Name" },
    { id: "courses", label: "Email" },
    { id: "status", label: "Status" },
  ];

  const getAllLearners = () => {
    setLoading(true);
    BackendService.fetchAllLearners()
      .then((res) => {
        setLoading(false);

        setLearners(res?.data);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllLearners();
  }, []);

  return (
    <Box>
      <Backdrop open={loading}>
        <CircularProgress color="#3B9261" />
      </Backdrop>
      <Box className="headerContainer">
        <Typography className="header" gutterBottom>
          Learner's Management
        </Typography>
        <Typography>Manage and track your learner's progress</Typography>
      </Box>
      {/* Search Field */}

      <Box className={"appTableContainer"}>
        <TableContainer component={Paper}>
          <Table className={"tableContainer"}>
            <TableHead>
              <TableRow className={"appTableRow"}>
                {tableHeaders?.map((column, index) => (
                  <TableCell
                    component="th"
                    role="columnheader"
                    scope="col"
                    aria-label={column?.label}
                    key={column?.label}
                    className={"tableCell"}
                    sx={{
                      paddingLeft:
                        index === 0 ? "16px !important" : "8px !important",
                    }}
                  >
                    <div className={"tableCellDivider"}>
                      {/* Hide divider from screen reader */}
                      {index !== 0 && (
                        <Divider
                          orientation="vertical"
                          sx={{ height: "30px", marginRight: "12px" }}
                          aria-hidden="true"
                        />
                      )}

                      {/* Hide sort icon group from screen reader */}
                      <span aria-hidden="true">
                        {column?.label}
                        {column?.sort && (
                          <IconButton
                            style={{ outline: "none" }}
                            aria-label={`sort ${column?.label} `}
                            size="small"
                            // onClick={() => {
                            //   dispatch(
                            //     requestsSliceActions?.handleSortAction({
                            //       sortOrder: sortOrder === "asc" ? "desc" : "asc",
                            //       sortItem: column.sortLabel,
                            //     })
                            //   );
                            // }}
                          >
                            {sortItem === column?.sortLabel ? (
                              sortOrder === "desc" ? (
                                <KeyboardArrowDownIcon
                                // fontSize={isSmallScreen ? "small" : "medium"}
                                />
                              ) : (
                                <KeyboardArrowUpIcon
                                // fontSize={isSmallScreen ? "small" : "medium"}
                                />
                              )
                            ) : (
                              <UnfoldMoreIcon
                              // fontSize={isSmallScreen ? "small" : "medium"}
                              />
                            )}
                          </IconButton>
                        )}
                      </span>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {learners?.length > 0 ? (
                learners?.map((student) => (
                  <TableRow
                    sx={{
                      border: 0,
                      "&:hover": { backgroundColor: "#f3f3f3" },
                    }}
                    key={student.id}
                  >
                    {/* Name Cell */}
                    <TableCell className="tableCell">
                      <Typography className="tableText">
                        {`${student?.firstName} ${student?.lastName}`}
                      </Typography>
                    </TableCell>

                    {/* Email Cell */}
                    <TableCell className="tableCell">
                      <Typography className="tableText">
                        {student?.email}
                      </Typography>
                    </TableCell>

                    {/* Status Cell */}
                    <TableCell className="tableCell">
                      <Chip
                        label={"active"}
                        size="small"
                        sx={{
                          bgcolor: "#1b5e20",
                          color: "#fff",
                          fontWeight: "bold",
                          textTransform: "capitalize",
                          marginLeft: "12px",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography variant="body1" color="text.secondary">
                      🚫 No learners found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
        <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
      </Menu>
    </Box>
  );
}

export default StudentManagement;
