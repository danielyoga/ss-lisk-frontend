"use client";

import { useState } from "react";

export const Counter = () => {
  const [count, setCount] = useState<number>(0);
  return (
    <>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Plus+1</button>;
    </>
  );
};
