import React from "react";
import { useWarp } from "../stores/useWarp";
import { ChevronLeft } from "lucide-react";
import { Button } from "@blueprintjs/core";
import { usePanelStack } from "../stores/useStack";

function LogsPanel() {
  const stack = usePanelStack();
  const warp = useWarp();

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
        flexDirection: "column",
        justifyItems: "center",
        alignItems: "center",
        padding: 10,
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          gap: 5,
          alignItems: "center",
        }}
      >
        <Button
          minimal
          onClick={() => {
            stack.pop();
          }}
        >
          <ChevronLeft size={32} style={{ opacity: 0.2 }} strokeWidth={1.5} />
        </Button>
        <div>
          <h3 style={{ margin: 0 }}>Logs</h3>
          <div style={{ fontSize: 10, opacity: 0.4 }}>
            Warp Plus Terminal Logs
          </div>
        </div>
        <div style={{ flex: 1 }} />
      </div>

      <div
        ref={divRef}
        style={{
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
                transition: "all 1s ease",
                fontSize: 12,
                opacity: index < warp.logs.length - 1 ? 0.3 : 1,
                color: log.includes('msg="serving proxy"')
                  ? "green"
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
