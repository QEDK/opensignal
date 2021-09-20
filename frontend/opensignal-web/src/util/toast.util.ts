export const successToastOpts = (icon?: string) => ({
    duration: 5000,
    style: {
        background: "chartreuse",
    },
    icon: icon || "✔️",
});

export const errorToastOpts = {
    duration: 5000,
    icon: "❌",
};
