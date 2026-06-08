"use client";

import { AppStore, makeStore } from "@/redux/store";
import { Provider } from "react-redux";
import { useState } from "react";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store] = useState<AppStore>(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}
