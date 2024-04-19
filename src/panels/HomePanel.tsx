import { usePanelStack } from "../stores/useStack";
import SettingsPanel from "./SettingsPanel";
import { Github, HardDriveDownload, Info, Settings, Terminal, X } from "lucide-react";
import { Button, ButtonGroup, Tooltip } from "@blueprintjs/core";
import AppLogo from "/logo.png";
import ConnectIcon from "/connect.png";
import ConnectedIcon from "/connected.png";
import { useWarp } from "../stores/useWarp";
import PackageJSON from "../../package.json";

const HomePanel = () => {
  // const [connecting, setConnecting] = React.useState(false);
  // const [connected, setConnected] = React.useState(false);

  const warp = useWarp();
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
          padding: 15,
          paddingTop: 40,
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
            justifyContent: "center",
            flexDirection: "column",
            gap: 5,
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 10,
            }}
          >
            <img
              src={AppLogo}
              style={{
                width: 50,
                height: 50,
                borderRadius: 10,
              }}
            />
            <div>
              <div style={{ fontSize: 20, fontWeight: "bold" }}>
                XWarp Client
              </div>
              <div style={{ fontSize: 10, opacity: 0.4 }}>
                Version {PackageJSON.version}
              </div>
              <div style={{ fontSize: 10, opacity: 0.4 }}>
                Designed by <a href="#">Bahman World</a>
              </div>
            </div>
          </div>
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
              warp.connecting ? "connecting" : warp.connected ? "connected" : ""
            }`}
            onClick={() => {
              if (warp.connected) {
                warp.disconnect();
              } else {
                warp.connect();
              }
            }}
          >
            {warp.connecting && (
              <img
                src={ConnectIcon}
                style={{
                  width: 75,
                  height: "auto",
                }}
                className={warp.connecting ? "animating" : ""}
              />
            )}
            {!warp.connecting && (
              <div>
                {!warp.connected && (
                  <img
                    // className="idle-animating"
                    src={ConnectIcon}
                    style={{
                      width: 75,
                      height: 75,
                      filter: "drop-shadow(2px 3px 15px #0005)",
                    }}
                  />
                )}
                {warp.connected && (
                  <img
                    src={ConnectedIcon}
                    style={{
                      width: 130,
                      height: 130,
                      filter: "drop-shadow(5px 10px 15px #0006)",
                    }}
                  />
                )}
              </div>
            )}
          </button>
        </div>
        <div
          style={{
            width: "100%",
            fontSize: 10,
            textAlign: "center",
            padding: 5,
            wordBreak: "break-word",
          }}
        >
          {warp.logs || ""}
        </div>
        <ButtonGroup minimal style={{ marginBottom: 10 }}>
          <Tooltip compact content={"About..."}>
            <Button
              onClick={() => {
                alert("info");
              }}
            >
              <Info size={18} style={{ marginBottom: -4 }} />
            </Button>
          </Tooltip>
          <Tooltip compact content={"Logs"}>
            <Button
              onClick={() => {
                alert("log");
              }}
            >
              <Terminal size={18} style={{ marginBottom: -4 }} />
            </Button>
          </Tooltip>
          <Tooltip compact content={"Github Repository"}>
            <Button
              onClick={() => {
                alert("github");
              }}
            >
              <Github size={18} style={{ marginBottom: -4 }} />
            </Button>
          </Tooltip>
          <Tooltip compact content={"Settings"}>
            <Button
              onClick={() => {
                stack.push({
                  renderPanel: SettingsPanel,
                });
              }}
            >
              <Settings size={18} style={{ marginBottom: -4 }} />
            </Button>
          </Tooltip>
          <Tooltip compact content={"Update Core"}>
            <Button
              onClick={() => {
                stack.push({
                  renderPanel: SettingsPanel,
                });
              }}
            >
              <HardDriveDownload size={18} style={{ marginBottom: -4 }} />
            </Button>
          </Tooltip>
          <Tooltip compact intent="danger" content={"Force Quit"}>
            <Button
              intent="danger"
              onClick={() => {
                if (confirm("Force Quit Application?")) {
                  window.client.quit();
                }
              }}
            >
              <X size={18} style={{ marginBottom: -4 }} />
            </Button>
          </Tooltip>
        </ButtonGroup>

        <div
          style={{
            fontSize: 10,
            opacity: 0.4,
            textAlign: "center",
          }}
        >
          <div>Dahatu, Inc</div>
          <div style={{ fontSize: 8 }}>
            Copyright ©{new Date(Date.now()).getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePanel;
