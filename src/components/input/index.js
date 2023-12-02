import React from "react";

import {
  makeStyles,
  shorthands,
  Input,
  Label,
  useId,
  InfoLabel,
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
      <InfoLabel weight="semibold" htmlFor={beforeId} required>
        {label}
      </InfoLabel>
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
