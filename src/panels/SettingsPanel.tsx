import { Check, RefreshCcw, Settings } from "lucide-react";
import { usePanelStack } from "../stores/useStack";
import {
  Button,
  ButtonGroup,
  Checkbox,
  HTMLSelect,
  InputGroup,
  NumericInput,
  Spinner,
} from "@blueprintjs/core";
import { Countries, useSettings } from "../stores/useSettings";

const SettingsPanel = () => {
  const stack = usePanelStack();
  const settings = useSettings();

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
          padding: 20,
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
            gap: 5,
            alignItems: "center",
          }}
        >
          <Settings size={32} style={{ opacity: 0.2 }} strokeWidth={1.5} />
          <div>
            <h3 style={{ margin: 0 }}>Settings</h3>
            <div style={{ fontSize: 10, opacity: 0.4 }}>Warp Plus Configs</div>
          </div>
          <div style={{ flex: 1 }} />
          {settings.saving && <Spinner intent="primary" size={15} />}
          <ButtonGroup>
            <Button
              onClick={() => {
                settings.resetSettings();
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <RefreshCcw size={18} />
              </div>
            </Button>
            <Button
              intent="success"
              onClick={() => {
                stack.pop();
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Check size={18} />
                <span>Done</span>
              </div>
            </Button>
          </ButtonGroup>
        </div>
        <div
          style={{
            width: "100%",
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            gap: 15,
          }}
        >
          <div>
            <div style={{ marginBottom: 3 }}>Endpoint</div>
            <div>
              <InputGroup
                autoFocus
                placeholder={"engage.cloudflareclient.com:2408"}
                fill
                value={settings.endpoint}
                onChange={(e) => {
                  settings.updateField("endpoint", e.target.value);
                }}
              />
            </div>
          </div>
          <div>
            <div style={{ marginBottom: 3 }}>Key</div>
            <div>
              <InputGroup
                placeholder="bG2183MW-W1zJ8Z93-39A2ZiS5"
                fill
                value={settings.key}
                onChange={(e) => {
                  settings.updateField("key", e.target.value);
                }}
              />
            </div>
          </div>
          <div>
            <div style={{ marginBottom: 3 }}>Port</div>
            <div>
              <NumericInput
                placeholder="8086"
                fill
                min={1000}
                onButtonClick={(e) => {
                  settings.updateField("port", e);
                }}
                value={settings.port}
                onChange={(e) => {
                  settings.updateField("port", e.target.value);
                }}
              />
            </div>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
              marginTop: 10,
            }}
          >
            <div>
              <Checkbox
                id="psiphon"
                checked={settings.psiphon}
                onChange={(e) => {
                  settings.updateField("psiphon", e.target.checked);
                  settings.updateField("gool", false);
                }}
              />
            </div>
            <label htmlFor="psiphon">
              <div style={{ fontWeight: "bold" }}>Psiphon</div>
              <div style={{ fontSize: 9, opacity: 0.5 }}>Activate Psiphon</div>
            </label>
          </div>
          {settings.psiphon && (
            <div>
              <div style={{ marginBottom: 3 }}>Country</div>
              <div>
                <HTMLSelect
                  fill
                  onChange={(e) => {
                    settings.updateField("counrty", e.target.value);
                  }}
                >
                  {Countries.map((country) => {
                    return (
                      <option
                        value={country.id}
                        selected={country.id == settings.counrty}
                      >
                        {country.name} ({country.id})
                      </option>
                    );
                  })}
                </HTMLSelect>
              </div>
            </div>
          )}
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
              marginTop: 10,
            }}
          >
            <div>
              <Checkbox
                id="gool"
                checked={settings.gool}
                onChange={(e) => {
                  settings.updateField("gool", e.target.checked);
                  settings.updateField("psiphon", false);
                }}
              />
            </div>
            <label htmlFor="gool">
              <div style={{ fontWeight: "bold" }}>Gool</div>
              <div style={{ fontSize: 9, opacity: 0.5 }}>
                Activate Warp in Warp
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
