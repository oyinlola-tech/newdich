
export function ThemeScript() {
  const js = `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('nd-theme');if(t==='light'||t==='dark')d.dataset.theme=t}catch(e){}})();`
  return <script dangerouslySetInnerHTML={{ __html: js }} />
}
