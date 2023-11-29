import React from "react";

import {
  Label,
  Radio,
  RadioGroup,
  useId,
  makeStyles,
  shorthands,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("2px"),
  },
});

export default function Gender({ label = "Giới tính" }) {
  const beforeId = useId();

  return (
    <div>
      <Label weight="semibold" htmlFor={beforeId}>
        {label}
      </Label>
      <RadioGroup layout="horizontal">
        <Radio value="male" label="Nam" />
        <Radio value="female" label="Nữ" />
      </RadioGroup>
    </div>
  );
}
