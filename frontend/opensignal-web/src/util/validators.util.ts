const re = /^[0-9\b]+$/;
export const validateNeutralNumber = (val: any) => {
    return re.test(val) && Number(val) < 1e15 ? Number(val) : 0;
};
