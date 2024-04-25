import React from "react";
import { useWarp } from "../stores/useWarp";
import { ChevronLeft } from "lucide-react";
import { Button, ButtonGroup } from "@blueprintjs/core";
import { usePanelStack } from "../stores/useStack";
import { useLogs } from "../stores/useLogs";

function LogsPanel() {
  const stack = usePanelStack();
  const warp = useWarp();
  const logs = useLogs();

  React.useEffect(() => {
    logs.update([warp.log, ...logs.data].slice(0, 100));
  }, [warp.log]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        padding: 10,
        paddingTop: 45,
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
          {/* <Button
            onClick={() => {
              warp.clearLogs();
              logs.clear();
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Eraser size={16} style={{ marginInlineEnd: 3 }} />
              <span>Clear</span>
            </div>
          </Button> */}
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
          marginTop: 10,
          fontFamily: "monospace",
          wordBreak: "break-all",
          lineBreak: "loose",
          wordWrap: "break-word",
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
                fontSize: 12,
                opacity: index == 0 ? 1 : 0.6,
                lineHeight: 1.1,
                fontWeight: index == 0 ? "bold" : "normal",
                color: log.includes(`level=INFO`)
                  ? "green"
                  : log.includes(`level=ERROR`)
                  ? "red"
                  : log.includes(`level=WARN`)
                  ? "orange"
                  : "inherit",
              }}
            >
              {index == 0 && "▶"} {log}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LogsPanel;
