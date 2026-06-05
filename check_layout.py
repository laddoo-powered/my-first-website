import asyncio, json, os, subprocess, time
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path('/mnt/data/ehdude-dashboard')
PORT = 8777

async def main():
    server = subprocess.Popen(['python3','-m','http.server',str(PORT)], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(0.6)
    results = []
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(executable_path="/usr/bin/chromium", args=["--no-sandbox"])
            for name, w, h in [
                ('desktop', 1366, 768),
                ('tablet', 768, 1024),
                ('mobile430', 430, 932),
                ('mobile390', 390, 844),
                ('mobile360', 360, 740),
                ('mobile320', 320, 568),
                ('mobile320short', 320, 520),
            ]:
                page = await browser.new_page(viewport={'width': w, 'height': h}, device_scale_factor=1, is_mobile=w<768)
                await page.goto((ROOT / 'index.html').as_uri(), wait_until='load')
                # closed screenshot
                await page.screenshot(path=str(ROOT / f'{name}_closed.png'), full_page=True)
                # start menu open
                await page.click('#startBtn')
                await page.wait_for_timeout(250)
                metrics = await page.evaluate('''() => {
                  const vp = {w: innerWidth, h: innerHeight};
                  const sm = document.querySelector('#startMenu').getBoundingClientRect();
                  const footer = document.querySelector('.footer').getBoundingClientRect();
                  const topbar = document.querySelector('.top-bar').getBoundingClientRect();
                  return {
                    viewport: vp,
                    startMenu: {top: sm.top, bottom: sm.bottom, left: sm.left, right: sm.right, height: sm.height, width: sm.width},
                    footer: {top: footer.top, bottom: footer.bottom, height: footer.height},
                    topbar: {top: topbar.top, bottom: topbar.bottom, left: topbar.left, right: topbar.right, width: topbar.width},
                    footerVisible: footer.bottom <= vp.h + 0.5 && footer.top >= -0.5,
                    menuVisible: sm.bottom <= vp.h + 0.5 && sm.top >= -0.5 && sm.left >= -0.5 && sm.right <= vp.w + 0.5,
                    bodyScrollW: document.documentElement.scrollWidth,
                    bodyScrollH: document.documentElement.scrollHeight,
                  };
                }''')
                await page.screenshot(path=str(ROOT / f'{name}_start_open.png'), full_page=True)
                await page.click('#startBtn')
                # scrobble panel open
                await page.click('#scrobbleToggle')
                await page.wait_for_timeout(250)
                pmetrics = await page.evaluate('''() => {
                  const vp = {w: innerWidth, h: innerHeight};
                  const panel = document.querySelector('#scrobblePanel').getBoundingClientRect();
                  const topbar = document.querySelector('.top-bar').getBoundingClientRect();
                  return {
                    panel: {top: panel.top, bottom: panel.bottom, left: panel.left, right: panel.right, height: panel.height, width: panel.width},
                    topbar: {top: topbar.top, bottom: topbar.bottom},
                    panelVisible: panel.bottom <= vp.h + 0.5 && panel.top >= -0.5 && panel.left >= -0.5 && panel.right <= vp.w + 0.5,
                    panelBelowTopbar: panel.top >= topbar.bottom - 1,
                  };
                }''')
                await page.screenshot(path=str(ROOT / f'{name}_scrobble_open.png'), full_page=True)
                results.append({'name':name,'viewport':[w,h],**metrics,**pmetrics})
                await page.close()
            await browser.close()
    finally:
        server.terminate()
    print(json.dumps(results, indent=2))

asyncio.run(main())
