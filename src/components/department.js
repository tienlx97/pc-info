import {
  Combobox,
  makeStyles,
  Option,
  shorthands,
  useId,
  Label,
} from "@fluentui/react-components";

import { departmentMap } from "../config/company";

import { useMemo, useState } from "react";

const useStyles = makeStyles({
  root: {
    // Stack the label above the field with a gap
    display: "grid",
    gridTemplateRows: "repeat(1fr)",
    justifyItems: "start",
    ...shorthands.gap("2px"),
    // minWidth: "500px",
  },
  listbox: {
    maxHeight: "300px",
  },
});

export const Department = ({
  companyId,
  defaultValue,
  onDepartmentSelected,
  ...props
}) => {
  const comboId = useId("combo-department");
  const styles = useStyles();

  const [selectedOptions, setSelectedOptions] = useState([defaultValue]);
  const [value, setValue] = useState(defaultValue);

  const onOptionSelect = (ev, data) => {
    setSelectedOptions(data.selectedOptions);
    setValue(data.optionText ?? "");
    onDepartmentSelected && onDepartmentSelected(data.optionText);
  };

  const departmentOptions = useMemo(() => {
    setValue(defaultValue);
    setSelectedOptions([defaultValue]);

    return departmentMap[companyId];
  }, [companyId, defaultValue]);

  return (
    <div className={styles.root}>
      <Label weight="semibold" id={comboId}>
        Phòng ban
      </Label>
      <Combobox
        style={{
          width: "50%",
        }}
        aria-labelledby={comboId}
        listbox={{ className: styles.listbox }}
        placeholder="Chọn phòng ban"
        {...props}
        value={value}
        selectedOptions={selectedOptions}
        onOptionSelect={onOptionSelect}
      >
        {departmentOptions.map((option) => (
          <Option value={option} key={option}>
            {option}
          </Option>
        ))}
      </Combobox>
    </div>
  );
};
