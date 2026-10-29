import { useEffect, useRef } from 'react';

// Keyboard basics for a modal dialog: focus moves inside on open, Escape closes,
// Tab stays inside, and focus returns to the element that opened it.
export function useDialogKeys(onClose){
  const ref=useRef(null);
  useEffect(()=>{
    const opener=document.activeElement;
    const node=ref.current;
    const focusables=()=>[...(node?.querySelectorAll('a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])')||[])];
    // On touch screens focus the dialog itself: focusing a field would pop the keyboard over the sheet.
    const coarse=window.matchMedia?.('(pointer: coarse)').matches;
    if(coarse&&node){node.tabIndex=-1;node.focus({preventScroll:true});}
    else (node?.querySelector('[data-autofocus]')||focusables()[0])?.focus({preventScroll:true});
    const onKey=e=>{
      if(e.key==='Escape'){e.preventDefault();onClose?.();return;}
      if(e.key!=='Tab')return;
      const list=focusables();if(!list.length)return;
      const first=list[0],last=list[list.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    };
    document.addEventListener('keydown',onKey);
    return ()=>{document.removeEventListener('keydown',onKey);if(opener&&document.contains(opener))opener.focus?.({preventScroll:true});};
  },[]);
  return ref;
}
