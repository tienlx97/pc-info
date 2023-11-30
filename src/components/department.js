import {
  Combobox,
  makeStyles,
  Option,
  useId,
  Label,
  mergeClasses,
} from "@fluentui/react-components";

import { departmentMap } from "../config/company";

import { useMemo, useState } from "react";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  listbox: {
    maxHeight: "300px",
  },
});

export const Department = ({
  companyId,
  defaultValue,
  onDepartmentSelected,
  className,
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
    <div className={mergeClasses(styles.root, className)}>
      <Label weight="semibold" id={comboId}>
        Phòng ban
      </Label>
      <Combobox
        // style={{
        //   width: "50%",
        // }}
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
