export const getH1MobileSize = (windowWidth) => {
  if (windowWidth >= 950) return 56;
  else if (windowWidth >= 900) return 52;
  else if (windowWidth >= 750) return 44;
  else if (windowWidth >= 400) return 40;
  else return 36;
};

export const getH1SmallMobileSize = (windowWidth) => {
  if (windowWidth >= 950) return 48;
  else if (windowWidth >= 900) return 44;
  else if (windowWidth >= 750) return 40;
  else if (windowWidth >= 400) return 36;
  else return 32;
};

export const getH2MobileSize = (windowWidth) => {
  if (windowWidth >= 950) return 32;
  else if (windowWidth >= 750) return 30;
  else if (windowWidth >= 400) return 28;
  else return 24;
};

export const getH2SmallMobileSize = (windowWidth) => {
  if (windowWidth >= 950) return 28;
  else if (windowWidth >= 750) return 26;
  else return 24;
};

export const getH2XSmallMobileSize = (windowWidth) => {
  if (windowWidth >= 950) return 24;
  else if (windowWidth >= 750) return 22;
  else return 20;
};

export const getBodyTextSize = (windowWidth) => {
  if (windowWidth >= 950) return 18;
  else if (windowWidth >= 600) return 16;
  else return 14;
};
