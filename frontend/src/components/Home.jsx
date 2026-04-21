import { Box, Button, Container, Typography } from "@mui/material";
import RealEstateAgentRoundedIcon from "@mui/icons-material/RealEstateAgentRounded";
import RequestQuoteRoundedIcon from "@mui/icons-material/RequestQuoteRounded";
const Home = () => {
  return (
    <Container
      sx={{
        backgroundImage:
          "radial-gradient(at 85% 78%, hsla(143, 70%, 82%, 0.45) 0px, transparent 30%),radial-gradient(at 10% 34%, hsla(133, 59%, 82%, 0.50) 0px, transparent 30%)",
      }}
    >
      {" "}
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 8,
          px: 0,
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "2fr 3fr",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              gap: 2,
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                gap: 0.25,
              }}
            >
              {" "}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-end",
                  justifyContent: "flex-start",
                  gap: 2,
                }}
              >
                {" "}
                <Typography
                  variant="h2"
                  component="span"
                  sx={{
                    fontSize: { xs: "30px", md: "4rem" },
                    color: "transparent",
                    textAlign: "left",
                    lineHeight: 1.2,
                    fontWeight: 800,
                    WebkitTextStroke: "1.5px #297d18",

                    WebkitBackgroundClip: "text",
                  }}
                >
                  Welcome
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "30px", md: "3rem" },
                    color: " #297d18",
                    lineHeight: 1.5,
                  }}
                >
                  to{" "}
                </Typography>
              </Box>
              <Typography
                variant="h2"
                component={"span"}
                sx={{
                  fontSize: { xs: "30px", md: "6rem" },
                  background:
                    "linear-gradient(90deg, #297d18ff 0%, #15d655ff 100%);",
                  backgroundClip: "text",
                  color: "transparent",
                  textAlign: "left",
                  lineHeight: 1,
                  fontWeight: 800,
                }}
              >
                ValuerBot{" "}
              </Typography>
            </Box>

            <Typography>
              The official platform for accurate property valuations and tax
              assessments. Access reliable data to calculate property taxes with
              confidence and transparency.{" "}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                height: "100%",
                width: "100%",
                borderRadius: "20px",
                boxShadow: 20,
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                "&:hover .inner-img": {
                  transform: "scale(1.1)",
                  transition: "transform 0.8s ease-in-out",
                },
              }}
            >
              <Box
                className="inner-img"
                component={"img"}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              />
              <Button
                href="/valuation"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: "60%",
                  height: "20%",
                  bgcolor: "#fff",
                  zIndex: 4,
                  borderTopLeftRadius: "100px",
                  boxShadow: "-2px -2px 12px #0000007c",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  pl: 4,
                }}
              >
                <RealEstateAgentRoundedIcon
                  sx={{ fontSize: "4rem", color: "#297d18ff" }}
                />
                <Typography
                  sx={{
                    textAlign: "left",
                    textWrap: "wrap",
                    lineHeight: 1.2,
                    fontSize: "1.4rem",
                    color: "#297d18ff",
                  }}
                >
                  Property Valuation
                </Typography>
              </Button>
            </Box>

            <Box
              sx={{
                display: "flex",
                height: "100%",
                width: "100%",
                borderRadius: "20px",
                boxShadow: 20,
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                "&:hover .inner-img": {
                  transform: "scale(1.1)",
                  transition: "transform 0.8s ease-in-out",
                },
              }}
            >
              <Box
                className="inner-img"
                component={"img"}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
                src="https://images.unsplash.com/photo-1709880945165-d2208c6ad2ec?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              />
              <Button
                href="/tax-point"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: "60%",
                  height: "20%",
                  bgcolor: "#fff",
                  zIndex: 4,
                  borderTopLeftRadius: "100px",
                  boxShadow: "-2px -2px 12px #0000007c",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  pl: 4,
                }}
              >
                <RequestQuoteRoundedIcon
                  sx={{ fontSize: "4rem", color: "#297d18ff" }}
                />
                <Typography
                  sx={{
                    textAlign: "left",
                    textWrap: "wrap",
                    lineHeight: 1.2,
                    fontSize: "1.4rem",
                    color: "#297d18ff",
                  }}
                >
                  Tax Point
                </Typography>
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
