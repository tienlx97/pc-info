import React, { useState } from "react";

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
 * @param {string | undefined} value
 * @param {string | undefined} previousValue
 * @returns {string | undefined}
 */
const normalizeInput = (value, previousValue) => {
  // return nothing if no value
  if (!value) return value;

  // only allows 0-9 inputs
  const currentValue = value.replace(/[^\d]/g, "");
  const cvLength = currentValue.length;

  if (!previousValue || value.length > previousValue.length) {
    // returns: "x", "xx", "xxx", "xxxx"
    if (cvLength < 5) return currentValue;

    // returns: "(xxxx)", "(xxxx) x", "(xxxx) xx", "(xxxx) xxx",
    if (cvLength < 8)
      return `(${currentValue.slice(0, 4)}) ${currentValue.slice(4)}`;

    // returns: "(xxxx) xxx-", "(xxxx) xxx-x", "(xxxx) xxx-xx", "(xxxx) xxx-xxx", "(xxxx) xxx-xxxx"
    return `(${currentValue.slice(0, 4)}) ${currentValue.slice(
      4,
      7
    )}-${currentValue.slice(7, 11)}`;
  }
};

/**
 *
 * @param {import("./type").InputCompProps} props
 */
export default function InputComp(props) {
  const { label, phone, setPhone, type, onChange, placeholder, ...rest } =
    props;

  const { values, setVal } = useState();

  const classes = useStyles();
  const beforeId = useId("content-before");

  const onInutChange = (ev, data) => {
    setVal((pre) => normalizeInput(data.value, pre));
  };

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
