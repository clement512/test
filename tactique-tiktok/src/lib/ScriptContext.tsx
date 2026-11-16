import React, { createContext, useContext } from "react";
import type { ScriptData } from "../types";

const Ctx = createContext<ScriptData | null>(null);

export const ScriptProvider: React.FC<{
  script: ScriptData;
  children: React.ReactNode;
}> = ({ script, children }) => <Ctx.Provider value={script}>{children}</Ctx.Provider>;

export const useScript = () => {
  const s = useContext(Ctx);
  if (!s) throw new Error("useScript() doit être utilisé dans <ScriptProvider>");
  return s;
};
