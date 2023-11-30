/* eslint-disable jsx-a11y/alt-text */
import "./App.css";
import { useEffect, useState } from "react";
import {
  Divider,
  Button,
  useId,
  useToastController,
  Toast,
  Toaster,
  ToastTitle,
  shorthands,
  makeStyles,
} from "@fluentui/react-components";

import Layout from "./components/layout";
import InputComp from "./components/input";
import { Department } from "./components/department";
import { CompanySelect } from "./components/company";

import { companyIDArr, departmentMap } from "./config/company";

import { useMutation } from "@tanstack/react-query";

import axios from "axios";

const si = window.require("systeminformation");
const { ipcRenderer } = window.require("electron");

const obj = {
  cpu: "*",
  cpuCache: "*",
  mem: "*",
  memLayout: "*",
  graphics: "controllers, displays",
  battery: "*",
  osInfo: "*",
  uuid: "*",
  versions: "*",
  diskLayout: "*",
  networkInterfaces: "*",
  networkGatewayDefault: "*",
  networkInterfaceDefault: "*",
  wifiNetworks: "*",
  system: "*",
  bios: "*",
  baseboard: "*",
  chassis: "*",
  audio: "*",
  bluetoothDevices: "*",
  printer: "*",
  usb: "*",
};

const useStyles = makeStyles({
  companyDepartmentWrapper: {
    ...shorthands.gap("1rem"),
  },

  companySplit: {
    flexGrow: 1,
  },

  department: {
    flexGrow: 3,
  },
});

function App() {
  const classes = useStyles();

  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);

  const mutation = useMutation({
    mutationFn: (option) =>
      axios.post(
        "https://sheet.best/api/sheets/6a0676cd-8396-4c7f-9448-d0e919c7772f",
        option
      ),

    onSuccess(data) {
      if (data.data) {
        dispatchToast(
          <Toast>
            <ToastTitle>Đã gửi thành công !</ToastTitle>
          </Toast>,
          {
            intent: "success",
          }
        );

        setTimeout(() => {
          ipcRenderer.send("close");
        }, 2000);
      }
    },
  });

  const [companyId, selectCompanyId] = useState("cthanh");
  const [department, setDepartment] = useState(departmentMap.cthanh[0]);
  const [name, setName] = useState("");

  const [siObject, setsiObject] = useState(null);

  useEffect(() => {
    si.get(obj).then((data) => {
      setsiObject(data);
      ipcRenderer.send("async-operation-complete");
    });
  }, []);

  return (
    <Layout>
      <div
        className={classes.companyDepartmentWrapper}
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <CompanySelect
          className={classes.companySplit}
          onCompanyChange={(ev, data) => {
            selectCompanyId(data.value);
          }}
        />
        <Department
          className={classes.department}
          onDepartmentSelected={(val) => {
            setDepartment(val);
          }}
          defaultValue={departmentMap[companyId][0]}
          companyId={companyId}
        />
      </div>
      <InputComp
        label="Họ tên"
        placeholder="Nguyễn Văn A"
        onChange={(ev, data) => {
          setName(data.value);
        }}
      />
      <InputComp
        label="Số điện thoại"
        placeholder="0123-456-789"
        type="tel"
        pattern="[0-9]{4}-[0-9]{3}-[0-9]{3}"
        onChange={(ev, data) => {
          setName(data.value);
        }}
      />
      <Divider />
      <Button
        onClick={async () => {
          mutation.mutate({
            // id,
            name,
            company: companyIDArr[companyId],
            departmentName: department,
            pcInfo: siObject,
          });
        }}
        disabled={name === "" || mutation.isPending || mutation.isSuccess}
        appearance="primary"
      >
        Gửi
      </Button>
      <Toaster toasterId={toasterId} />
    </Layout>
  );
}

export default App;
