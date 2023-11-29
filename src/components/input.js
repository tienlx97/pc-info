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

export default function InputComp({ placeholder, label, onChange }) {
  const clases = useStyles();

  const beforeId = useId("content-before");

  return (
    <div
      style={{
        width: "50%",
      }}
      className={clases.root}
    >
      <Label weight="semibold" htmlFor={beforeId}>
        {label}
      </Label>
      <Input onChange={onChange} placeholder={placeholder} id={beforeId} />
    </div>
  );
}
