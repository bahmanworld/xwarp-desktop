import {
  Check,
  CheckCheck,
  ChevronLeft,
  Copy,
  DollarSign,
  Eraser,
  ExternalLink,
  Gem,
} from "lucide-react";
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogBody,
  DialogFooter,
  Overlay2,
  Popover,
} from "@blueprintjs/core";
import { usePanelStack } from "../stores/useStack";
import React from "react";

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
          <div style={{ fontSize: 10, opacity: 0.4 }}>Devs & Contributers</div>
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
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: "100%",
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderBottom: "1px dashed #fff1",
          }}
        >
          <UserGithubAccount
            photoUrl="https://avatars.githubusercontent.com/u/5371898?v=4"
            username="bahmanworld"
            githubLink="https://github.com/bahmanworld"
            address="THYw8LDznRSQzYTnu7TaigyMQyc952GZ2B"
          />
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <UserGithubAccount
            photoUrl="https://avatars.githubusercontent.com/u/12181172?v=4"
            username="ebdulrehmandemya"
            githubLink="https://github.com/ebdulrehmandemya"
            address="THYw8LDznRSQzYTnu7TaigyMQyc952GZ2B"
          />
        </div>
      </div>
    </div>
  );
}

type UserGithubAccountProps = {
  username: string;
  photoUrl: string;
  githubLink: string;
  address: string;
};
const UserGithubAccount: React.FC<UserGithubAccountProps> = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const popoverRef = React.useRef<Popover>(null);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <img
        style={{ width: 80, height: 80, borderRadius: 80, marginBottom: 5 }}
        src={props.photoUrl}
      />
      <div style={{ fontSize: 16, fontWeight: "bold" }}>{props.username}</div>
      <a
        href="#"
        style={{ fontSize: 10, display: "flex", alignItems: "center", gap: 5 }}
        onClick={(e) => {
          e.preventDefault();
          window.electron.openExternalLink(props.githubLink);
        }}
      >
        <div>Open Github Profile</div>
        <ExternalLink size={12} />
      </a>
      <Popover
        ref={popoverRef}
        interactionKind="click"
        isOpen={isOpen}
        onInteraction={(state) => setIsOpen(state)}
        usePortal
        content={
          <div style={{ padding: 12, fontSize: 12 }}>
            <div style={{ opacity: 0.3, marginBottom: 1 }}>USDT Address (TRC20):</div>
            <div style={{ fontWeight: "bold"}}>
              {props.address}
            </div>
            <Button
              small
              fill
              intent="success"
              style={{ fontSize: 10, marginTop: 10, borderRadius: 5 }}
              onClick={() => {
                window.electron.copy(props.address);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                  setIsOpen(false);
                }, 2000);
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                {!copied && <Copy size={14} />}
                {copied && <CheckCheck size={14} />}
                <span>{copied ? "Copied, Thank you" : "Copy Address"}</span>
              </div>
            </Button>
          </div>
        }
      >
        <Button
          small
          className="zoomInOutAnimation"
          style={{
            fontSize: 10,
            borderRadius: 8,
            marginTop: 8,
          }}
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Gem size={14} />
            <span>Donate with USDT</span>
          </div>
        </Button>
      </Popover>
    </div>
  );
};

export default AboutPanel;
