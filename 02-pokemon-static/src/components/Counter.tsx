import { createSignal } from "solid-js";

export const Counter = () => {
  const [counter, setCounter] = createSignal(10);

  return (
    <>
      <h1 class="text-4xl">Counter</h1>
      <h3 class="text-xl">Value: {counter()}</h3>

      <button
        class="mr-2 rounded bg-blue-500 p-2"
        onClick={() => setCounter((prev) => ++prev)}
      >
        +1
      </button>
      <button
        class="mr-2 rounded bg-blue-500 p-2"
        onClick={() => setCounter((prev) => --prev)}
      >
        -1
      </button>
    </>
  );
};
