export const successToastOpts = (icon?: string) => ({
  duration: 4000,
  style: {
    background: "chartreuse",
  },
  icon: icon || "✔️",
});

export const errorToastOpts = {
  duration: 4000,
  icon: "❌",
};
