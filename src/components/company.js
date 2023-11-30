import * as React from "react";
import {
  makeStyles,
  Select,
  useId,
  Label,
  mergeClasses,
} from "@fluentui/react-components";

import { companyIDArr } from "../config/company";

const useStyles = makeStyles({
  base: {
    display: "flex",
    flexDirection: "column",
    // width: "50%",
  },
});

export const CompanySelect = ({ onCompanyChange, className }) => {
  const styles = useStyles();
  const selectId = useId();

  return (
    <div className={mergeClasses(styles.base, className)}>
      <div className={styles.field}>
        <Label weight="semibold" htmlFor={`${selectId}-outline`}>
          Công ty
        </Label>
        <Select
          onChange={onCompanyChange}
          id={`${selectId}-outline`}
          appearance="outline"
        >
          {Object.keys(companyIDArr).map((id) => (
            <option value={id} key={id}>
              {companyIDArr[id]}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
};
