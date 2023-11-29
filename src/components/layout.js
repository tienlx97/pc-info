import React from "react";

import { makeStyles, shorthands } from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    ...shorthands.margin("1rem"),
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("1rem"),
  },
});

export default function Layout({ children }) {
  const classes = useStyles();
  return <div className={classes.root}>{children}</div>;
}
