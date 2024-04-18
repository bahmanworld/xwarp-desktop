import React from "react";
import ConnectIcon from "./../assets/connect.png";
import { usePanelStack } from "../stores/useStack";
import SettingsPanel from "./SettingsPanel";
import { Info, Settings, Settings2 } from "lucide-react";
import { Button } from "@blueprintjs/core";

const HomePanel = () => {
  const [connecting, setConnecting] = React.useState(false);
  const [connected, setConnected] = React.useState(false);

  const stack = usePanelStack();

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyItems: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          padding: 10,
          flexDirection: "column",
          justifyItems: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <div>
            <h3 style={{ margin: 0 }}>XWarp Client</h3>
            <div style={{ fontSize: 10, opacity: 0.4 }}>Version 1.5.33</div>
          </div>
          <div style={{ flex: 1 }} />
          <Button
            minimal
            onClick={() => {
              stack.push({
                renderPanel: SettingsPanel,
              });
            }}
          >
            <Info size={18} style={{ marginBottom: -3 }} />
          </Button>
          <Button
            onClick={() => {
              stack.push({
                renderPanel: SettingsPanel,
              });
            }}
          >
            <Settings size={18} style={{ marginBottom: -3 }} />
          </Button>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            className={`big-button ${
              connecting ? "connecting" : connected ? "connected" : ""
            }`}
            onClick={() => {
              if (connected) {
                setConnected(false);
                setConnecting(false);
                return;
              }
              setConnecting(!connecting);
              setTimeout(() => {
                setConnected(true);
                setConnecting(false);
              }, 3000);
            }}
          >
            {!connecting && (
              <div>
                {!connected && (
                  <img className="idle-animating" src={ConnectIcon} style={{ width: 60, height: 60 }} />
                )}
                {connected && <div style={{ fontSize: 60 }}>🎉</div>}
              </div>
            )}
            {connecting && (
              <div style={{ fontWeight: "bold" }}>
                <div
                  className={connecting ? "animating" : ""}
                  style={{ fontSize: 60 }}
                >
                  {connected ? "👋🏻" : "🚀"}
                </div>
              </div>
            )}
          </button>
        </div>
        <div
          style={{
            fontSize: 10,
            color: "#999",
            textAlign: "center",
          }}
        >
          <div>Dahatu, Inc</div>
          <div>©2024-2025</div>
        </div>
      </div>
    </div>
  );
};

export default HomePanel;
