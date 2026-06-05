import asyncio, json, re, base64
from pathlib import Path
from playwright.async_api import async_playwright
ROOT = Path('/mnt/data/ehdude-dashboard')

def inline_html():
    html=(ROOT/'index.html').read_text()
    theme=(ROOT/'css/theme.css').read_text()
    dash=(ROOT/'css/dashboard.css').read_text()
    js=(ROOT/'js/dashboard.js').read_text()
    # remove link styles
    html=re.sub(r'\s*<link rel="stylesheet" href="css/theme.css" />', '', html)
    html=re.sub(r'\s*<link rel="stylesheet" href="css/dashboard.css" />', '', html)
    html=html.replace('</head>', f'<style>{theme}\n{dash}</style></head>')
    html=html.replace('<script type="module" src="js/dashboard.js"></script>', f'<script>{js}</script>')
    return html

async def main():
  html=inline_html()
  results=[]
  async with async_playwright() as p:
    browser=await p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'])
    shots=ROOT/'screenshots'; shots.mkdir(exist_ok=True)
    for name,w,h in [('desktop',1366,768),('tablet',768,1024),('mobile430',430,932),('mobile390',390,844),('mobile360',360,740),('mobile320',320,568),('mobile320short',320,520)]:
      page=await browser.new_page(viewport={'width':w,'height':h}, device_scale_factor=1, is_mobile=w<768)
      await page.route('**/*', lambda route: route.abort())
      await page.set_content(html, wait_until='domcontentloaded')
      await page.screenshot(path=str(shots/f'{name}_closed.png'), full_page=True)
      await page.click('#startBtn')
      await page.wait_for_timeout(120)
      metrics=await page.evaluate('''() => {
        const vp={w:innerWidth,h:innerHeight};
        const sm=document.querySelector('#startMenu').getBoundingClientRect();
        const footer=document.querySelector('.footer').getBoundingClientRect();
        const topbar=document.querySelector('.top-bar').getBoundingClientRect();
        const theme=document.querySelector('#themeToggle').getBoundingClientRect();
        const icons=[...document.querySelectorAll('.top-bar > button')].map(el=>el.getBoundingClientRect()).map(r=>({left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}));
        const overlaps=(a,b)=>!(a.right<=b.left||a.left>=b.right||a.bottom<=b.top||a.top>=b.bottom);
        return {viewport:vp,startMenu:{top:sm.top,bottom:sm.bottom,left:sm.left,right:sm.right,height:sm.height,width:sm.width},footer:{top:footer.top,bottom:footer.bottom,height:footer.height},topbar:{top:topbar.top,bottom:topbar.bottom,left:topbar.left,right:topbar.right,width:topbar.width},themeToggle:{left:theme.left,right:theme.right,top:theme.top,bottom:theme.bottom,width:theme.width,height:theme.height},themeOverlapsDock:icons.some(i=>overlaps(theme,i)),iconSizes:icons,footerVisible:footer.bottom<=vp.h+0.5&&footer.top>=-0.5,menuVisible:sm.bottom<=vp.h+0.5&&sm.top>=-0.5&&sm.left>=-0.5&&sm.right<=vp.w+0.5,bodyScrollW:document.documentElement.scrollWidth,bodyScrollH:document.documentElement.scrollHeight};
      }''')
      await page.screenshot(path=str(shots/f'{name}_start_open.png'), full_page=True)
      await page.click('#startBtn')
      await page.click('#scrobbleToggle')
      await page.wait_for_timeout(120)
      pmetrics=await page.evaluate('''() => {
        const vp={w:innerWidth,h:innerHeight};
        const panel=document.querySelector('#scrobblePanel').getBoundingClientRect();
        const topbar=document.querySelector('.top-bar').getBoundingClientRect();
        return {panel:{top:panel.top,bottom:panel.bottom,left:panel.left,right:panel.right,height:panel.height,width:panel.width},panelVisible:panel.bottom<=vp.h+0.5&&panel.top>=-0.5&&panel.left>=-0.5&&panel.right<=vp.w+0.5,panelBelowTopbar:panel.top>=topbar.bottom-1};
      }''')
      await page.screenshot(path=str(shots/f'{name}_scrobble_open.png'), full_page=True)
      results.append({'name':name,'viewport':[w,h],**metrics,**pmetrics})
      await page.close()
    await browser.close()
  (ROOT/'layout-check.json').write_text(json.dumps(results,indent=2))
  print(json.dumps(results,indent=2))
asyncio.run(main())
