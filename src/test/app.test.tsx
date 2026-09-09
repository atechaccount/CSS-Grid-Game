import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import App from "../App";
import { defaultProgress } from "../store/progress";

function setQuery(query: string): void {
  window.history.replaceState(null, "", query);
}

function mapCards(): HTMLButtonElement[] {
  return [...document.querySelectorAll<HTMLButtonElement>("button.map-card-open")];
}

beforeEach(() => {
  localStorage.clear();
  setQuery("/");
});

describe("app boot", () => {
  it("a fresh browser lands on the title and 'Take the post' opens the first berth", async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByRole("heading", { name: "Sky Dock" })).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Take the post" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("1. Planks in Parallel");

    const saved = JSON.parse(localStorage.getItem("skydock-progress-v1:/")!);
    expect(saved.seenTitle).toBe(true);
    expect(saved.lastLevelId).toBe("c1-01");
  });

  it("leaves every shift open on a fresh save, with one pill per berth", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Take the post" }));
    await user.click(screen.getByRole("button", { name: "Chart" }));

    const cards = mapCards();
    expect(cards).toHaveLength(10);
    expect(cards.filter((c) => c.disabled)).toHaveLength(0);
    // 76 berths, one pill each, all clickable straight from the chart.
    const pills = [...document.querySelectorAll<HTMLButtonElement>("button.map-level")];
    expect(pills).toHaveLength(76);
    expect(pills.filter((b) => b.disabled)).toHaveLength(0);
  });

  it("opens any berth directly from a chart pill", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Take the post" }));
    await user.click(screen.getByRole("button", { name: "Chart" }));

    const finale = document.querySelector<HTMLButtonElement>(
      'button.map-level[aria-label*="Autumn Convoy"]',
    );
    expect(finale, "a pill labelled with the finale title exists").toBeTruthy();
    await user.click(finale!);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Autumn Convoy");
  });

  it("reopens the saved berth and shows 'Resume watch' when a save exists", async () => {
    const saved = defaultProgress();
    saved.lastLevelId = "c1-05";
    saved.seenTitle = true;
    localStorage.setItem("skydock-progress-v1:/", JSON.stringify(saved));

    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Resume watch" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("5. ");
  });

  it("a completed save adds the badge count to the chart", async () => {
    const user = userEvent.setup();
    const saved = defaultProgress();
    saved.completed = ["c1-01", "c1-02"];
    localStorage.setItem("skydock-progress-v1:/", JSON.stringify(saved));
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Resume watch" }));
    await user.click(screen.getByRole("button", { name: "Chart" }));
    expect(screen.getByText("2 berths cleared")).toBeTruthy();
  });
});

describe("query overrides", () => {
  it("the chart is fully open without any query parameter", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Take the post" }));
    await user.click(screen.getByRole("button", { name: "Chart" }));

    expect(mapCards().filter((c) => c.disabled)).toHaveLength(0);
    expect(screen.queryByText(/Sealed until/)).toBeNull();

    const saved = JSON.parse(localStorage.getItem("skydock-progress-v1:/")!);
    expect(saved).not.toHaveProperty("unlockedChapter");
  });

  it("accepts the legacy ?unlock=all param as a harmless no-op", async () => {
    setQuery("/?unlock=all");
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Take the post" }));
    await user.click(screen.getByRole("button", { name: "Chart" }));
    expect(mapCards().filter((c) => c.disabled)).toHaveLength(0);
  });

  it("?level=<id> jumps straight into that berth, even past the campaign frontier", () => {
    setQuery("/?level=c10-08");
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Autumn Convoy");

    const saved = JSON.parse(localStorage.getItem("skydock-progress-v1:/")!);
    expect(saved.lastLevelId).toBe("c10-08");
  });

  it("an unknown ?level id falls back to the normal title flow", () => {
    setQuery("/?level=c99-99");
    render(<App />);
    expect(screen.getByRole("heading", { name: "Sky Dock" })).toBeTruthy();
  });

  it("the glossary lists every entry without any query parameter", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Take the post" }));
    await user.click(screen.getByRole("button", { name: "Glossary" }));
    const count = screen.getByRole("status").textContent!;
    expect(count).toMatch(/^22 of 22 entries$/);
    expect(count).not.toContain("sealed");
  });
});

describe("keyboard paths", () => {
  it("Mod+Enter anywhere on the play screen runs a check", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Take the post" }));
    await user.click(screen.getByText("To the yard"));

    // jsdom has no layout engine, so the starter CSS trivially matches the zero-rect goal;
    // a check that runs is observable as the "Berth cleared" verdict modal.
    fireEvent.keyDown(window, { key: "Enter", metaKey: true, ctrlKey: true });
    expect(screen.getByText("Berth cleared")).toBeTruthy();
  });
});
