import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import { useLocation } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import appLogo from "../assets/img/BreezewareLogoSvg.svg";
import SchoolIcon from "@mui/icons-material/School";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
// dummy icons for example
import { Home, AttachMoney, Email, Logout } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { cognitoSliceActions } from "../auth/CognitiSlice";
import { Divider, useMediaQuery } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate } from "react-router-dom";
import LearnerLogo from "../assets/img/Leaner.png";
import adminLogo from "../assets/img/Admin.png";


const settings = ["Profile", "Account", "Dashboard", "Logout"];

function NavBar({ isAdmin }) {
    const isMobile = useMediaQuery("(max-width:450px)"); // breakpoint for responsive layout
  
  const navigate = useNavigate();
  const pages = [
    {
      label: "My Courses",
      path: "/",
      icon: <AttachMoney />,
    },
    {
      label: "All Courses",
      path: "/all-courses",
      icon: <span className="material-symbols-outlined">query_stats</span>,
    },

    {
      label: "Author",
      path: "/my-courses",
      icon: <span className="material-symbols-outlined">query_stats</span>,
    },
    {
      label: "Learners",
      path: "/learners",
      icon: <span className="material-symbols-outlined">query_stats</span>,
    },
  ];
  const adminRoutes = [
    {
      label: "My Courses",
      path: "/my-courses",
      icon: <SchoolIcon />,
    },
    {
      label: "Learners",
      path: "/learners",
      icon: <PeopleIcon />,
    },
  ];
  const studentRoutes = [
    {
      label: "My Courses",
      path: "/my-courses",
      icon: <LibraryBooksIcon />,
    },
    {
      label: "All Courses",
      path: "/all-courses",
      icon: <span className="material-symbols-outlined">query_stats</span>,
    },
  ];
  const dispatch = useDispatch();
  const location = useLocation();
  const authDetails = useSelector((state) => state?.cognito?.user);

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [selectedPage, setSelectedPage] = React.useState(pages[0].label); // ✅ first page default

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleLogout = () => {
    dispatch(cognitoSliceActions.userLogout());
  };
  React.useEffect(() => {
    if (isAdmin) {
      if (location.pathname.includes("my-courses")) {
        setSelectedPage("My Courses");
      } else if (location.pathname.includes("learners")) {
        setSelectedPage("Learners");
      } else if (location.pathname === "/") {
        setSelectedPage("My Courses");
      }
    } else {
      if (location.pathname.includes("my-courses")) {
        setSelectedPage("My Courses");
      } else if (location.pathname.includes("all-courses")) {
        setSelectedPage("All Courses");
      } else if (location.pathname === "/") {
        setSelectedPage("My Courses");
      }
    }
  }, [location, isAdmin]);

  return (
    <AppBar style={{ backgroundColor: "white" }} position="fixed">
      <Box style={{ marginLeft: "24px", marginRight: "24px" }}>
        <Toolbar
          disableGutters
          style={{
            display: "flex",
            alignItems: "center",
            height: "64px",
            minHeight: 64, // Increase Toolbar height
          }}
        >
          {/* Mobile Menu */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              alignItems: "center",
            }}
          >
            <IconButton
              size="large"
              aria-label="menu"
              onClick={handleOpenNavMenu}
              sx={{ color: `${isAdmin ? '#3B9261' : '#1b3764'}` }}
            >
              <MenuIcon />
            </IconButton>

            {/* Mobile Logo (center aligned) */}
            <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
              
              {isAdmin ? <></> : <>
                <img
                  src={appLogo}
                  alt="Logo"
                  style={{
                    height: "27px",
                    width: "auto",
                    objectFit: "contain",
                    marginTop: "4px",
                    marginRight: "12px",
                  }}
                />

                {/* Vertical Divider */}
                <div
                  style={{
                    width: "1px",
                    height: "24px",
                    backgroundColor: "#ccc", // gray divider
                    margin: "4px 12px 0 0",
                  }}
                />
              </>}
         

              <img
                src={isAdmin?adminLogo: LearnerLogo}
                alt="learner-Logo"
                style={{
                  height: "27px",
                  width: "auto",
                  objectFit: "contain",
                  marginTop: "4px",
                  marginRight: "24px",
                }}
              />
            </Box>

            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {(isAdmin ? adminRoutes : studentRoutes)?.map((page) => (
                <MenuItem
                  key={page.label}
                  onClick={() => {
                    setSelectedPage(page.label);
                    handleCloseNavMenu();
                    navigate(page?.path);
                  }}
                >
                  <Typography
                    sx={{
                      color: selectedPage === page.label ? "#fff" : `${isAdmin ? '#3B9261' : '#1b3764'}`,
                      backgroundColor:
                        selectedPage === page.label ? `${isAdmin ? '#3B9261' : '#1b3764'}` : "transparent",
                      borderRadius: "6px",
                      padding: "6px 12px",
                    }}
                  >
                    {page.label}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Desktop Menu */}
          <Box
            sx={{
              // flexGrow: 1,
              display: { xs: "none", md: "flex ", alignItems: "center" },
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* Desktop Logo (center aligned) */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                height: "100%", // important
              }}
            >

              {isAdmin ? <></> : <>
                       <img
                src={appLogo}
                alt="Logo"
                style={{
                  height: "27px",
                  width: "auto",
                  objectFit: "contain",
                  marginTop: "4px",
                  marginRight: "12px",
                }}
              />

              {/* Vertical Divider */}
              <div
                style={{
                  width: "1px",
                  height: "24px",
                  backgroundColor: "#ccc", // gray divider
                  margin: "4px 12px 0 0",
                }}
              />

              </>}
     
              <img
                src={isAdmin?adminLogo: LearnerLogo}
                alt="learner-Logo"
                style={{
                  height: "27px",
                  width: "auto",
                  objectFit: "contain",
                  marginTop: "4px",
                  marginRight: "24px",
                }}
              />
            </Box>

            {(isAdmin ? adminRoutes : studentRoutes)?.map((page) => (
              <Button
                component={Link}
                to={page.path}
                key={page.label}
                onClick={() => setSelectedPage(page.label)}
                style={{
                  marginRight: "12px",
                  textDecoration: "none",
                  border: "none",
                  my: 2,
                  textTransform: "none",
                  borderRadius: "6px",
                  mx: 1,
                  fontWeight:'600',
                  backgroundColor:
                    selectedPage === page.label ? `${isAdmin ? '#3B9261' : '#1b3764'}` : "transparent",
                  color: selectedPage === page.label ? "#fff" : `${isAdmin ? '#3B9261' : '#1b3764'}`,
                  "&:hover": {
                    backgroundColor:
                      selectedPage === page.label ? `${isAdmin ? '#3B9261' : '#1b3764'}` : "#e6ebf3",
                  },
                }}
              >
                {/* {page?.icon} */}
                <Typography style={{ fontWeight: "500" }}>
                  {" "}
                  {page.label}
                </Typography>
              </Button>
            ))}
          </Box>

          {/* User Avatar Menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Box
              tabIndex={0}
              onClick={handleOpenUserMenu}
              display="flex"
              flexDirection="row"
              gap="12px"
              alignItems="center"
              sx={{
                backgroundColor: isAdmin ? '#E8F5E9' : '#F1F7FF',
                padding: "8px 12px",
                borderRadius: "12px",
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                "&:hover": {
                  backgroundColor: isAdmin ? '#DFF4EA' : '#e0edff',
                },
              }}
            >
              {
                !isMobile&&
                <Typography
                aria-label={`Logged in as ${authDetails?.given_name}`}
                sx={{ color: isAdmin ? '#3B9261' : '#1B3764', fontWeight: 500, fontSize: "0.9rem" }}
              >
                {authDetails?.given_name}
              </Typography>
              }
          
              <Avatar
                aria-hidden="true"
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: isAdmin ? '#3B9261' : '#1B3764',
                  fontSize: "0.875rem",
                }}
              >
                {authDetails?.given_name?.charAt(0)?.toUpperCase()}
              </Avatar>
              {
                
                  !isMobile&&
              
              <span
                aria-hidden="true"
                style={{ color: isAdmin ? '#3B9261' : '#1B3764', fontSize: "20px" }}
                className="material-symbols-outlined"
              >
                arrow_drop_down
              </span>
}
            </Box>

            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              PaperProps={{
                sx: {
                  mt: 1,
                  borderRadius: 2,
                  minWidth: 200,
                  boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
                },
              }}
            >
              <MenuItem
                onClose={handleCloseUserMenu}
                sx={{ display: "flex", gap: 1 }}
              >
                <Email fontSize="small" sx={{ color: isAdmin ? '#3B9261' : '#1B3764' }} />
                {authDetails?.email}
              </MenuItem>
              <Divider />
              <MenuItem
                aria-label="Log out of your provider account"
                onClick={handleLogout}
                sx={{ gap: 1, color: "#d32f2f" }}
              >
                <Logout fontSize="small" /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  );
}

export default NavBar;
