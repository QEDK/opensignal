import React, { Dispatch } from "react";

let timer: any;
const useSnackbar = (
  dispatch: Dispatch<any>,
  err: { code?: string; msg?: string; reason?: string; message?: string },
) => {
  const [storageChecked, setStorageChecked] = React.useState(false);
  React.useEffect(() => {
    if (err) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        dispatch({ type: "SET_ERROR" });
      }, 4000);
      try {
        const errReason = err ? err["message"] || err["reason"] || err["msg"] || err : err;
        // snackbar.showMessage(err);
      } catch (error) {
        // snackbar.showMessage(state.err);
      }
    }
    return () => {
      clearTimeout(timer);
    };
  }, [err]);
};

export { useSnackbar };
