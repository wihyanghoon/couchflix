import { atom } from "recoil"

export const offestState = atom({
    key: "offestState",
    default: window.innerWidth <= 768 ? 2 : window.innerWidth <= 1024 ? 3 : 6
})