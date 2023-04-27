import React from "react";
import { useToast, toastType } from "@Toast";

export default function ToastTest(props) {
  const toast = useToast();

  return (
    <div style={props.style}>
      <p style={{ margin: 0 }}>SUCCESS</p>
      <button
        onClick={() => {
          toast("hello from SUCCESS Toast!", toastType.SUCCESS);
        }}
      >
        Toast!
      </button>

      <p style={{ margin: 0 }}>ERROR</p>
      <button
        onClick={() => {
          toast("hello from ERROR Toast!", toastType.ERROR);
        }}
      >
        Toast!
      </button>
      <p style={{ margin: 0 }}>INFO</p>
      <button
        onClick={() => {
          toast("hello from INFO Toast!", toastType.INFO);
        }}
      >
        Toast!
      </button>
    </div>
  );
}
