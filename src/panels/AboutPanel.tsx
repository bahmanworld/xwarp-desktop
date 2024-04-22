import { ChevronLeft, Eraser } from "lucide-react";
import { Button, ButtonGroup } from "@blueprintjs/core";
import { usePanelStack } from "../stores/useStack";

function AboutPanel() {
  const stack = usePanelStack();

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
          <h3 style={{ margin: 0 }}>About XWarp</h3>
          <div style={{ fontSize: 10, opacity: 0.4 }}>
            Credits & Contributers
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <ButtonGroup>
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
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
            Dev #1
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
            Dev #2
        </div>
      </div>
    </div>
  );
}

export default AboutPanel;
