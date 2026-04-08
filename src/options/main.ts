import "./styles.css";
import { BUILD_ID } from "../shared/build-info";

document.querySelector<HTMLElement>("#build-id")!.textContent = `v${BUILD_ID}`;
