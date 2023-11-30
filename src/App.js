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

function App() {
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
      <CompanySelect
        onCompanyChange={(ev, data) => {
          selectCompanyId(data.value);
        }}
      />
      <Department
        onDepartmentSelected={(val) => {
          setDepartment(val);
        }}
        defaultValue={departmentMap[companyId][0]}
        companyId={companyId}
      />
      <InputComp
        label="Họ tên"
        placeholder="Nguyễn Văn A"
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
