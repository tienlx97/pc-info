import {
  InfoLabel,
  Textarea,
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

export function Software({ onChange }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <InfoLabel info="Điền theo format phía dưới" weight="semibold" required>
        Phần mềm chuyên ngành đang sử dụng
      </InfoLabel>
      <Textarea
        onChange={onChange}
        rows={20}
        placeholder={`- Autocad
- ETAB
- Adobe premiere
- Photoshop
- Misa
- Visual studio code`}
      />
    </div>
  );
}
