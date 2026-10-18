'use client';
import {useEffect,useRef,type ReactNode} from 'react';
import {X} from 'lucide-react';
export default function Overlay({title,onClose,children,drawer=false}:{title:string;onClose:()=>void;children:ReactNode;drawer?:boolean}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const el=ref.current;el?.showModal();return()=>el?.close()},[]);
 return <dialog ref={ref} className={drawer?'overlay drawer':'overlay'} onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose()}} aria-label={title}><div className="overlay-inner"><header className="overlay-header"><h2>{title}</h2><button className="icon-button" aria-label={`Close ${title}`} onClick={onClose}><X size={22}/></button></header>{children}</div></dialog>
}
