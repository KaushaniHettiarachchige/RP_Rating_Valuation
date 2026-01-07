import { Box, Link } from "@mui/material";

const Header = () => {
  return (
    <Box
      sx={{
        width: "100vw",
        py: 1.5,
        background: "#fff",
        position: "sticky",
        boxShadow: "2px 0px 15px #0005",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        top: 0,
        zIndex: 200,
      }}
    >
      <Box component={"a"} href="/">
        {" "}
        <Box
          component={"img"}
          src="../../public/Images/valuerBot-logo.png"
          width={250}
        />
      </Box>

      <Box
        sx={{
          width: "100vw",

          height: "5px",
          background:
            "linear-gradient(90deg,rgba(42, 155, 61, 1) 0%, rgba(87, 199, 133, 1) 50%, rgba(83, 237, 114, 1) 100%)",
          position: "absolute",
          bottom: 0,
        }}
      ></Box>
    </Box>
  );
};

export default Header;
