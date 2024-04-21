import React from "react";
import { useWarp } from "../stores/useWarp";
import { ChevronLeft, Eraser } from "lucide-react";
import { Button, ButtonGroup } from "@blueprintjs/core";
import { usePanelStack } from "../stores/useStack";
import { useSettings } from "../stores/useSettings";

function LogsPanel() {
  const stack = usePanelStack();
  const warp = useWarp();
  const settings = useSettings();

  const divRef = React.useRef<HTMLDivElement>(null);


  React.useEffect(() => {
    divRef.current?.scrollTo(0, divRef.current.scrollHeight);
  }, [warp.logs]);

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
          <ChevronLeft style={{ marginBottom: -4 }}  />
        </Button>
        <div>
          <h3 style={{ margin: 0 }}>Logs</h3>
          <div style={{ fontSize: 10, opacity: 0.4 }}>
            Warp Plus Terminal Logs
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <ButtonGroup>
            <Button
              onClick={() => {
                  warp.clearLogs()
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Eraser size={16} style={{marginInlineEnd: 3}} />
                <span>Clear</span>
              </div>
            </Button>
          </ButtonGroup>
      </div>

      <div
        ref={divRef}
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
        {warp.logs.reverse().map((log: string, index) => {
          return (
            <div
              style={{
                transition: "all .2s ease",
                fontSize: 12,
                opacity: index < warp.logs.length - 1 ? 0.3 : 1,
                color: log.includes(`level=INFO`)
                  ? "green"
                  : log.includes(`level=ERROR`)
                  ? "red"
                  : "inherit",
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
