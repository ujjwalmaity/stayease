import { memo, useState } from "react";
import { Box, Typography, IconButton, Chip, Skeleton } from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Link } from "react-router-dom";
import { color, shadow } from "../../theme/tokens";
import { fadeUp, popIn, duration, ease, anim, useReducedMotion } from "../../theme/animations";

// memo: prevents re-render when parent updates state unrelated to this card's props
const HotelCard = memo(function HotelCard({ hotel, searchDates, index = 0 }) {
  const [wished, setWished] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const [imgError, setImgError] = useState(false);
  const reduced = useReducedMotion();

  const hasDiscount = hotel?.originalPrice && hotel.originalPrice > hotel?.startingPrice;
  const discountPct = hasDiscount
    ? Math.round((1 - hotel.startingPrice / hotel.originalPrice) * 100)
    : 0;

  const handleWish = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWished((w) => !w);
    // Trigger pop animation on every toggle
    setHeartAnim(false);
    requestAnimationFrame(() => setHeartAnim(true));
  };

  return (
    <Box
      component={Link}
      to={`/hotels/${hotel.id}`}
      state={searchDates}
      aria-label={`View ${hotel.name} in ${hotel.city}`}
      sx={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        // Staggered fadeUp entrance — each card delayed by index × stagger ms
        animation: anim(fadeUp, duration.enter, index * duration.stagger, "both", reduced),
        // Hover: only image lifts
        "&:hover .card-img-wrap": {
          transform: "translateY(-4px)",
          boxShadow: shadow.md,
        },
        "&:hover .card-img": {
          transform: "scale(1.05)",
        },
        "&:active .card-img-wrap": {
          transform: "translateY(-1px)",
        },
      }}
    >
      {/* ── Image wrapper ─────────────────────────────────────────────────── */}
      <Box
        className="card-img-wrap"
        sx={{
          position: "relative",
          width: "100%",
          paddingTop: "75%",       // 4:3 aspect ratio — fluid, matches Airbnb
          borderRadius: "16px",
          overflow: "hidden",
          bgcolor: color.grey200,
          transition: `transform ${duration.enter}ms ${ease.out},
                       box-shadow ${duration.enter}ms ${ease.out}`,
        }}
      >
        {!imgError ? (
          <Box
            component="img"
            className="card-img"
            src={hotel.coverImageUrl}
            alt={hotel.name}
            loading={index > 2 ? "lazy" : "eager"}
            decoding="async"
            onError={() => setImgError(true)}
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              // Slower zoom so it doesn't feel jarring
              transition: `transform 400ms ${ease.out}`,
            }}
          />
        ) : (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: color.grey200,
            }}
          >
            <Typography variant="caption" color="text.disabled">No image</Typography>
          </Box>
        )}

        {/* Bottom gradient */}
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: "45%",
            background: "linear-gradient(to top, rgba(0,0,0,0.28) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Deal badge — animates in with scaleIn */}
        {discountPct > 0 && (
          <Chip
            label={`${discountPct}% off`}
            size="small"
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              zIndex: 2,
              bgcolor: color.coral,
              color: color.white,
              fontWeight: 700,
              fontSize: "0.75rem",
              height: 24,
              // Small entrance pop for the badge
              animation: anim(popIn, duration.fast, 0, "both", reduced),
            }}
          />
        )}

        {/* Wishlist heart */}
        <IconButton
          aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
          onClick={handleWish}
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 2,
            bgcolor: "rgba(0,0,0,0.28)",
            backdropFilter: "blur(4px)",
            width: 40,
            height: 40,
            transition: `background-color ${duration.fast}ms ${ease.out}`,
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.5)",
              // Subtle scale on hover
              "& .heart-icon": {
                transform: reduced ? "none" : "scale(1.15)",
              },
            },
            "&:active": {
              "& .heart-icon": { transform: "scale(0.9)" },
            },
          }}
        >
          {wished ? (
            <FavoriteRoundedIcon
              className="heart-icon"
              sx={{
                fontSize: 16,
                color: color.coral,
                // Pop animation when filled — replays on each toggle via key
                animation: heartAnim && !reduced
                  ? `${popIn} ${duration.fast}ms ${ease.spring} both`
                  : "none",
                transition: `transform ${duration.fast}ms ${ease.spring}`,
              }}
            />
          ) : (
            <FavoriteBorderRoundedIcon
              className="heart-icon"
              sx={{
                fontSize: 16,
                color: color.white,
                transition: `transform ${duration.fast}ms ${ease.spring}`,
              }}
            />
          )}
        </IconButton>

        {/* Star rating badge */}
        <Box
          sx={{
            position: "absolute",
            bottom: 10,
            right: 10,
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            gap: 0.25,
            bgcolor: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(6px)",
            borderRadius: "6px",
            px: 0.875,
            py: 0.375,
          }}
        >
          <StarRoundedIcon sx={{ fontSize: 13, color: "#FFB400" }} />
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: color.ink800, lineHeight: 1 }}>
            {hotel.starRating}.0
          </Typography>
          <Typography sx={{ fontSize: "0.6875rem", color: color.ink600, lineHeight: 1, ml: 0.25 }}>
            · {hotel.starRating}-star
          </Typography>
        </Box>
      </Box>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <Box sx={{ pt: 1.25, pb: 0.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1, mb: 0.25 }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "0.9375rem",
              lineHeight: 1.35,
              color: color.ink800,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              flex: 1,
            }}
          >
            {hotel.name}
          </Typography>
          {hotel.reviewScore && (
            <Box
              sx={{
                flexShrink: 0,
                bgcolor: color.teal,
                color: color.white,
                borderRadius: "6px",
                px: 0.75,
                py: 0.25,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: "0.8125rem", fontWeight: 700, lineHeight: 1 }}>
                {hotel.reviewScore}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.375, mb: 1 }}>
          <LocationOnOutlinedIcon sx={{ fontSize: 12, color: color.ink400, flexShrink: 0 }} />
          <Typography sx={{ fontSize: "0.8125rem", color: color.ink400, lineHeight: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {hotel.city}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75, flexWrap: "wrap" }}>
          {hasDiscount && (
            <Typography sx={{ fontSize: "0.8125rem", color: color.ink200, textDecoration: "line-through", lineHeight: 1 }}>
              ₹{hotel.originalPrice.toLocaleString("en-IN")}
            </Typography>
          )}
          <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: color.ink800, lineHeight: 1 }}>
            ₹{hotel.startingPrice?.toLocaleString("en-IN")}
          </Typography>
          <Typography sx={{ fontSize: "0.8125rem", color: color.ink400, lineHeight: 1 }}>/ night</Typography>
        </Box>

        <Typography sx={{ fontSize: "0.6875rem", color: color.ink200, mt: 0.25, lineHeight: 1 }}>
          excl. taxes &amp; fees
        </Typography>
      </Box>
    </Box>
  );
});

export default HotelCard;

// ─── Skeleton ────────────────────────────────────────────────────────────────
export function HotelCardSkeleton({ index = 0 }) {
  const reduced = useReducedMotion();
  return (
    <Box sx={{ animation: anim(fadeUp, duration.enter, index * duration.stagger, "both", reduced) }}>
      <Box sx={{ position: "relative", width: "100%", paddingTop: "75%" }}>
        <Skeleton
          variant="rectangular"
          sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", borderRadius: "16px" }}
        />
      </Box>
      <Box sx={{ pt: 1.25 }}>
        <Skeleton variant="text" width="75%" height={20} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="45%" height={16} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="55%" height={20} />
        <Skeleton variant="text" width="35%" height={14} sx={{ mt: 0.25 }} />
      </Box>
    </Box>
  );
}
