/**
 * Applied before first paint, so a stored theme choice does not arrive as a
 * flash of the other one. It marks the document as scripted at the same time,
 * which is what the no-JavaScript fallbacks in the sheets key off.
 */
export function ThemeScript() {
  const js = `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('nd-theme');if(t==='light'||t==='dark')d.dataset.theme=t}catch(e){}})();`
  return <script dangerouslySetInnerHTML={{ __html: js }} />
}
