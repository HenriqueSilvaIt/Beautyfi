export function getCloudinaryAvatar(
  uri: string,
  size: "sm" | "md" | "lg"
) {
  if (!uri.includes("cloudinary.com")) return uri;

  const sizeMap = {
    sm: 96,
    md: 140,
    lg: 176,
  };

  const dimension = sizeMap[size];

  return uri.replace(
    "/upload/",
    `/upload/w_${dimension},h_${dimension},c_fill,f_auto,q_auto/`
  );
}

export function getCloudinaryCarousel(
  uri: string,
  width: number,
  height: number
) {
  if (!uri?.includes("cloudinary.com")) return uri;

  return uri.replace(
    "/upload/",
    `/upload/w_${Math.round(width)},h_${Math.round(
      height
    )},c_fit,f_auto,q_auto/`
  );
}