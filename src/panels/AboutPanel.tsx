import { ChevronLeft, Eraser, ExternalLink } from "lucide-react";
import { Button, ButtonGroup } from "@blueprintjs/core";
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
          width: '100%',
          height: '100%',
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: '100%',
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
};
const UserGithubAccount: React.FC<UserGithubAccountProps> = (props) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
      }}
    >
      <img
        style={{ width: 120, height: 120, borderRadius: 120, marginBottom: 10 }}
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
    </div>
  );
};

export default AboutPanel;
