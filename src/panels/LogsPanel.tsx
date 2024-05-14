import React from "react";
import { useWarp } from "../stores/useWarp";
import { ChevronLeft, Eraser } from "lucide-react";
import { Button, ButtonGroup } from "@blueprintjs/core";
import { usePanelStack } from "../stores/useStack";
import { useLogs } from "../stores/useLogs";
import { useSettings } from "../stores/useSettings";

function LogsPanel() {
  const stack = usePanelStack();
  const settings = useSettings();
  const warp = useWarp();
  const logs = useLogs();

  React.useEffect(() => {
    if (warp.log && warp.log !== logs.data[0]) {
      logs.update([warp.log, ...logs.data].slice(0, 50));
    }
  }, [warp.log]);

  const [isDark, setIsDark] = React.useState(false);
  React.useEffect(() => {
    const darkMedia = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(darkMedia.matches);
    darkMedia.addEventListener("change", (e) => {
      setIsDark(e.matches);
    });
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        padding: 10,
        paddingTop: window.electron.platform() == "darwin" ? 45 : 15,
        flexDirection: "column",
        justifyItems: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <Button
          minimal
          onClick={() => {
            stack.pop();
          }}
        >
          <ChevronLeft style={{ marginBottom: -4 }} />
        </Button>
        <div>
          <h3 style={{ margin: 0 }}>Logs</h3>
          <div style={{ fontSize: 10, opacity: 0.4 }}>Terminal Logs</div>
        </div>
        <div style={{ flex: 1 }} />
        <ButtonGroup>
          <Button
            onClick={() => {
              warp.clearLogs();
              logs.clear()
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Eraser size={16} style={{ marginInlineEnd: 3 }} />
              <span>Clear</span>
            </div>
          </Button>
          <Button
            intent="success"
            onClick={() => {
              stack.pop();
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <span>Done</span>
            </div>
          </Button>
        </ButtonGroup>
      </div>

      <div
        // ref={divRef}
        style={{
          width: "100%",
          marginTop: 10,
          // fontFamily: "monospace",
          flex: 1,
          height: "100%",
          display: "flex",
          padding: 10,
          flexDirection: "column",
          gap: 10,
          overflowY: "auto",
        }}
      >
        {logs.data.map((log: string, index: number) => {
          return (
            <div
              style={{
                width: "100%",
                fontSize: 10,
                borderLeftWidth: 4,
                borderLeftStyle: "solid",
                borderLeftColor: log.includes("level=INFO")
                  ? "#2dde98"
                  : log.includes(`level=ERROR`)
                  ? "#ff6c5f"
                  : log.includes(`level=WARN`)
                  ? "#ffc168"
                  : "inherit",
                opacity: index == 0 ? 1 : 0.5,
                paddingLeft: 10,
                fontWeight: index == 0 ? "bold" : "normal",
              }}
            >
              {log}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LogsPanel;
