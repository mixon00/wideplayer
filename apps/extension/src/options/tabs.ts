interface TabsElements {
  defaultTab: string;
  panels: HTMLElement[];
  tabs: HTMLButtonElement[];
}

export function mountTabs({ defaultTab, panels, tabs }: TabsElements): void {
  function activateTab(tabName: string): void {
    for (const tab of tabs) {
      const isActive = tab.dataset.tabTarget === tabName;
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
      tab.dataset.active = String(isActive);
    }

    for (const panel of panels) {
      const isActive = panel.dataset.tabPanel === tabName;
      panel.hidden = !isActive;
    }
  }

  for (const tab of tabs) {
    tab.setAttribute("role", "tab");
    tab.addEventListener("click", () => {
      const nextTab = tab.dataset.tabTarget;

      if (nextTab) {
        activateTab(nextTab);
      }
    });
  }

  for (const panel of panels) {
    panel.setAttribute("role", "tabpanel");
  }

  activateTab(defaultTab);
}
