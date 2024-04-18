import { Check, ChevronLeft } from "lucide-react";
import { usePanelStack } from "../stores/useStack";
import { Button, Checkbox, HTMLSelect, InputGroup } from "@blueprintjs/core";
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
            <ChevronLeft size={18} style={{ marginBottom: -3 }} />
          </Button>
          <div>
            <h3 style={{ margin: 0 }}>Settings</h3>
            <div style={{ fontSize: 10, opacity: 0.4 }}>Warp Plus Configs</div>
          </div>
          <div style={{ flex: 1 }} />
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
        </div>
        <div
          style={{
            width: "100%",
            paddingInline: 5,
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
              <InputGroup fill value={settings.endpoint} />
            </div>
          </div>
          <div>
            <div style={{ marginBottom: 3 }}>Key</div>
            <div>
              <InputGroup fill value={settings.key} />
            </div>
          </div>
          <div>
            <div style={{ marginBottom: 3 }}>Port</div>
            <div>
              <InputGroup fill value={settings.port.toString()} />
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
                  settings.updateField('gool', false)
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
              <div style={{ marginBottom: 3 }}>Destination Country</div>
              <div>
                <HTMLSelect
                  fill
                  onChange={(e) => {
                    settings.updateField("counrty", e.target.value);
                  }}
                >
                  {Countries.map((country) => {
                    return (
                      <option value={country.id} selected={country.id == settings.counrty}>
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
              <Checkbox id="gool" checked={settings.gool} onChange={e=>{
                settings.updateField('gool', e.target.checked)
                settings.updateField('psiphon', false)
              }} />
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
