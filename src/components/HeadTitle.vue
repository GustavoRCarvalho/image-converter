<template>
  <h1>ITOA: Image to ASCII Converter</h1>
</template>
<style scoped>
@keyframes title-flicker {
  0% {
    text-shadow: 0 0 5px var(--pink);
  }
  3% {
    text-shadow: 0 0 10px var(--pink), 0 0 20px var(--pink);
  }
  4% {
    text-shadow: none;
  }
  6% {
    text-shadow: 0 0 10px var(--pink), 0 0 20px var(--pink);
  }
  7% {
    text-shadow: 0 0 5px var(--pink);
  }
  8% {
    text-shadow: none;
  }
  9% {
    text-shadow: 0 0 5px var(--pink);
  }
  10% {
    text-shadow: none;
  }
  11% {
    text-shadow: 0 0 5px var(--pink);
  }
  50% {
    text-shadow: 0 0 5px var(--pink);
  }
  51% {
    text-shadow: none;
  }
  52% {
    text-shadow: 0 0 5px var(--pink);
  }
  100% {
    text-shadow: 0 0 5px var(--pink);
  }
}

@keyframes glitch-before {
  0% {
    clip-path: inset(20% -6px 70% 0px);
  }
  10% {
    clip-path: inset(80% -6px 5% 0px);
  }
  20% {
    clip-path: inset(20% -6px 85% 0px);
  }
  30% {
    clip-path: inset(0% -6px 50% 0px);
  }
  40% {
    clip-path: inset(60% -6px 30% 0px);
  }
  50% {
    clip-path: inset(10% -6px 85% 0px);
  }
  60% {
    clip-path: inset(40% -6px 43% 0px);
  }
  70% {
    clip-path: inset(5% -6px 95% 0px);
  }
  80% {
    clip-path: inset(70% -6px 20% 0px);
  }
  90% {
    clip-path: inset(20% -6px 60% 0px);
  }
  100% {
    clip-path: inset(60% -6px 40% 0px);
  }
}

@keyframes glitch-after {
  0% {
    clip-path: inset(40% 0px 60% -6px);
  }
  10% {
    clip-path: inset(20% 0px 80% -6px);
  }
  20% {
    clip-path: inset(60% 0px 20% -6px);
  }
  30% {
    clip-path: inset(80% 0px 5% -6px);
  }
  40% {
    clip-path: inset(10% 0px 90% -6px);
  }
  50% {
    clip-path: inset(50% 0px 30% -6px);
  }
  60% {
    clip-path: inset(30% 0px 60% -6px);
  }
  70% {
    clip-path: inset(70% 0px 20% -6px);
  }
  80% {
    clip-path: inset(15% 0px 80% -6px);
  }
  90% {
    clip-path: inset(40% 0px 50% -6px);
  }
  100% {
    clip-path: inset(80% 0px 20% -6px);
  }
}
h1 {
  font-size: 1.6em;
  color: var(--pink);
  letter-spacing: 0.2rem;
  text-align: center;
  position: relative;
  font-family: Unifont, monospace;
  margin-bottom: 1em;

  animation: 8s ease 0s infinite normal none running title-flicker;
}

h1::before,
h1::after {
  content: "ITOA: Image to ASCII Converter";
  position: absolute;
  left: 0px;
  right: 0px;
  background: transparent;
}
h1::before {
  text-shadow: 2px 0 var(--blue);
  animation: 6s linear 0s infinite alternate-reverse none running glitch-before;
}
h1::after {
  text-shadow: -2px 0 var(--pink);
  animation: 4s linear 0s infinite alternate-reverse none running glitch-after;
}
</style>
