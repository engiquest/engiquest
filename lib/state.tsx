'use client';
import {createContext,useContext,useEffect,useRef,useState, type ReactNode} from 'react';
import {FIELDS,type FieldFilter,type Field} from './fields';
import {getDisciplineTheme} from './discipline-themes';
export type Completion={id:string;kind:'lab'|'cad'|'project';field:Field;title:string;score:number;completedAt:string};
export type SavedState={version:1;nickname:string;theme:'dark'|'light';field:FieldFilter;quiz:number[];completions:Record<string,Completion>;checklists:Record<string,boolean[]>;photos:Record<string,string>};
export const STORAGE_KEY='engiquest-progress-v1';
export const freshState=():SavedState=>({version:1,nickname:'Explorer',theme:'dark',field:'all',quiz:[],completions:{},checklists:{},photos:{}});
export function parseSaved(raw:string):SavedState {
 const s=JSON.parse(raw); if(s?.version!==1 || !s.completions || typeof s.completions!=='object')throw Error('Unsupported saved progress');
 const base=freshState();
 base.nickname=typeof s.nickname==='string'?s.nickname.slice(0,24):base.nickname;
 base.theme=s.theme==='light'?'light':'dark';base.field=FIELDS.some(f=>f.id===s.field)?s.field:'all';
 base.quiz=Array.isArray(s.quiz)?s.quiz.slice(0,20).map((x:unknown)=>Number.isInteger(x)&&Number(x)>=0&&Number(x)<=4?Number(x):0):[];
 for(const [key,c] of Object.entries(s.completions) as [string,Completion][]){if(c&&c.id===key&&['lab','cad','project'].includes(c.kind)&&FIELDS.some(f=>f.id===c.field)&&typeof c.title==='string'&&Number.isFinite(c.score)&&typeof c.completedAt==='string')base.completions[key]={...c,score:Math.max(0,Math.min(100,c.score))};}
 if(s.checklists&&typeof s.checklists==='object')for(const [id,checks] of Object.entries(s.checklists)){if(Array.isArray(checks))base.checklists[id]=checks.slice(0,30).map(Boolean)}
 if(s.photos&&typeof s.photos==='object')for(const [id,p] of Object.entries(s.photos)){if(typeof p==='string'&&p.startsWith('data:image/jpeg;base64,')&&p.length<500000)base.photos[id]=p;}
 return base;
}
export function recordCompletion(state:SavedState,c:Completion):SavedState {
 const previous=state.completions[c.id];
 return {...state,completions:{...state.completions,[c.id]:{...c,score:Math.max(c.score,previous?.score??0),completedAt:previous?.completedAt??c.completedAt}}};
}
type Store={data:SavedState;hydrated:boolean;storageError:string;update:(fn:(s:SavedState)=>SavedState)=>void;complete:(c:Omit<Completion,'completedAt'>)=>void};
const Context=createContext<Store|null>(null);
export function ProgressProvider({children}:{children:ReactNode}){
 const [data,setData]=useState(freshState);const [hydrated,setHydrated]=useState(false);const [storageError,setError]=useState('');const dirty=useRef(false);
 useEffect(()=>{try{const raw=localStorage.getItem(STORAGE_KEY);if(raw)setData(parseSaved(raw));}catch{setError('Saved data could not be loaded. The existing copy has not been changed. Export your progress before clearing browser storage.');}setHydrated(true)},[]);
 useEffect(()=>{if(!hydrated)return;const root=document.documentElement;root.dataset.theme=data.theme;root.dataset.field=data.field;const palette=getDisciplineTheme(data.field)[data.theme];for(const [key,value] of Object.entries(palette))root.style.setProperty('--'+(key==='accent2'?'accent-2':key.replace(/[A-Z]/g,c=>'-'+c.toLowerCase())),value);if(!dirty.current)return;try{localStorage.setItem(STORAGE_KEY,JSON.stringify(data));setError('')}catch{setError('Browser storage is full or unavailable. Changes are in memory only. Export your progress now.')}},[data,hydrated]);
 const update=(fn:(s:SavedState)=>SavedState)=>{if(!hydrated)return;dirty.current=true;setData(fn)};
 return <Context.Provider value={{data,hydrated,storageError,update,complete:c=>update(s=>recordCompletion(s,{...c,completedAt:new Date().toISOString()}))}}>{children}</Context.Provider>;
}
export function useProgress(){const c=useContext(Context);if(!c)throw Error('ProgressProvider missing');return c}
