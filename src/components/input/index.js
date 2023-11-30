import React from "react";

import {
  makeStyles,
  shorthands,
  Input,
  Label,
  useId,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("2px"),
  },
});

/**
 *
 * @param {import("./input").InputCompProps} props
 */
export default function InputComp(props) {
  const { label, phone, setPhone, type, onChange, placeholder, ...rest } =
    props;

  const classes = useStyles();
  const beforeId = useId("content-before");

  return (
    <div className={classes.root}>
      <Label weight="semibold" htmlFor={beforeId}>
        {label}
      </Label>
      <Input
        {...rest}
        type={type}
        onChange={onChange}
        placeholder={placeholder}
        id={beforeId}
      />
    </div>
  );
}
