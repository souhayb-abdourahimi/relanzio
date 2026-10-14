#!/bin/sh
set -eu

npm run dev:client -- --host 127.0.0.1 >/tmp/relanzio-mobile-vite.log 2>&1 &
VITE_PID=$!
cleanup(){ kill "$VITE_PID" >/dev/null 2>&1 || true; }
trap cleanup EXIT INT TERM

ready=0
for i in $(seq 1 30); do
  if wget -q -O /dev/null http://127.0.0.1:5173/mobile-fixture.html; then
    ready=1
    break
  fi
  sleep 1
done

if [ "$ready" -ne 1 ]; then
  cat /tmp/relanzio-mobile-vite.log
  echo "Mobile DOM QA: Vite fixture did not start" >&2
  exit 1
fi

CHROME="$(command -v chromium-browser || command -v chromium || true)"
if [ -z "$CHROME" ]; then
  echo "Mobile DOM QA: Chromium is not installed" >&2
  exit 1
fi

for size in 390,844 412,915; do
  "$CHROME" --headless --no-sandbox --disable-gpu --window-size="$size" --virtual-time-budget=5000     --dump-dom 'http://127.0.0.1:5173/mobile-fixture.html?qa=1' >/tmp/relanzio-mobile-dom.html 2>/tmp/relanzio-chromium.log
  if ! grep -q 'data-mobile-qa="pass"' /tmp/relanzio-mobile-dom.html; then
    cat /tmp/relanzio-mobile-dom.html
    cat /tmp/relanzio-chromium.log
    echo "Mobile DOM QA failed at $size" >&2
    exit 1
  fi
done

echo "Mobile DOM QA PASS: 390x844 and 412x915, drawer->plans/logout/close/touch/overflow verified"

for size in 390,844 412,915 1280,900; do
  "$CHROME" --headless --no-sandbox --disable-gpu --window-size="$size" --virtual-time-budget=5000     --dump-dom 'http://127.0.0.1:5173/plans-fixture.html?qa=1' >/tmp/relanzio-plans-dom.html 2>/tmp/relanzio-plans-chromium.log
  if ! grep -q 'data-plans-qa="pass"' /tmp/relanzio-plans-dom.html; then
    cat /tmp/relanzio-plans-dom.html
    cat /tmp/relanzio-plans-chromium.log
    echo "Plans DOM QA failed at $size" >&2
    exit 1
  fi
done

"$CHROME" --headless --no-sandbox --disable-gpu --window-size=390,844 --virtual-time-budget=5000   --dump-dom 'http://127.0.0.1:5173/plans-fixture.html?qa=1&trial=1&billing=1' >/tmp/relanzio-plans-trial-dom.html 2>/tmp/relanzio-plans-chromium.log
if ! grep -q 'data-plans-qa="pass"' /tmp/relanzio-plans-trial-dom.html; then
  cat /tmp/relanzio-plans-trial-dom.html
  cat /tmp/relanzio-plans-chromium.log
  echo "Plans trial DOM QA failed" >&2
  exit 1
fi

"$CHROME" --headless --no-sandbox --disable-gpu --hide-scrollbars --window-size=390,844 --virtual-time-budget=2500   --screenshot=/tmp/relanzio-plans-390.png 'http://127.0.0.1:5173/plans-fixture.html' >/tmp/relanzio-plans-shot.log 2>&1
echo "Plans DOM QA PASS: 390x844, 412x915 and 1280x900; two offers, limits, disabled billing state, trial state, touch targets and no horizontal overflow verified"
echo "Plans visual proof generated: /tmp/relanzio-plans-390.png ($(sha256sum /tmp/relanzio-plans-390.png | cut -d' ' -f1))"

for size in 390,844 1280,900; do
  "$CHROME" --headless --no-sandbox --disable-gpu --window-size="$size" --virtual-time-budget=5000     --dump-dom 'http://127.0.0.1:5173/trial-fixture.html?qa=1' >/tmp/relanzio-trial-dom.html 2>/tmp/relanzio-trial-chromium.log
  if ! grep -q 'data-trial-qa="pass"' /tmp/relanzio-trial-dom.html; then
    cat /tmp/relanzio-trial-dom.html
    cat /tmp/relanzio-trial-chromium.log
    echo "Trial DOM QA failed at $size" >&2
    exit 1
  fi
done

echo "Trial DOM QA PASS: 390x844 and 1280x900, status/CTA/touch/overflow verified"
