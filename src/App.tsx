import { FocusStyleManager, PanelStack2 } from "@blueprintjs/core";
import React from "react";
import { usePanelStack } from "./stores/useStack";
import HomePanel from "./panels/HomePanel";
FocusStyleManager.onlyShowFocusOnTabs();

function App() {
  const [dark, setDark] = React.useState(false);
  const stack = usePanelStack();

  React.useEffect(() => {

    stack.push({
      renderPanel: HomePanel
    })
    const darkMedia = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(darkMedia.matches);
    const callback = (e: MediaQueryListEvent) => {
      setDark(e.matches);
    };
    darkMedia.addEventListener("change", callback);
    return () => {
      darkMedia.removeEventListener("change", callback);
    };
  }, []);

  return (
    <main
      className={dark ? "bp5-dark" : ""}
      style={{
        height: "100vh",
        display: "flex",
        justifyItems: "center",
        alignItems: "center",
      }}
    >
      <PanelStack2
        className="panel"
        showPanelHeader={false}
        renderActivePanelOnly
        stack={stack.stacks}
      />
    </main>
  );
}

export default App;
