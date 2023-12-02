import React, { useState } from "react";

import {
  makeStyles,
  shorthands,
  Input,
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
 * @param {string | undefined} value
 * @param {string | undefined} previousValue
 * @returns {string | undefined}
 */
const normalizeInput = (value, previousValue) => {
  // return nothing if no value
  if (!value) {
    return value;
  }

  // only allows 0-9 inputs
  const currentValue = value.replace(/[^\d]/g, "");
  const cvLength = currentValue.length;

  if (!previousValue || value.length > previousValue.length) {
    // returns: "x", "xx", "xxx", "xxxx"
    if (cvLength < 5) return currentValue;

    // returns: "(xxxx)", "(xxxx) x", "(xxxx) xx", "(xxxx) xxx",
    if (cvLength < 8)
      return `${currentValue.slice(0, 4)} ${currentValue.slice(4)}`;

    // returns: "(xxxx) xxx-", "(xxxx) xxx-x", "(xxxx) xxx-xx", "(xxxx) xxx-xxx", "(xxxx) xxx-xxx"
    return `${currentValue.slice(0, 4)} ${currentValue.slice(
      4,
      7
    )} ${currentValue.slice(8, 10)}`;
  }
};

export default function PhoneInput(props) {
  const { label, phone, setPhone, type, onChange, placeholder, ...rest } =
    props;

  const [value, setValue] = useState("");

  // to distinguish <del> from <backspace>
  const [key, setKey] = useState(undefined);

  const classes = useStyles();
  const beforeId = useId("content-before");

  function formatPhone(event) {
    const element = event.target;
    let caret = element.selectionStart;
    let value = element.value.split("");

    // sorry for magical numbers
    // update value and caret around delimiters
    if (
      (caret === 4 || caret === 8) &&
      key !== "Delete" &&
      key !== "Backspace"
    ) {
      caret++;
    } else if ((caret === 3 || caret === 7) && key === "Backspace") {
      value.splice(caret - 1, 1);
      caret--;
    } else if ((caret === 3 || caret === 7) && key === "Delete") {
      value.splice(caret, 1);
    }

    // update caret for non-digits
    if (key.length === 1 && /[^0-9]/.test(key)) caret--;

    value = value
      .join("")
      // remove everithing except digits
      .replace(/[^0-9]+/g, "")
      // limit input to 10 digits
      .replace(/(.{10}).*$/, "$1")
      // insert "-" between groups of digits
      .replace(/^(.?.?.?)(.?.?.?)(.?.?.?.?)$/, "$1-$2-$3")
      // remove exescive "-" at the end
      .replace(/-*$/, "");

    setValue(value);
    onChange && onChange(value);

    // "setTimeout" to update caret after setValue
    window.requestAnimationFrame(() => {
      element.setSelectionRange(caret, caret);
    });
  }

  return (
    <div className={classes.root}>
      <InfoLabel
        required
        weight="semibold"
        info="Điện thoại sẽ được format tự động"
        htmlFor={beforeId}
      >
        {label}
      </InfoLabel>
      <Input
        {...rest}
        type={type}
        onChange={formatPhone}
        onKeyDown={(event) => setKey(event.key)}
        name="Phone"
        value={value}
        placeholder={placeholder}
        id={beforeId}
      />
    </div>
  );
}
